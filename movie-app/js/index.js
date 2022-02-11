
// let url = 'https://api.themoviedb.org/3/search/movie?api_key=b9faf408359afa818cfad895e40dfa27&language=en-US&include_adult=false&page=1';
let search = document.querySelector(".search__input");
let searchClear = document.querySelector(".search__clear");
let movies = document.querySelector(".movies");

let api = {
  baseUrl : "https://api.themoviedb.org/3/",
  api_key : "b9faf408359afa818cfad895e40dfa27",
  language : "en-US",
  adult : false,
  searchMovieUrl : function({query,page = 1}){
    let method = "search/movie";
    return `${this.baseUrl}${method}?api_key=${this.api_key}&language=${this.language}&page=${page}&query=${query}`;
  },
  popularMovieUrl : function(){
    let method = "movie/popular";
    return `${this.baseUrl}${method}?api_key=${this.api_key}&language=${this.language}`;    
  }
}


async function init(){

  showMovies( await getMovies( api.popularMovieUrl() ));

  search.addEventListener("keyup", async (e) => {
    if ( (e.key === "Enter" || e.keyCode === 13) && e.currentTarget.value) {
      showMovies( await getMovies( api.searchMovieUrl({query:e.target.value}) ) );
    }
  });

  search.addEventListener("input", (e) => {
    if (e.target.value) {
      searchClear.classList.remove("search__clear--hidden")
    }else{
      searchClear.classList.add("search__clear--hidden")
    }
  });

  searchClear.addEventListener("click", (e) => {
    search.value="";
    search.dispatchEvent(new Event("input", {bubbles : false, cancelable : true}));
  });

  movies.addEventListener("click", (e) => {
    // console.log(e.target);
    let movie = e.target.closest(".movie");
    if(movie){      
      if(movie.classList.contains("movie--show-desc")){
        movie.classList.toggle("movie--show-main");
      }else{        
        movie.classList.remove("movie--show-main");
      }
      movie.classList.toggle("movie--show-desc");      
    }
  });

}


async function getMovies(url){  

  let response = await fetch(url);
  let result = await response.json(); 
  console.log(result);
  return result.results;
}

function showMovies(listMovies){
  movies.innerHTML ="";
  if(listMovies.length>0){
    movies.innerHTML += listMovies.map( val => 
    `<div class="movies__item movie">
        <div class="movie__main">
          <img src="https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${val.poster_path}" loading="lazy" width="300" height="450" alt="" class="movie__poster">
          <div class="movie__details">
            <div class="movie__title">${val.title}</div>
            <div class="movie__rate">${val.vote_average}</div>
            <div class="movie__date">${val.release_date}</div>
          </div>
        </div>
        <div class="movie__description">${val.overview}</div>
      </div>`
    ).join(''); 

  }else{
    movies.innerHTML = `<div class="movies__not-found">Ничего не найдено по запросу: ${search.value}</div>`;
  }


}

init();