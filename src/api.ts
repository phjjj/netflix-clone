const API_KEY = "ce23795ae8612a958dab7c042f1eba54";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  name: string;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  release_date: string;
}

interface ITv {
  id: number;
  name: string;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  release_date: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    mininum: string;
  };

  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetTvResult {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}



export function getNowPlayingMovies() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KO`
  ).then((response) => response.json());
}

export function getPopularMovies() {
  return fetch(
    `${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=ko-KO`
  ).then((response) => response.json());
}
export function getTopRatedMovies() {
  return fetch(
    `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=ko-KO`
  ).then((response) => response.json());
}

export function getTvOnTheAir() {
  return fetch(
    `${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}&language=en-US`
  ).then((response) => response.json());
}

export function getPopularTv() {
  return fetch(
    `${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=en-US`
  ).then((response) => response.json());
}

export function getTopRatedTv() {
  return fetch(
    `${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=en-US`
  ).then((response) => response.json());
}

