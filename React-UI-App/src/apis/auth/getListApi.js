export default async function getListApi({ token }) {
    try {
        const responce = await fetch(process.env.REACT_APP_DATEBASE_URL + "/auth/list", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'authorization': 'Bearer ' + token
            },
            credentials: "include",
        })

        const dataRecieved = responce.json()
        return dataRecieved
    } catch (error) {
        return { status: 'error', message: "Fetching error" }
    }
}
