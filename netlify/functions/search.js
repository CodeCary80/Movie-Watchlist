exports.handler = async (event) => {
    const { query, id } = event.queryStringParameters
    const API_KEY = process.env.API_KEY

    const url = query
        ? `https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`
        : `https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`

    const res = await fetch(url)
    const data = await res.json()

    return {
        statusCode: 200,
        body: JSON.stringify(data)
    }
}