
// let url = 'https://api.themoviedb.org/3/search/movie?api_key=b9faf408359afa818cfad895e40dfa27&language=en-US&include_adult=false&page=1';
let search = document.querySelector(".search__input");
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
    if (e === "Enter" || e.keyCode === 13) {
      showMovies( await getMovies( api.searchMovieUrl({query:e.target.value}) ) );
    }
  });
}



async function getMovies(url){
  
  let response = await fetch(url);
  let result = await response.json(); 
  // console.log(result);
  return result.results;
}

function showMovies(listMovies){

  if(listMovies.length>0){
    movies.innerHTML = listMovies.map( val => 
    `<div class="movies__item movie">
        <img src="https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${val.poster_path}" alt="" class="movie__poster">
        <div class="movie__details">
          <div class="movie__title">${val.title}</div>
          <div class="movie__rate">${val.vote_average}</div>
          <div class="movie__date">${val.release_date}</div>
        </div>
        <div class="movie__description">${val.overview}</div>
      </div>`
    ).join('');  
  }else{
    movies.innerHTML = `<div class="movies__not-found">Ничего не найдено по запросу: ${search.value}</div>`;
  }


}

init();