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
const template = '<!doctype html>\n<html lang="ko">\n\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>영화 리뷰</title>\n</head>\n\n<body>\n  <div id="app">\n    <header id="header">\n      <div class="background-container">\n        <div class="overlay" aria-hidden="true"></div>\n        <div class="top-rated-container">\n          <div class="header-top">\n            <h1 class="logo">\n              <a href="/"><img src="/images/logo.png" alt="MovieList" /></a>\n            </h1>\n            <div class="search-bar">\n              <input type="text" class="search-input" placeholder="검색어를 입력하세요" />\n              <button class="search-button">\n                <img src="/images/search_icon.png" alt="검색" class="search-icon" />\n              </button>\n            </div>\n          </div>\n          <div class="top-rated-movie">\n          </div>\n        </div>\n      </div>\n    </header>\n    <div class="container">\n      <main>\n        <section>\n          <h2 id="section-title">지금 인기 있는 영화</h2>\n          <ul class="thumbnail-list">\n          </ul>\n          <div id="scroll-sentinel"></div>\n        </section>\n      </main>\n    </div>\n\n    <footer class="footer">\n      <p><img src="/images/woowacourse_logo.png" width="180" /></p>\n      <p>&copy; 우아한테크코스 All Rights Reserved.</p>\n    </footer>\n  </div>\n\n  <div class="modal-background" id="modalBackground">\n    <div class="modal">\n      <button class="close-modal" id="closeModal">\n        <img src="./images/modal_button_close.png" />\n      </button>\n      <div class="modal-container"></div>\n    </div>\n  </div>\n</body>\n\n</html>\n\n<!--\n  포스터 원본: https://image.tmdb.org/t/p/original//pmemGuhr450DK8GiTT44mgwWCP7.jpg\n  포스터 썸네일: https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg\n  배너 원본: https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/stKGOm8UyhuLPR9sZLjs5AkmncA.jpg\n-->';
const fetchMovies = async (moviePageCount) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${moviePageCount}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZWYwODNjMTAyMjBiOTA1NGJlZGVkNGY3YWZhMjM2NSIsIm5iZiI6MTc3NDg0MzUwMS4zNjYwMDAyLCJzdWIiOiI2OWM5ZjY2ZGEwYTA5YjQ5M2E4Mzk0YTMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.FOPeyes9rY20axIrHitx-G2rDslDDKpyCDctcEBh6Cw"}`
      }
    }
  );
  if (!response.ok) {
    throw new Error("FAILED TO FETCH POPULAR MOVIES");
  }
  const data = await response.json();
  return data;
};
const fetchSearchedMovies = async (searchKeyword, searchPageCount) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?language=ko-KR&query=${searchKeyword}&page=${searchPageCount}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZWYwODNjMTAyMjBiOTA1NGJlZGVkNGY3YWZhMjM2NSIsIm5iZiI6MTc3NDg0MzUwMS4zNjYwMDAyLCJzdWIiOiI2OWM5ZjY2ZGEwYTA5YjQ5M2E4Mzk0YTMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.FOPeyes9rY20axIrHitx-G2rDslDDKpyCDctcEBh6Cw"}`
      }
    }
  );
  if (!response.ok) {
    throw new Error("FAILED TO FETCH SEARCHED MOVIES");
  }
  const data = await response.json();
  return data;
};
const fetchMovieDetail = async (movieId) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZWYwODNjMTAyMjBiOTA1NGJlZGVkNGY3YWZhMjM2NSIsIm5iZiI6MTc3NDg0MzUwMS4zNjYwMDAyLCJzdWIiOiI2OWM5ZjY2ZGEwYTA5YjQ5M2E4Mzk0YTMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.FOPeyes9rY20axIrHitx-G2rDslDDKpyCDctcEBh6Cw"}`
      }
    }
  );
  if (!response.ok) {
    throw new Error("FAILED TO FETCH MOVIE DETAIL");
  }
  const data = await response.json();
  return data;
};
const posterBaseURL$1 = "https://image.tmdb.org/t/p/original/";
const base$1 = "/javascript-movie-review/";
const createMovieItem = (movie) => {
  const posterSrc = `${posterBaseURL$1}${movie.poster_path}`;
  const li = document.createElement("li");
  li.insertAdjacentHTML(
    "beforeend",
    /*html*/
    `
    <div id="movie-item" data-id = "${movie.id}">
      <div class="item skeleton">
        <div class="skeleton-poster"></div>
        <img class="thumbnail" src="${posterSrc}" alt="영화 포스터 사진" />
        <div class="item-desc">
          <div class="skeleton-rate"></div>
          <div class="skeleton-title"></div>
          <p class="rate">
            <img src="${base$1}images/star_empty.png" class="star"/><span>${movie.vote_average}</span>
          </p>
          <strong>${movie.title}</strong>
        </div>
      </div>
    </div>`
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
      img.src = `${base$1}images/no_image.png`;
      removeSkeleton();
    },
    { once: true }
  );
  img.src = posterSrc;
  return li;
};
const renderMovies = async (moviePageCount) => {
  try {
    const movieData = await fetchMovies(moviePageCount);
    if (moviePageCount === 1) {
      renderBanner(movieData.results[0]);
    }
    const list = document.querySelector(".thumbnail-list");
    movieData.results.forEach((movie) => {
      list?.appendChild(createMovieItem(movie));
    });
    return movieData.total_pages;
  } catch {
    alert("인기 영화를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.");
    return 0;
  }
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
      <img src="${base$1}images/star_empty.png" class="star" />
      <span class="rate-value">${mostPopularMovie.vote_average}</span>
    </div>
    <div class="title">${mostPopularMovie.title}</div>
    <button class="primary detail" data-id = "${fristMovieData.id}">자세히 보기</button>
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
          <a href="/"><img src="${base$1}images/logo.png" alt="MovieList" /></a>
        </h1>
        <div class="search-bar">
          <input type="text" class="search-input" placeholder="검색어를 입력하세요" />
          <button class="search-button">
            <img src="${base$1}images/search_icon.png" alt="검색" class="search-icon" />
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
  try {
    const movieData = await fetchSearchedMovies(
      searchKeyword,
      searchPageCount
    );
    const movies = movieData.results;
    const list = document.querySelector(".thumbnail-list");
    if (list && movies.length === 0 && searchPageCount === 1) {
      list.insertAdjacentHTML(
        "beforeend",
        /*html*/
        `
      <div id="no-result">
        <img src="${base$1}images/planet_icon.png" alt="검색 결과 없음" class="no-result-icon" />
        <p class="no-result-text">검색 결과가 없습니다.</p>
      </div>`
      );
    }
    movies.forEach((movie) => {
      list?.appendChild(createMovieItem(movie));
    });
    return movieData.total_pages;
  } catch {
    alert("영화 검색에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    return 0;
  }
};
class AppState {
  moviePageCount = 1;
  searchPageCount = 1;
  isSearched = false;
  currentKeyword = "";
}
class SearchHandler {
  constructor(state) {
    this.state = state;
  }
  handleSearchButtonClick = (e) => {
    if (e.target.closest(".search-button")) {
      this.handleSearchSubmit();
    }
  };
  handleSearchKeydown = (e) => {
    if (e.key === "Enter" && e.target.closest(".search-input")) {
      this.handleSearchSubmit();
    }
  };
  handleLoadMoreScroll = async () => {
    if (!this.state.isSearched) {
      this.state.moviePageCount += 1;
      const totalPopularPages = await renderMovies(this.state.moviePageCount);
      if (totalPopularPages === this.state.moviePageCount) {
        return true;
      }
    } else {
      this.state.searchPageCount += 1;
      const totalSearchPages = await renderSearchedMovies(
        this.state.currentKeyword,
        this.state.searchPageCount
      );
      if (totalSearchPages === this.state.searchPageCount) {
        return true;
      }
    }
    return false;
  };
  handleSearchSubmit = async () => {
    this.state.isSearched = true;
    this.state.searchPageCount = 1;
    this.state.currentKeyword = document.querySelector(".search-input").value;
    const list = document.querySelector(".thumbnail-list");
    if (list) list.replaceChildren();
    const header = document.querySelector("#header");
    if (header) {
      header.replaceChildren();
      replaceBanner(header, this.state.currentKeyword);
    }
    await renderSearchedMovies(
      this.state.currentKeyword,
      this.state.searchPageCount
    );
    const sectionTitle = document.querySelector("#section-title");
    if (sectionTitle) {
      sectionTitle.textContent = `"${this.state.currentKeyword}" 검색 결과`;
    }
  };
}
class StarRating {
  container;
  movieId;
  currentScore = 0;
  hoverScore = 0;
  storage;
  constructor(container, movieId, storage) {
    this.container = container;
    this.movieId = movieId;
    this.storage = storage;
    this.currentScore = this.storage.getRating(this.movieId);
    this.bindRatingEvents();
    this.updateRatingUI();
  }
  bindRatingEvents() {
    const stars = Array.from(this.container.querySelectorAll(".star.my-star"));
    this.container.addEventListener("mouseover", (e) => {
      if (e.target.closest(".star.my-star")) {
        const targetStar = e.target.closest(".star.my-star");
        const targetStarIndex = stars.indexOf(targetStar);
        this.hoverScore = (targetStarIndex + 1) * 2;
        this.updateRatingUI();
      }
    });
    this.container.addEventListener("mouseout", (e) => {
      if (e.target.closest(".star.my-star")) {
        this.hoverScore = 0;
        this.updateRatingUI();
      }
    });
    this.container.addEventListener("click", (e) => {
      if (e.target.closest(".star.my-star")) {
        const targetStar = e.target.closest(".star.my-star");
        const targetStarIndex = stars.indexOf(targetStar);
        this.currentScore = (targetStarIndex + 1) * 2;
        this.updateRatingUI();
        this.storage.setRating(this.movieId, this.currentScore);
      }
    });
  }
  updateRatingUI() {
    const stars = Array.from(this.container.querySelectorAll(".star.my-star"));
    const starFilled = "./images/star_filled.png";
    const starEmpty = "./images/star_empty.png";
    let displayScore = this.currentScore;
    if (this.hoverScore > 0) {
      displayScore = this.hoverScore;
    }
    const starIndex = displayScore / 2 - 1;
    const scoreContainer = this.container.querySelector(
      ".my-score"
    );
    const scoreLabel = this.container.querySelector(
      ".my-score-label"
    );
    const rateValue = this.container.querySelector(
      ".my-rate-value"
    );
    const scoreLabelObject = {
      2: "최악이예요",
      4: "별로예요",
      6: "보통이에요",
      8: "재미있어요",
      10: "명작이에요"
    };
    if (displayScore === 0) {
      if (scoreContainer) scoreContainer.style.display = "none";
    } else {
      if (scoreContainer) scoreContainer.style.display = "flex";
      if (scoreLabel)
        scoreLabel.textContent = `${scoreLabelObject[displayScore]}`;
      if (rateValue) rateValue.textContent = `(${displayScore}/10)`;
    }
    stars.forEach((star, index) => {
      const starElement = star;
      if (index <= starIndex) {
        starElement.src = starFilled;
      } else {
        starElement.src = starEmpty;
      }
    });
  }
  getScore() {
    return this.currentScore;
  }
}
class LocalRatingStorage {
  KEY = "movieRatings";
  getRating(movieId) {
    const ratings = JSON.parse(localStorage.getItem(this.KEY) || "{}");
    return ratings[movieId] || 0;
  }
  setRating(movieId, score) {
    const ratings = JSON.parse(localStorage.getItem(this.KEY) || "{}");
    ratings[movieId] = score;
    localStorage.setItem(this.KEY, JSON.stringify(ratings));
  }
}
const posterBaseURL = "https://image.tmdb.org/t/p/original/";
const base = "/javascript-movie-review/";
const createMovieDetailItem = (movieDetailData) => {
  const posterSrc = `${posterBaseURL}${movieDetailData.poster_path}`;
  const releaseDate = movieDetailData.release_date.split("-")[0];
  const parseGenre = (movieDetailData2) => {
    return movieDetailData2.genres.map((genre) => genre.name).join(", ");
  };
  const modalDiv = document.createElement("div");
  modalDiv.classList.add("modal-container");
  modalDiv.insertAdjacentHTML(
    "beforeend",
    /*html*/
    `
            <div class="modal-image">
              <img src="" alt="영화 포스터 사진" />
            </div>
            <div class="modal-description">
              <h2>${movieDetailData.title}</h2>
              <p class="category">
                ${releaseDate} · ${parseGenre(movieDetailData)}
              </p>
              <div class="rate">
                <span class="rate-label">평균</span>
                <img src="./images/star_filled.png" class="star" />
                <span class="rate-avg-value">${movieDetailData.vote_average}</span>
              </div>
              <hr />
              <h3 class="my-rate-title">내 별점</h3>
              <div class="my-rate">
                <div class="my-rate-stars">
                  <img src="./images/star_empty.png" class="star my-star" />
                  <img src="./images/star_empty.png" class="star my-star" />
                  <img src="./images/star_empty.png" class="star my-star" />
                  <img src="./images/star_empty.png" class="star my-star" />
                  <img src="./images/star_empty.png" class="star my-star" />
                </div>
                <div class="my-score">
                  <span class="my-score-label"></span>
                  <span class="my-rate-value"></span>
                </div>
              </div>
              <hr />
              <h3 class="detail-title">줄거리</h3>
              <p class="detail">
              ${movieDetailData.overview}
            </p>
        </div>
    `
  );
  const img = modalDiv.querySelector(".modal-image img");
  img.addEventListener(
    "error",
    () => {
      img.src = `${base}images/no_image.png`;
    },
    { once: true }
  );
  img.src = posterSrc;
  return modalDiv;
};
const renderMovieDetail = async (movieId) => {
  try {
    const movieDetailData = await fetchMovieDetail(movieId);
    const modal = document.querySelector(".modal");
    modal?.appendChild(createMovieDetailItem(movieDetailData));
    const rateContainer = modal?.querySelector(".my-rate");
    if (rateContainer) {
      new StarRating(rateContainer, movieId, new LocalRatingStorage());
    }
  } catch (error) {
    alert(
      "영화 세부정보를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요."
    );
    return 0;
  }
};
class ModalHandler {
  modalArea = document.querySelector("#modalBackground");
  // 모달 닫는 핸들러
  handleModalCloseButtonClick = (e) => {
    if (e.target.closest("#closeModal")) {
      document.querySelector(".modal-container")?.remove();
      this.modalArea?.classList.remove("active");
    }
  };
  handleModalCloseButtonKeyDown = (e) => {
    if (e.key === "Escape") {
      document.querySelector(".modal-container")?.remove();
      this.modalArea?.classList.remove("active");
    }
  };
  handleModalCloseBackdrop = (e) => {
    if (e.target === this.modalArea) {
      document.querySelector(".modal-container")?.remove();
      this.modalArea?.classList.remove("active");
    }
  };
  handleMovieClick = async (e) => {
    if (e.target.closest(".item")) {
      const movieId = Number(
        e.target.closest("[data-id]")?.getAttribute("data-id")
      );
      document.querySelector(".modal-container")?.remove();
      await renderMovieDetail(movieId);
      this.showModal();
    }
    if (e.target.closest(".primary.detail")) {
      const movieId = Number(
        e.target.closest("[data-id]")?.getAttribute("data-id")
      );
      document.querySelector(".modal-container")?.remove();
      await renderMovieDetail(movieId);
      this.showModal();
    }
  };
  showModal() {
    this.modalArea?.classList.add("active");
  }
}
const createScrollObserver = (targetElement, onIntersect) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        onIntersect();
      }
    });
  });
  observer.observe(targetElement);
  return () => observer.disconnect();
};
class App {
  state = new AppState();
  constructor() {
    const base2 = "/javascript-movie-review/";
    document.querySelector("#app").innerHTML = template.replace(
      /\/images\//g,
      `${base2}images/`
    );
    renderMovies(this.state.moviePageCount);
    this.addEventListeners();
  }
  addEventListeners() {
    const search = new SearchHandler(this.state);
    const modal = new ModalHandler();
    document.addEventListener("click", search.handleSearchButtonClick);
    document.addEventListener("keydown", search.handleSearchKeydown);
    document.addEventListener("click", modal.handleMovieClick);
    document.addEventListener("click", modal.handleModalCloseButtonClick);
    document.addEventListener("click", modal.handleModalCloseBackdrop);
    document.addEventListener("keydown", modal.handleModalCloseButtonKeyDown);
    const sentinel = document.querySelector("#scroll-sentinel");
    if (sentinel) {
      let cleanup;
      cleanup = createScrollObserver(sentinel, async () => {
        const isLastPage = await search.handleLoadMoreScroll();
        if (isLastPage) cleanup();
      });
    }
  }
}
new App();
