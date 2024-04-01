import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import getUserApi from '../../apis/auth/getUserApi';
import getRolesList from '../../apis/roles/roleslistApi';
import rolesMutationList from '../../apis/roles/rolesMutationApi';
import { useGetAccessToken, useUserLoading } from '../../hooks';
import LoadingComponent from '../loading/LoadingPage';
import styles from '../../assets/scss/manage/Users.module.scss'
import { UserIconsIndex } from '../../assets/images/users/UserIconsIndex';
import { useState } from 'react';
import { toast } from 'react-toastify';


export default function UserProfile() {
    const { id } = useParams()
    const token = useGetAccessToken()
    const loading = useUserLoading()

    const UserQuery = useQuery({
        queryKey: [`userDetails - ${id}`],
        queryFn: () => getUserApi({ token, id }),
        enabled: !!token
    })


    if (UserQuery.isLoading || loading) {
        return <LoadingComponent />
    } else if (UserQuery.data.status === 'error' || UserQuery.isError || !UserQuery.data?.user) {
        return <div>{UserQuery.data?.message || "SomeThing Went Wrong"}</div>
    }
    const { email, firstname, lastname, profileIcon, role, _id } = UserQuery.data?.user
    return (
        <div className={styles.UserProfileBlock}>
            <div className={styles.imageBox}>
                <UserIconsIndex profileIcon={profileIcon} />
                <div className={styles.details}>
                    <div>{firstname} {lastname}</div>
                    <div>{email}</div>
                </div>
                <UserRoleHandler role={role} id={_id} />
            </div>
        </div>
    )
}

export const UserRoleHandler = ({ role, id }) => {
    const [roleInput, setRoleInput] = useState(role || "")
    const token = useGetAccessToken()
    const queryClient = useQueryClient()
    const RolesListQuery = useQuery({
        queryKey: [`rolesList`],
        queryFn: () => getRolesList({ token, link: 'allnames' }),
        enabled: !!token
    })
    const RoleMutation = useMutation({
        mutationKey: [`roleUpdate - ${id}`],
        mutationFn: (data) => rolesMutationList({ token, link: "rolechange", method: "PATCH", data }),
        onSuccess: (data) => {
            if (data.status === 'success') {
                toast.info("Role Updated to User")
                queryClient.invalidateQueries({ queryKey: [`userDetails - ${id}`] })
            } else {
                toast.warn(data.message)
            }
        }
    })
    const handleSubmit = (e) => {
        e.preventDefault()
        RoleMutation.mutate({ id, roleInput })
    }
    return (
        <form onSubmit={handleSubmit}>
            <select name='role' style={{ margin: "auto" }}
                value={roleInput} onChange={(e) => setRoleInput(e.target.value)}>
                {RolesListQuery.data && RolesListQuery.data?.status === "success" ? (
                    <>
                        <option value="">--Please choose an option--</option>
                        {RolesListQuery.data.rolesList.map((ele) => {
                            return <option key={ele._id} value={ele._id}>{ele.name}</option>
                        })}
                    </>
                ) :
                    <option value="">no Role is Avaliable</option>
                }
            </select>
            <button>Submit</button>
        </form>
    )
}
