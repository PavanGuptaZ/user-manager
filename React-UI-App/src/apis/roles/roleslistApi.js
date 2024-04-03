async function ApiFunction({ token, link }) {
    try {
        const responce = await fetch(process.env.REACT_APP_DATEBASE_URL + "/roles/" + link, {
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

export default ApiFunction