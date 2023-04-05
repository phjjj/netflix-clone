import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import {
  getNowPlayingMovies,
  getPopularMovies,
  getPopularTv,
  getTopRatedMovies,
  getTopRatedTv,
  getTvOnTheAir,
  
  IGetMoviesResult,
  IGetTvResult,
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

function Tv() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ tvId: string }>("/tv/:tvId");
  console.log(bigMovieMatch)
  const { scrollY } = useScroll();
  const { data: tvOnTheAir, isLoading } = useQuery<IGetTvResult>(
    ["tv", "onTheAir"],
    getTvOnTheAir
  );
  
  const { data: popularTv } = useQuery<IGetMoviesResult>(
    ["tv", "popularTv"],
    getPopularTv
  );

  const { data: topRatedTv } = useQuery<IGetMoviesResult>(
    ["tv", "topRatedTv"],
    getTopRatedTv
  );

  const [index, setIndex] = useState(0);
  const [popualrIndex, setPopularIndex] = useState(0);
  const [topRatedIndex, setTopRatedIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [type, setType] = useState("");

  const increaseIndex = (slider: string) => {
    if (slider === "nowPlaying") {
      if (tvOnTheAir) {
        if (leaving) return;
        toggleLeaving();
        const totalMovies = tvOnTheAir.results.length - 1;
        const maxIndex = Math.floor(totalMovies / offset) - 1;
        setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }
    } else if (slider === "popularTv") {
      if (popularTv) {
        if (leaving) return;
        toggleLeaving();
        const totalMovies = popularTv.results.length - 1;
        const maxIndex = Math.floor(totalMovies / offset) - 1;
        setPopularIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }
    } else if (slider === "topRatedTv") {
      if (topRatedTv) {
        if (leaving) return;
        toggleLeaving();
        const totalMovies = topRatedTv.results.length - 1;
        const maxIndex = Math.floor(totalMovies / offset) - 1;
        setTopRatedIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (tvId: number, type: string) => {
    history.push(`/tv/${tvId}/${type}`);
    setType(type);
  };
  const onOverlayClick = () => history.push("/tv");

  const clickedMovie =
    bigMovieMatch?.params.tvId &&
    tvOnTheAir?.results.find((tv) => tv.id === +bigMovieMatch.params.tvId);

  const clickedPopular =
    bigMovieMatch?.params.tvId &&
    popularTv?.results.find(
      (tv) => tv.id === +bigMovieMatch.params.tvId
    );

  const clickedTopRated =
    bigMovieMatch?.params.tvId &&
    topRatedTv?.results.find(
      (tv) => tv.id === +bigMovieMatch.params.tvId
    );
  console.log(clickedTopRated)

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(tvOnTheAir?.results[0].backdrop_path || "")}
          >
            <Title>{tvOnTheAir?.results[0].name}</Title>
            <Overview>{tvOnTheAir?.results[0].overview}</Overview>
          </Banner>

          <Slider className="slider">
            <Span>TvOnAir</Span>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {tvOnTheAir?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + "nowPlaying"}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(tv.id, "nowPlaying")}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
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
            <Span>Popular</Span>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={popualrIndex}
              >
                {popularTv?.results
                  .slice(1)
                  .slice(offset * popualrIndex, offset * popualrIndex + offset)
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + "popularTv"}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(tv.id, "popularTv")}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <SliderBtn onClick={() => increaseIndex("popularTv")}>
              버튼
            </SliderBtn>
          </Slider>

          {/* TopRatedMovies 슬라이드 */}
          <Slider className="slide">
            <Span>TopRated</Span>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={topRatedIndex}
              >
                {topRatedTv?.results
                  .slice(1)
                  .slice(
                    offset * topRatedIndex,
                    offset * topRatedIndex + offset
                  )
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + "topRated"}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(tv.id, "topRated")}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <SliderBtn onClick={() => increaseIndex("topRatedTv")}>
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
                  layoutId={bigMovieMatch.params.tvId + type}
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
                      <BigTitle>{clickedMovie.name}</BigTitle>
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
                      <BigTitle>{clickedPopular.name}</BigTitle>
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
                      <BigTitle>{clickedTopRated.name}</BigTitle>
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
export default Tv;
