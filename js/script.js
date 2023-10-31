const global = {
  currentPage: window.location.pathname,
  api: {
    apiUrl: "https://api.themoviedb.org/3/",
    apiKey: "3fd2be6f0c70a2a598f084ddfb75487c",
  },
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
};

async function fetchAPIData(endpoint) {
  showSpinner();
  const response = await fetch(
    `${global.api.apiUrl}${endpoint}?api_key=${global.api.apiKey}`
  );
  const data = response.json();
  hideSpinner();
  return data;
}

async function displayPopulerMovies() {
  const { results } = await fetchAPIData("movie/popular");
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `<a href="movie-details.html?id=${movie.id}">
    ${
      movie.poster_path
        ? `<img
    src=https://image.tmdb.org/t/p/w500${movie.poster_path}
    class="card-img-top"
    alt=${movie.title}
  />`
        : `<img
  src="images/no-image.jpg"
  class="card-img-top"
  alt=${movie.title}
/>`
    }
  </a>
  <div class="card-body">
    <h5 class="card-title">${movie.title}</h5>
    <p class="card-text">
      <small class="text-muted">Release Date : ${movie.release_date}</small>
    </p>
  </div>
    `;
    document.querySelector("#popular-movies").appendChild(div);
  });
}

async function displayPopularShows() {
  const { results } = await fetchAPIData("tv/popular");

  results.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `<a href="tv-details.html?id=${show.id}">
    ${
      show.poster_path
        ? `<img
    src=https://image.tmdb.org/t/p/w500${show.poster_path}
    class="card-img-top"
    alt=${show.title}
  />`
        : `<img
  src="images/no-images.jpg"
  class="card-img-top"
  alt=${show.title}
/>`
    }
  </a>
  <div class="card-body">
    <h5 class="card-title">${show.name}</h5>
    <p class="card-text">
      <small class="text-muted">Aired: ${show.first_air_date}</small>
    </p>
  </div>
    `;
    document.querySelector("#popular-shows").appendChild(div);
  });
}

async function displayMovieDetails() {
  const movieId = window.location.search.split("=")[1];
  const response = await fetchAPIData(`movie/${movieId}`);
  const div = document.createElement("div");
  div.innerHTML = `<div class="details-top">
   <div>
     <img
       src=https://image.tmdb.org/t/p/w500${response.poster_path}
       class="card-img-top"
       alt=${response.title}
     />
   </div>
   <div>
     <h2>${response.title}</h2>
     <p>
       <i class="fas fa-star text-primary"></i>
       ${response.vote_average.toFixed(1)} / 10
     </p>
     <p class="text-muted">Release Date: ${response.release_date}</p>
     <p>
       ${response.overview}
     </p>
     <h5>Genres</h5>
     <ul class="list-group">
       ${response.genres.map((item) => `<span>${item.name}</span>`).join(", ")}
     </ul>
     <a href="${
       response.homepage
     }" target="_blank" class="btn">Visit Movie Homepage</a>
   </div>
 </div>
 <div class="details-bottom">
   <h2>Movie Info</h2>
   <ul>
     <li><span class="text-secondary">Budget:</span> ${addCommasToNumber(
       response.budget
     )}$</li>
     <li><span class="text-secondary">Revenue:</span> ${addCommasToNumber(
       response.revenue
     )}$</li>
     <li><span class="text-secondary">Runtime:</span> ${response.runtime}</li>
     <li><span class="text-secondary">Status:</span> ${response.status}</li>
   </ul>
   <h4>Production Companies</h4>
   <div class="list-group">${response.production_companies
     .map((item) => `<span>${item.name}</span>`)
     .join(", ")}</div>
 </div>
   `;
  document.querySelector("#movie-details").appendChild(div);
  displayBackgroundImage(response.backdrop_path);
}

async function swiper() {
  const { results } = await fetchAPIData("movie/now_playing");
  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.innerHTML = `
  <a href="movie-details.html?id=${result.id}">
    <img src=https://image.tmdb.org/t/p/w500${
      result.poster_path
    } alt="Movie Title" />
  </a>
  <h4 class="swiper-rating">
    <i class="fas fa-star text-secondary"></i> ${result.vote_average.toFixed(
      1
    )} / 10
  </h4>

  `;
    document.querySelector(".swiper-wrapper").appendChild(div);
  });
  initSwiper();
}

function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

