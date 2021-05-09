import React, { useEffect, useState } from "react";
import styled from "styled-components";

const apiKey = "e8ecfb7c";

const Main = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: futura-pt, sans-serif;
  font-weight: 500;
  font-style: normal;
  color: white;
  /* background: linear-gradient(
    180deg,
    rgba(133, 15, 1, 1) 0%,
    rgba(133, 15, 1, 1) 70%,
    rgba(20, 21, 24, 1) 100%
  );
  background-repeat: no-repeat; */
  /* height: 100%; */
`;

const Container = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  text-align: center;
  margin-top: 5vh;
  font-size: 45px;
  font-family: agenda, sans-serif;
  font-weight: 500;
  font-style: normal;
`;

const SearchContainer = styled.div`
  border: 1px solid black;
`;

const SearchInput = styled.input`
  width: 300px;
  height: 40px;
  padding: 1px;
  border: 4px solid gold;
  border-radius: 6px;
  text-align: center;
  margin-bottom: 5px;

  ::placeholder {
    font-size: 16px;
  }
`;

const ResultsContainer = styled.div`
  border: 4px solid gold;
  border-radius: 6px;
  background-color: orange;
  padding: 7px;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 850px;

  /* height: 450px; */
`;

const Results = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const NominationsContainer = styled.div`
  border: 4px solid gold;
  border-radius: 6px;
  background-color: orange;
  padding: 7px;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 850px;
`;

const NominationsFlex = styled.div`
  display: flex;
  /* flex-direction: column; */
  align-items: center;
`;

const MovieDiv = styled.div`
  background-color: #282828;
  padding: 15px;
  padding-top: 13px;
  margin: 10px;
  width: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  opacity: 0;
  transition: outline 0.15s;
  animation: fadeIn 0.75s;
  animation-fill-mode: forwards;
  height: 330px;

  :hover {
    outline: 5px solid white;
    button {
      background-color: white;
    }
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const NominationDiv = styled(MovieDiv)``;

const MovieImg = styled.img`
  /* height: 200px; */
  width: 100%;
`;

const MovieTitle = styled.h3`
  font-size: 16px;
  height: 100px;
  margin: 0;
`;

const MovieYear = styled.h3`
  color: lightgray;
  margin: 0;
  margin-bottom: 5px;
`;

const NominateButton = styled.button`
  background-color: ${(props) =>
    props.remove ? "rgba(255, 50, 50, 1)" : "gold"};
  border: none;
  color: black;
  justify-self: flex-end;
  margin-top: 10px;
  font-size: 16px;
  font-family: agenda, sans-serif;
  font-weight: 400;
  font-style: normal;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
`;

const ViewButton = styled.button`
  background-color: gold;
  border: none;
  border-radius: 7px;
  padding: 10px;
  color: black;
  margin: 15px;
  font-size: 20px;
  font-family: agenda, sans-serif;
  font-weight: 500;
  font-style: normal;
  cursor: pointer;
`;
const Banner = styled.div`
  background-color: black;
  color: white;
  font-size: 30px;
  padding: 10px;
  margin-bottom: 20px;
`;

const ShowMoreButton = styled.button`
  margin-left: auto;
  margin-right: auto;
  border: none;
  color: black;
  background-color: white;
  font-family: agenda, sans-serif;
  font-weight: 500;
  font-style: normal;
  font-size: 16px;
  cursor: pointer;
  outline: none;
  transition: outline 0.2s, background-color 0.2s;
  padding: 5px;
  :hover {
    background-color: white;
    outline: 2px solid white;
  }
