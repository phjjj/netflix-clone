import { useLocation } from "react-router-dom";

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  return null;
}

export default Search;

// 키워드값을 받아서  api 에서 같은 movieId를 찾아서 