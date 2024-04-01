import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import roleslistApi from '../../apis/roles/roleslistApi';
import rolesMutationApi from '../../apis/roles/rolesMutationApi';
import { LoadingComponent } from '../../components/loading/LoadingComp';
import { useGetAccessToken } from '../../hooks';
import styles from '../../assets/scss/manage/roles.module.scss';
import { toast } from 'react-toastify';

let list = ['projects', 'tasks', 'timesheet', 'leaders', 'our_clients', 'clients', 'client_profile', 'employees', 'members', 'holidays', 'attendance']

function Roles() {
    const [roles, setRoles] = useState([])
    const token = useGetAccessToken()

    const rolesQuery = useQuery({
        queryKey: ['rolesList'],
        queryFn: () => roleslistApi({ token, link: "all" }),
        enabled: !!token
    })
    useEffect(() => {
        if (rolesQuery.data?.status === 'success') {
            setRoles(rolesQuery.data.rolesList)
        }
    }, [rolesQuery])


    return (
        <>
            <div>
                <ADDRoles roles={roles} setRoles={setRoles} />
            </div>
            {rolesQuery.isLoading ? (
                <LoadingComponent />
            ) : rolesQuery.data?.status === 'error' ? (
                <div style={{ textAlign: "center", textTransform: "capitalize" }}>{rolesQuery.data.message}</div>
            ) : (
                <div className={styles.RolesBlockList}>{roles.map((ele, i) => <RolesBlock key={i} data={ele} setRoles={setRoles} />)}</div>
            )}
        </>
    );
}

export default Roles


const ADDRoles = () => {
    const [name, setName] = useState("")
    const queryClient = useQueryClient()
    const token = useGetAccessToken()

    const rolesMutation = useMutation({
        mutationKey: ['rolesMutation'],
        mutationFn: (data) => rolesMutationApi({ ...data, token }),
        onSuccess: (data) => {
            if (data.status === 'success') {
                queryClient.invalidateQueries({ queryKey: ['rolesList'] }).then(() => {
                    toast.info('added')
                })
            } else if (data.message) {
                toast.warn(data.message)
            }
        }
    })

    const HandleADD = (e) => {
        e.preventDefault()
        if (name.length >= 5 && name.length <= 10) {
            rolesMutation.mutate({ data: { name }, method: "POST", link: "add" })
        } else {
            toast.info('Name should be 5 to 10 characters')
        }
    }
    return (
        <div style={{ margin: "16px" }}>
            <div >Add Role</div>
            <form onSubmit={HandleADD}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <button style={{ outline: "none", border: "none", background: "#484C7F", color: "#fff" }}
                    disabled={rolesMutation.isLoading}>{rolesMutation.isLoading ? "loading" : "Submit"}</button>
            </form>
        </div>
    )
}

export const RolesBlock = ({ data, setRoles }) => {
    const [input, setInput] = useState(data)
    const token = useGetAccessToken()
    const queryClient = useQueryClient()

    const handleCheckboxChange = (key) => {
        setInput(prev => ({ ...prev, [key]: !prev[key] }));
    };
    const updateMutation = useMutation({
        mutationKey: [`update - ${data._id}`],
        mutationFn: (data) => rolesMutationApi({ method: 'PATCH', token, link: `update/${data._id}`, data }),
        onSuccess: (data) => {
            if (data?.status === 'success') {
                // setRoles((prev) => prev.map((ele) => ele._id === data.updatedRole._id ? data?.updatedRole : ele))
                queryClient.invalidateQueries({ queryKey: ['rolesList'] }).then(() => {
                    toast.info('updated')
                })

            }
        }
    })
    const handleSubmit = (e) => {
        e.preventDefault()
        if (data !== input) {
            updateMutation.mutate(input)
        } else {
            toast.info('Nothing Is Changed')
        }
    }
    return (
        <div className={styles.RolesBlock}>
            <div className={styles.title}>{input.name}</div>
            <form className={styles.properties} onSubmit={handleSubmit}>
                {list.map((ele, i) => {
                    return (
                        <div key={i} className={styles.box} >
                            <label >{ele}</label>
                            <input style={{ cursor: "pointer" }} type='checkbox' checked={input[ele]} onChange={() => handleCheckboxChange(ele)} />
                        </div>
                    )
                })}
                <button >Submit</button>
            </form>
        </div>
    )
}

