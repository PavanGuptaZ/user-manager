async function ApiFunction(type, data) {
    try {
        const responce = await fetch(process.env.REACT_APP_DATEBASE_URL + "/auth/" + type, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
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