async function displayShowDetails() {
  const tvId = window.location.search.split("=")[1];
  const response = await fetchAPIData(`tv/${tvId}`);
  const div = document.createElement("div");
  div.innerHTML = `<div class="details-top">
  <div>
    <img
      src=https://image.tmdb.org/t/p/w500${response.poster_path}
      class="card-img-top"
      alt=${response.name}
    />
  </div>
  <div>
    <h2>${response.name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${response.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${response.first_air_date} </p>
    <p>
      ${response.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${response.genres.map((item) => `<li>${item.name}</li>`).join(" ")}
    </ul>
    <a href="${response.homepage}" target="_blank" class="btn">Show Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Show Info</h2>
  <ul>
    <li><span class="text-secondary">Number Of Episodes:</span> ${
      response.number_of_episodes
    }</li>
    <li>
      <span class="text-secondary">Last Episode To Air: </span>${
        response.last_episode_to_air.air_date
      }
    </li>
    <li><span class="text-secondary">Status:</span> ${response.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">${response.production_companies
    .map((item) => `<span>${item.name}</span>`)
    .join(",")}</div>
</div>
  `;
  document.querySelector("#show-details").appendChild(div);
  displayBackgroundImage(response.backdrop_path);
}

function displayBackgroundImage(backgroundPath) {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.6";

  if (global.currentPage == "/movie-details.html") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
}

async function searchAPIData() {
  showSpinner();

  const response = await fetch(
    `${global.api.apiUrl}search/${global.search.type}?query=${global.search.term}&page=${global.search.page}&api_key=${global.api.apiKey}`
  );
  const data = response.json();

  hideSpinner();

  return data;
}

async function search() {
  global.search.term = window.location.search.split("=")[2];
  global.search.type = window.location.search.split("=")[1].split("&")[0];

  if (global.search.term !== "" && global.search.term !== null) {
    const { results, total_pages, total_results, page } = await searchAPIData();
    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (total_results === 0) {
      showAlert("No Result Found");
      return;
    }
    displaySearchResults(results);
  } else {
    showAlert("Please Enter a search name", "alert-success");
  }
}

function displaySearchResults(results) {
  document.querySelector("#search-results").innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";
  results.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `${
      global.search.type == "movie"
        ? `<a href="movie-details.html?id=${item.id}">`
        : `
    <a href="tv-details.html?id=${item.id}">`
    }
    ${
      item.poster_path
        ? `<img src="https://image.tmdb.org/t/p/w500/${item.poster_path}"`
        : `<img src="/images/no-image.jpg"`
    }
     class="card-img-top" alt="" />
  </a>
  <div class="card-body">
    ${
      global.search.type === "movie"
        ? `
    <h5 class="card-title">${item.title}</h5>
    `
        : `<h5 class="card-title">${item.name}</h5>
    `
    }
    <p class="card-text">
    ${
      global.search.type === "movie"
        ? `<small class="text-muted">Release: ${item.release_date}</small>`
        : `<small class="text-muted">Release: ${item.first_air_date}</small>`
    }
    </p>
  </div>`;
    document.querySelector("#search-results-heading").innerHTML = `
    <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>`;
    document.querySelector("#search-results").appendChild(div);
  });
  displayPagination();
}

function displayPagination() {
  const div1 = document.createElement("div");
  div1.className = "pagination";
  div1.innerHTML = `
   <button class="btn btn-primary" id="prev">Prev</button>
   <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
   `;
  document.querySelector("#pagination").appendChild(div1);
  if (global.search.page === 1) {
    document.querySelector("#prev").disabled = true;
  } else if (global.search.page === global.search.totalPages) {
    document.querySelector("#next").disabled = true;
  }
  document.querySelector("#prev").addEventListener("click", async function () {
    global.search.page -= 1;
    const { results, page } = await searchAPIData();
    displaySearchResults(results);
  });

  document.querySelector("#next").addEventListener("click", async function () {
    global.search.page += 1;
    const { results, page } = await searchAPIData();
    displaySearchResults(results);
  });
}

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function showAlert(message, className = "alert-error") {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  alertEl.innerHTML = message;
  document.querySelector("#alert").append(alertEl);
  setTimeout(() => alertEl.remove(), 1500);
}

function highlightActivelink() {
  document.querySelectorAll(".nav-link").forEach((link) => {
    if (link.getAttribute("href") === window.location.pathname) {
      link.classList.add("active");
    }
  });
}

function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}
function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displayPopulerMovies();
      swiper();
      break;
    case "/shows.html":
      displayPopularShows();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/tv-details.html":
      displayShowDetails();
      break;
    case "/search.html":
      search();

      break;
  }
  highlightActivelink();
}

init();
