import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import {
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  IGetMoviesResult,
} from "../api";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
  overflow-x: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px; ;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -200px;
  margin-bottom: 200px;
`;

const Span = styled.span`
  display: block;

  z-index: 99;
  bottom: 30px;
  font-size: 45px;
`;

const SliderBtn = styled.button`
  display: block;
  position: absolute;
  right: 0;
  margin-top: 75px;
  z-index: 99;
  font-size: 30px;
  opacity: 0.7;
  border-radius: 30px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

// 영화 슬라이드 애니메이션(variants)

const rowVariants = {
  hidden: { x: window.innerWidth + 5 },
  visible: { x: 0 },
  exit: { x: -window.innerWidth - 5 },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const offset = 6;

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");

  const { scrollY } = useScroll();
  const { data: nowPlayingMovies, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getNowPlayingMovies
  );
  console.log(nowPlayingMovies);
  const { data: popularMovies } = useQuery<IGetMoviesResult>(
    ["movies", "popularMovies"],
    getPopularMovies
  );
  const { data: topRatedMovies } = useQuery<IGetMoviesResult>(
    ["movies", "topRatedMovies"],
    getTopRatedMovies
  );

  const [index, setIndex] = useState(0);
  const [popualrIndex, setPopularIndex] = useState(0);
  const [topRatedIndex, setTopRatedIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [type, setType] = useState("");

  const increaseIndex = (slider: string) => {
    if (slider === "nowPlaying") {
      if (nowPlayingMovies) {
        if (leaving) return;
        toggleLeaving();
        const totalMovies = nowPlayingMovies.results.length - 1;
        const maxIndex = Math.floor(totalMovies / offset) - 1;
        setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }
    } else if (slider === "popularMovies") {
      if (popularMovies) {
        if (leaving) return;
        toggleLeaving();
        const totalMovies = popularMovies.results.length - 1;
        const maxIndex = Math.floor(totalMovies / offset) - 1;
        setPopularIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }
    } else if (slider === "topRatedMovies") {
      if (topRatedMovies) {
        if (leaving) return;
        toggleLeaving();
        const totalMovies = topRatedMovies.results.length - 1;
        const maxIndex = Math.floor(totalMovies / offset) - 1;
        setTopRatedIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number, type: string) => {
    history.push(`/movies/${movieId}/${type}`);
    setType(type);
  };
  const onOverlayClick = () => history.push("/");


  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    nowPlayingMovies?.results.find(
      (movie) => movie.id === +bigMovieMatch.params.movieId
    );

  const clickedPopular =
    bigMovieMatch?.params.movieId &&
    popularMovies?.results.find(
      (movie) => movie.id === +bigMovieMatch.params.movieId
    );

  const clickedTopRated =
    bigMovieMatch?.params.movieId &&
    topRatedMovies?.results.find(
      (movie) => movie.id === +bigMovieMatch.params.movieId
    );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              nowPlayingMovies?.results[0].backdrop_path || ""
            )}
          >
            <Title>{nowPlayingMovies?.results[0].title}</Title>
            <Overview>{nowPlayingMovies?.results[0].overview}</Overview>
          </Banner>

          <Slider className="slider">
            <Span>NowMovies</Span>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {nowPlayingMovies?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + "nowPlaying"}
                      key={movie.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(movie.id, "nowPlaying")}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
              <SliderBtn onClick={() => increaseIndex("nowPlaying")}>
                버튼
              </SliderBtn>
            </AnimatePresence>
          </Slider>

          {/* PopularMovies 슬라이드 */}
          <Slider className="slide">
            <Span>PopularMovies</Span>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={popualrIndex}
              >
                {popularMovies?.results
                  .slice(1)
                  .slice(offset * popualrIndex, offset * popualrIndex + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + "popularMovies"}
                      key={movie.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(movie.id, "popularMovies")}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <SliderBtn onClick={() => increaseIndex("popularMovies")}>
              버튼
            </SliderBtn>
          </Slider>

          {/* TopRatedMovies 슬라이드 */}
          <Slider className="slide">
            <Span>TopRatedMovies</Span>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={topRatedIndex}
              >
                {topRatedMovies?.results
                  .slice(1)
                  .slice(
                    offset * topRatedIndex,
                    offset * topRatedIndex + offset
                  )
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + "topRated"}
                      key={movie.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(movie.id, "topRated")}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <SliderBtn onClick={() => increaseIndex("topRatedMovies")}>
              버튼
            </SliderBtn>
          </Slider>
          {/* 오버레이 */}
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigMovieMatch.params.movieId + type}
                >
                  {clickedMovie ? (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  ) : clickedPopular ? (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedPopular.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedPopular.title}</BigTitle>
                      <BigOverview>{clickedPopular.overview}</BigOverview>
                    </>
                  ) : clickedTopRated ? (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedTopRated.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedTopRated.title}</BigTitle>
                      <BigOverview>{clickedTopRated.overview}</BigOverview>
                    </>
                  ) : null}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
