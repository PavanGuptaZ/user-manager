import React from 'react';
import styles from '../../assets/scss/manage/Users.module.scss'
import { UserIconsIndex } from '../../assets/images/users/UserIconsIndex'
import { useQuery } from '@tanstack/react-query';
import getListApi from '../../apis/auth/getListApi';
import { useGetAccessToken } from '../../hooks';
import { LoadingComponent } from '../../components/loading/LoadingComp';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function Users() {
    const token = useGetAccessToken()
    const UserQuery = useQuery({
        queryKey: ['userList'],
        queryFn: () => getListApi({ token }),
        enabled: !!token
    })

    if (UserQuery.isLoading) {
        return <LoadingComponent />
    } else if (UserQuery.data.status === 'error') {
        return <div>{UserQuery.data.message}</div>
    }

    return (
        <div className={styles.UsersBox}>
            {UserQuery.data.usersList.map((ele, i) => {
                return (
                    <UsersBlock key={i} profileIcon={1} data={ele} />
                )
            })}
        </div>
    )
}

export default Users


const UsersBlock = ({ data }) => {
    const history = useHistory()
    return (
        <div className={styles.userBlock} onClick={() => history.push(`${process.env.PUBLIC_URL}/user/${data._id}`)}>
            <div className={styles.profileIcon}>
                <UserIconsIndex profileIcon={data.profileIcon} />
            </div>
            <div className={styles.fullName}>{data.firstname} {data.lastname}</div>
            <div className={styles.email}>{data.email}</div>
        </div>
    )
}
