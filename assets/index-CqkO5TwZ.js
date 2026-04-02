(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const template = '<!doctype html>\n<html lang="ko">\n\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <link rel="stylesheet" href="/styles/reset.css" />\n  <link rel="stylesheet" href="/styles/main.css" />\n  <link rel="stylesheet" href="/styles/tab.css" />\n  <link rel="stylesheet" href="/styles/thumbnail.css" />\n  <title>영화 리뷰</title>\n</head>\n\n<body>\n  <div id="app">\n    <header id="header">\n      <div class="background-container">\n        <div class="overlay" aria-hidden="true"></div>\n        <div class="top-rated-container">\n          <div class="header-top">\n            <h1 class="logo">\n              <a href="/"><img src="/images/logo.png" alt="MovieList" /></a>\n            </h1>\n            <div class="search-bar">\n              <input type="text" class="search-input" placeholder="검색어를 입력하세요" />\n              <button class="search-button">\n                <img src="/images/search_icon.png" alt="검색" class="search-icon" />\n              </button>\n            </div>\n          </div>\n          <div class="top-rated-movie">\n          </div>\n        </div>\n      </div>\n    </header>\n    <div class="container">\n      <!-- <ul class="tab">\n        <li>\n          <a href="#">\n            <div class="tab-item selected">\n              <h3>상영 중</h3>\n            </div>\n          </a>\n        </li>\n        <li>\n          <a href="#">\n            <div class="tab-item">\n              <h3>인기순</h3>\n            </div>\n          </a>\n        </li>\n        <li>\n          <a href="#">\n            <div class="tab-item">\n              <h3>평점순</h3>\n            </div>\n          </a>\n        </li>\n        <li>\n          <a href="#">\n            <div class="tab-item">\n              <h3>상영 예정</h3>\n            </div>\n          </a>\n        </li>\n      </ul> -->\n      <main>\n        <section>\n          <h2 id="section-title">지금 인기 있는 영화</h2>\n          <ul class="thumbnail-list">\n          </ul>\n        </section>\n      </main>\n      <button id="load-movie-button">더 보기</button>\n    </div>\n\n    <footer class="footer">\n      <p><img src="/images/woowacourse_logo.png" width="180" /></p>\n      <p>&copy; 우아한테크코스 All Rights Reserved.</p>\n    </footer>\n  </div>\n</body>\n\n</html>\n\n<!--\n  포스터 원본: https://image.tmdb.org/t/p/original//pmemGuhr450DK8GiTT44mgwWCP7.jpg\n  포스터 썸네일: https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg\n  배너 원본: https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/stKGOm8UyhuLPR9sZLjs5AkmncA.jpg\n-->';
const fetchMovies = async (moviePageCount) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${moviePageCount}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZWYwODNjMTAyMjBiOTA1NGJlZGVkNGY3YWZhMjM2NSIsIm5iZiI6MTc3NDg0MzUwMS4zNjYwMDAyLCJzdWIiOiI2OWM5ZjY2ZGEwYTA5YjQ5M2E4Mzk0YTMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.FOPeyes9rY20axIrHitx-G2rDslDDKpyCDctcEBh6Cw"}`
      }
    }
  );
  if (!response.ok) {
    alert("인기 영화 불러오기에 실패하였습니다.");
  }
  const data = await response.json();
  return data;
};
const fetchSearchedMovies = async (searchKeyword, searchPageCount) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${searchKeyword}&page=${searchPageCount}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZWYwODNjMTAyMjBiOTA1NGJlZGVkNGY3YWZhMjM2NSIsIm5iZiI6MTc3NDg0MzUwMS4zNjYwMDAyLCJzdWIiOiI2OWM5ZjY2ZGEwYTA5YjQ5M2E4Mzk0YTMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.FOPeyes9rY20axIrHitx-G2rDslDDKpyCDctcEBh6Cw"}`
      }
    }
  );
  if (!response.ok) {
    alert("검색 영화 불러오기에 실패하였습니다.");
  }
  const data = await response.json();
  return data;
};
const posterBaseURL = "https://image.tmdb.org/t/p/original/";
const createMovieItem = (movie) => {
  const posterSrc = `${posterBaseURL}${movie.poster_path}`;
  const li = document.createElement("li");
  li.insertAdjacentHTML(
    "beforeend",
    /*html*/
    `
    <li>
      <div class="item skeleton">
        <div class="skeleton-poster"></div>
        <img class="thumbnail" src="${posterSrc}" alt="영화 포스터 사진" />
        <div class="item-desc">
          <div class="skeleton-rate"></div>
          <div class="skeleton-title"></div>
          <p class="rate">
            <img src="/images/star_empty.png" class="star"/><span>${movie.vote_average}</span>
          </p>
          <strong>${movie.title}</strong>
        </div>
      </div>
    </li>`
  );
  const img = li.querySelector(".thumbnail");
  const removeSkeleton = () => {
    li.querySelector(".item")?.classList.remove("skeleton");
    li.querySelector(".skeleton-poster")?.remove();
    li.querySelector(".skeleton-rate")?.remove();
    li.querySelector(".skeleton-title")?.remove();
  };
  img.addEventListener("load", removeSkeleton, { once: true });
  img.addEventListener(
    "error",
    () => {
      img.src = "/images/no_image.png";
      removeSkeleton();
    },
    { once: true }
  );
  img.src = posterSrc;
  return li;
};
const renderMovies = async (moviePageCount) => {
  const movieData = await fetchMovies(moviePageCount);
  if (moviePageCount === 1) {
    renderBanner(movieData.results[0]);
  }
  const list = document.querySelector(".thumbnail-list");
  movieData.results.forEach((movie) => {
    list?.appendChild(createMovieItem(movie));
  });
  return movieData.total_pages;
};
const renderBanner = async (fristMovieData) => {
  const movies = fristMovieData;
  const banner = document.querySelector(".top-rated-movie");
  const backgroundContainer = document.querySelector(".background-container");
  const bannerBaseURL = "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces";
  const mostPopularMovie = movies;
  if (backgroundContainer) {
    backgroundContainer.style.backgroundImage = `url("${bannerBaseURL + mostPopularMovie.backdrop_path}")`;
  }
  const mostPopularMovieBanner = (
    /*html*/
    `
    <div class="rate">
      <img src="/images/star_empty.png" class="star" />
      <span class="rate-value">${mostPopularMovie.vote_average}</span>
    </div>
    <div class="title">${mostPopularMovie.title}</div>
    <button class="primary detail">자세히 보기</button>
    `
  );
  banner?.insertAdjacentHTML("beforeend", mostPopularMovieBanner);
};
const replaceBanner = (header, searchKeyword) => {
  const searchBar = (
    /*html*/
    `
  <div class="background-container search-header">
    <div class="overlay" aria-hidden="true"></div>
    <div class="top-rated-container">
      <div class="header-top">
        <h1 class="logo">
          <a href="/"><img src="/images/logo.png" alt="MovieList" /></a>
        </h1>
        <div class="search-bar">
          <input type="text" class="search-input" placeholder="검색어를 입력하세요" />
          <button class="search-button">
            <img src="/images/search_icon.png" alt="검색" class="search-icon" />
          </button>
        </div>
      </div>
    </div>
  </div>
  `
  );
  header.insertAdjacentHTML("beforeend", searchBar);
  const input = header.querySelector(".search-input");
  if (input) input.value = searchKeyword;
};
const renderSearchedMovies = async (searchKeyword, searchPageCount) => {
  const movieData = await fetchSearchedMovies(searchKeyword, searchPageCount);
  const movies = movieData.results;
  const list = document.querySelector(".thumbnail-list");
  if (list && movies.length === 0 && searchPageCount === 1) {
    list.insertAdjacentHTML(
      "beforeend",
      /*html*/
      `
      <div id="no-result">
        <img src="/images/planet_icon.png" alt="검색 결과 없음" class="no-result-icon" />
        <p class="no-result-text">검색 결과가 없습니다.</p>
      </div>`
    );
  }
  movies.forEach((movie) => {
    list?.appendChild(createMovieItem(movie));
  });
  return movieData.total_pages;
};
class AppState {
  moviePageCount = 1;
  searchPageCount = 1;
  isSearched = false;
  totalSearchPages = 0;
  currentKeyword = "";
}
class App {
  #state = new AppState();
  constructor() {
    document.querySelector("#app").innerHTML = template;
    renderMovies(this.#state.moviePageCount);
    this.addEventListeners();
  }
  addEventListeners() {
    document.addEventListener("click", (e) => {
      if (e.target.closest(".search-button")) {
        this.#handleSearchSubmit();
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.closest(".search-input")) {
        this.#handleSearchSubmit();
      }
    });
    document.querySelector("#load-movie-button").addEventListener("click", () => {
      this.#handleSearch();
    });
  }
  // 검색 엔터 / 검색 버튼 시 렌더링 함수
  #handleSearchSubmit = async () => {
    this.#state.isSearched = true;
    this.#state.searchPageCount = 1;
    this.#state.currentKeyword = document.querySelector(".search-input").value;
    const list = document.querySelector(".thumbnail-list");
    if (list) list.replaceChildren();
    const header = document.querySelector("#header");
    if (header) {
      header.replaceChildren();
      replaceBanner(header, this.#state.currentKeyword);
    }
    this.#state.totalSearchPages = await renderSearchedMovies(
      this.#state.currentKeyword,
      this.#state.searchPageCount
    );
    if (this.#state.totalSearchPages === this.#state.searchPageCount) {
      this.#hideLoadButton();
    }
    const sectionTitle = document.querySelector("#section-title");
    if (sectionTitle) {
      sectionTitle.textContent = `"${this.#state.currentKeyword}" 검색 결과`;
    }
  };
  // 초기화면, 검색화면 분기에 따른 더보기 함수
  #handleSearch = async () => {
    if (!this.#state.isSearched) {
      this.#state.moviePageCount += 1;
      const totalPopularPages = await renderMovies(this.#state.moviePageCount);
      if (totalPopularPages === this.#state.moviePageCount) {
        this.#hideLoadButton();
      }
    }
    if (this.#state.isSearched) {
      this.#state.searchPageCount += 1;
      this.#state.currentKeyword = document.querySelector(".search-input").value;
      const totalSearchPages = await renderSearchedMovies(
        this.#state.currentKeyword,
        this.#state.searchPageCount
      );
      if (totalSearchPages === this.#state.searchPageCount) {
        this.#hideLoadButton();
      }
    }
  };
  // 더보기 버튼 숨기는 헬퍼 함수
  #hideLoadButton() {
    const loadMovieButton = document.querySelector("#load-movie-button");
    if (loadMovieButton) loadMovieButton.style.display = "none";
  }
}
new App();
