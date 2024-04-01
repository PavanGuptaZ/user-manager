import React, { createContext, useEffect, useState } from 'react';
import { useReducer } from 'react';
import { userReducer } from './index.js';
import { useQuery } from '@tanstack/react-query';
import refreshApiFunction from '../apis/auth/RefreshApi.js';
import GetUserRoles from '../apis/roles/roleslistApi.js';



export const UserContext = createContext()

export const ContextProvider = ({ children }) => {
    const [data, dispatchData] = useReducer(userReducer, null)
    const [permission, setPermission] = useState({ projects: false, tasks: false, timesheet: false, leaders: false, our_clients: false, clients: false, client_profile: false, employees: false, members: false, holidays: false, attendance: false })

    const userQuery = useQuery({
        queryKey: ['refresh'],
        queryFn: () => refreshApiFunction(),
        refetchInterval: 50 * 60 * 1000
    })
    const userRolesQuery = useQuery({
        queryKey: ['roles'],
        queryFn: () => GetUserRoles({
            link: `userRoles/${userQuery.data.user._id}`,
            token: userQuery.data.user.accessToken || ""
        }),
        enabled: !!data
    })

    useEffect(() => {
        if (userRolesQuery.data?.status === "success") {
            setPermission({ ...userRolesQuery.data.role })
        }
    }, [userRolesQuery.data])

    useEffect(() => {
        if (userQuery.data?.status === "success") {
            dispatchData({ type: 'addUser', payload: userQuery.data.user })
        }
    }, [userQuery.data])

    return (
        <UserContext.Provider value={{
            user: data,
            dispatchData,
            permission,
            userLoading: userQuery.isLoading,
            roleLoading: userRolesQuery.isLoading,
            userFetching: userQuery.isFetching
        }}>
            {children}
        </UserContext.Provider>
    )
}
