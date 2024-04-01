async function ApiFunction({ method, link, data, token }) {
    try {
        const responce = await fetch("http://localhost:3500/roles/" + link, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'authorization': 'Bearer ' + token
            },
            credentials: "include",
            body: JSON.stringify({ ...data })
        })

        const dataRecieved = responce.json()
        return dataRecieved
    } catch (error) {
        return { status: 'error', message: "Fetching error" }
    }
}

export default ApiFunction