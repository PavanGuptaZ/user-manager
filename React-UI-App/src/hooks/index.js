import { useContext } from "react";
import { UserContext } from "./ContextProvider";

export function userReducer(state, action) {

    switch (action.type) {
        case "addUser":
            return { ...action.payload }
        case "updateUser":
            return { ...state, ...action.payload }
        case "removeUser":
            return null
        default:
            return state;
    }
}


export const useGetUser = () => {
    const data = useContext(UserContext)
    return data.user || false
}

export const useGetAccessToken = () => {
    const data = useContext(UserContext)
    return data.user?.accessToken || false
}

export const useUserLoading = () => {
    const data = useContext(UserContext)
    return data.userLoading || data.roleLoading
}

export const useUserFetching = () => {
    const data = useContext(UserContext)
    return data.userFetching
}

export const useUserPermission = () => {
    const data = useContext(UserContext)
    return data.permission
}
