const API_KEY = "ce23795ae8612a958dab7c042f1eba54";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
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

export interface IGenres {
  genres: [
    {
      id: number;
      name: string;
    }
  ];
}

export function getMovies() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KO&region=KR`
  ).then((response) => response.json());
}

export function getMoviesGenres() {
  return fetch(
    `${BASE_PATH}/genre/movie/list?api_key=${API_KEY}&language=ko-KO`
  ).then((response) => response.json());
}
