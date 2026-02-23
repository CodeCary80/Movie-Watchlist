const searchBar = document.querySelector('.search-bar')
const searchBtn = document.getElementById('search-btn')
const search = document.getElementById('search')
const content = document.querySelector(".content")

let currentMovies = []

search.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchBtn.click()
})

searchBtn.addEventListener('click',async()=>{
    const query = search.value.trim()

    if(!query) return

    content.innerHTML = `<p style="padding: 20px">Loading...</p>` 

    const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`)
    const movies = await res.json()

    if (movies.Response === 'False') {
    content.innerHTML = `<h2>Unable to find what you're looking for. Please try another search.</h2>`
    return
    }

    const ids = movies.Search.map(movie=>movie.imdbID)

    const detailedMovies = await Promise.all(
        ids.map(async(id)=>{
            const res = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`)
            return await res.json()
        })
    )

    render(detailedMovies)
})


function handleWatchlist(movie){
    let movieIds =  JSON.parse(localStorage.getItem('movieIds')) || []

    movieIds.push(movie)

    localStorage.setItem('movieIds', JSON.stringify(movieIds))

}


document.querySelector('.content').addEventListener('click', async (e) => {
    if (e.target.dataset.add) {
        const id = e.target.dataset.add  // gets the imdbID from data-add attribute
        
        const movie = currentMovies.find(m=>m.imdbID === id)

        e.target.closest('p').remove()

        handleWatchlist(movie)
    }
})


function render(movies) {
    currentMovies = movies
    let contentHTML = ''
    const watchlist = JSON.parse(localStorage.getItem("movieIds")) || []
    const watchlistIds = watchlist.map(m => m.imdbID)  // get just the IDs for easy lookup

    movies.forEach(movie => {
        const imdbRating = movie.Ratings.find(r => r.Source === 'Internet Movie Database')?.Value || 'N/A'
        const rtRating = movie.Ratings.find(r => r.Source === 'Rotten Tomatoes')?.Value || 'N/A'
        const isInWatchlist = watchlistIds.includes(movie.imdbID)  // check if already added

        contentHTML += `
            <div class="movie-info">
                <img src="${movie.Poster}" />
                <div class="movie-detail">
                    <div class="movie-heading">
                        <h2>${movie.Title}</h2>
                        <p>${movie.Year}</p>
                        <span>⭐ ${imdbRating}</span>
                        <span>🍅 ${rtRating}</span>
                    </div>
                    <div class="movie-main">
                        <p>${movie.Runtime}</p>
                        <p>${movie.Genre}</p>
                        ${isInWatchlist 
                            ? `<p>✅ Watchlisted</p>` 
                            : `<p><i class="fa-solid fa-circle-plus" data-add="${movie.imdbID}"></i> Add to Watchlist</p>`
                        }
                    </div>
                    <p>${movie.Plot}</p>
                </div>
            </div>
        `
    })

    content.innerHTML = contentHTML
    content.classList.add('has-result')
}