`;

// Hook sourced from usehooks.com
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

const IndexPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [nominations, setNominations] = useLocalStorage("nominations", []);
  const [nominationIDs, setNominationIDs] = useLocalStorage(
    "nominationIDs",
    []
  );
  const [moreResults, setMoreResults] = useState(false);
  const [showNominations, setShowNominations] = useState(false);

  const fetchData = (title) => {
    fetch(`https://www.omdbapi.com/?s=${title}&apikey=${apiKey}&type=movie`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.Response == "True") {
          setMovies((prev) => [...data.Search]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addNomination = (movie) => {
    if (!nominationIDs.includes(movie.imdbID)) {
      setNominations((prev) => [...prev, movie]);
      setNominationIDs((prev) => [...prev, movie.imdbID]);
    }
  };

  const removeNomination = (movie) => {
    let index = nominationIDs.findIndex((movieId) => movieId == movie.imdbID);
    if (index != -1) {
      setNominations((prev) => [
        ...prev.slice(0, index),
        ...prev.slice(index + 1),
      ]);
      setNominationIDs((prev) => [
        ...prev.slice(0, index),
        ...prev.slice(index + 1),
      ]);
    }
  };

  const searchHandler = (event) => {
    setSearchTerm(event.target.value);
    fetchData(event.target.value);
    setMoreResults(false);
    setShowNominations(false);
  };
  return (
    <Main>
      <Container>
        <title>The Shoppies Nominations</title>
        <Title>🏆 THE SHOPPIES NOMINATIONS 🏆</Title>
        {nominations.length === 5 ? (
          <Banner>Congrats! You've selected your five nominations!</Banner>
        ) : (
          ""
        )}
        {nominations.length > 5 ? (
          <Banner>Error! You've selected more than five nominations!</Banner>
        ) : (
          ""
        )}
        <SearchInput
          placeholder="Search for movie titles..."
          value={searchTerm}
          onChange={searchHandler}
        ></SearchInput>
        <ViewButton
          onClick={() => {
            setShowNominations(!showNominations);
          }}
        >
          {showNominations
            ? "Back to Search Results"
            : `View Nominations (${nominations.length}/5)`}
        </ViewButton>
        {!showNominations ? (
          movies.length > 0 ? (
            <ResultsContainer>
              <Results>
                {movies.slice(0, !moreResults ? 5 : 10).map((movie) => (
                  <MovieDiv
                    key={movie.imdbID}
                    onClick={() => {
                      if (nominationIDs.includes(movie.imdbID)) {
                        removeNomination(movie);
                      } else {
                        addNomination(movie);
                      }
                    }}
                  >
                    <MovieYear>{movie.Year}</MovieYear>
                    <MovieTitle>{movie.Title}</MovieTitle>
                    {movie.Poster !== "N/A" ? (
                      <MovieImg src={movie.Poster} />
                    ) : (
                      <></>
                    )}
                    <NominateButton
                      remove={nominationIDs.includes(movie.imdbID)}
                    >
                      {!nominationIDs.includes(movie.imdbID) ? "NOMINATE" : "X"}
                    </NominateButton>
                  </MovieDiv>
                ))}
              </Results>
              {!moreResults ? (
                <ShowMoreButton
                  onClick={() => {
                    setMoreResults(true);
                  }}
                >
                  {" "}
                  Show me 5 more{" "}
                </ShowMoreButton>
              ) : (
                <></>
              )}
            </ResultsContainer>
          ) : (
            <></>
          )
        ) : (
          <NominationsContainer>
            <h1>Your Nominations ({nominations.length}/5)</h1>
            {nominations.length > 0 ? (
              <NominationsFlex>
                {nominations.map((movie) => (
                  <NominationDiv
                    key={movie.imdbID}
                    onClick={() => {
                      if (nominationIDs.includes(movie.imdbID)) {
                        removeNomination(movie);
                      } else {
                        addNomination(movie);
                      }
                    }}
                  >
                    <MovieYear>{movie.Year}</MovieYear>
                    <MovieTitle nomination={true}>{movie.Title}</MovieTitle>
                    {movie.Poster !== "N/A" ? (
                      <MovieImg src={movie.Poster} />
                    ) : (
                      <></>
                    )}
                    <NominateButton
                      remove={nominationIDs.includes(movie.imdbID)}
                    >
                      {!nominationIDs.includes(movie.imdbID) ? "NOMINATE" : "X"}
                    </NominateButton>
                  </NominationDiv>
                ))}
              </NominationsFlex>
            ) : (
              <></>
            )}
          </NominationsContainer>
        )}
      </Container>
    </Main>
  );
};

export default IndexPage;
