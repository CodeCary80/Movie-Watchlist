const content = document.querySelector(".content")

document.addEventListener('click',(e)=>{
    if(e.target.dataset.remove){
        removeMovie(e.target.dataset.remove)
    }
})

function removeMovie(imdbID){
    const movies = JSON.parse(localStorage.getItem("movieIds")) || []

    const updated = movies.filter((movie)=>{
        return movie.imdbID !== imdbID
    })

    localStorage.setItem("movieIds",JSON.stringify(updated))

    render()
}

function render() {
    let listItems = ""
    const movies = JSON.parse(localStorage.getItem("movieIds")) || []

    if (movies.length > 0) {
        movies.forEach(movie => {
            const imdbRating = movie.Ratings.find(r => r.Source === 'Internet Movie Database')?.Value || 'N/A'
            const rtRating = movie.Ratings.find(r => r.Source === 'Rotten Tomatoes')?.Value || 'N/A'

            listItems += `
                <div class="movie-info movie-info-collected">
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
                            <p>
                                <i class="fa-solid fa-circle-minus" data-remove="${movie.imdbID}"></i> 
                                Remove
                            </p>
                        </div>
                        <p>${movie.Plot}</p>
                    </div>
                </div>
            `
        })
    } else {
        listItems = `
            <div class="empty-watchlist">
                <h2>Your watchlist is looking a little empty...</h2>
                <a href="./index.html">
                    <i class="fa-solid fa-circle-plus"></i> 
                    Let's add some movies!
                </a>
            </div>
        `
    }

    content.innerHTML = listItems
}

render()