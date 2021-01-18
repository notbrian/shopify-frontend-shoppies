import React, { useEffect, useState, useLoca } from "react";
import styled from "styled-components";

const apiKey = "e8ecfb7c";

const Main = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: futura-pt, sans-serif;
  font-weight: 500;
  font-style: normal;
`;

const Container = styled.div`
  width: 80%;
  padding: 10px;
`;

const SearchContainer = styled.div`
  border: 1px solid black;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0;
  border: 1px solid black;
`;

const ResultsContainer = styled.div`
  border: 1px solid black;
  padding: 10px;
  max-height: 500px;
  overflow-y: scroll;
  display: flex;
`;

const NominationsContainer = styled.div`
  border: 1px solid black;
  padding: 10px;
`;

const NominationsFlex = styled.div`
  display: flex;
`;

const MovieDiv = styled.div`
  /* height: 0px; */
  width: 300px;
  max-height: 450px;
  border: 1px solid black;
  padding: 10px;
  margin: 10px;
`;

const MovieImg = styled.img`
  height: 200px;
`;

const NominateButton = styled.button`
  display: block;
`;

const Banner = styled.div`
  background-color: black;
  color: white;
  font-size: 30px;
  padding: 10px;
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
    let index = nominationIDs.findIndex((movieId) => movie.imdbID);
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
  };
  return (
    <Main>
      <Container>
        <title>The Shoppies Nominations</title>
        <h1>The Shoppies Nominations</h1>
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
        <ResultsContainer>
          {movies.map((movie) => (
            <MovieDiv>
              <h3>{movie.Title}</h3>
              <h3>{movie.Year}</h3>
              {movie.Poster !== "N/A" ? <MovieImg src={movie.Poster} /> : <></>}
              {nominationIDs.includes(movie.imdbID) ? (
                <NominateButton disabled={true}>+ Nominate </NominateButton>
              ) : (
                <NominateButton
                  onClick={() => {
                    addNomination(movie);
                  }}
                >
                  + Nominate{" "}
                </NominateButton>
              )}
            </MovieDiv>
          ))}
        </ResultsContainer>
        <NominationsContainer>
          <h1>Your Nominations ({nominations.length}/5)</h1>
          <NominationsFlex>
            {nominations.map((movie) => (
              <MovieDiv>
                <h3>{movie.Title}</h3>
                <h3>{movie.Year}</h3>
                <MovieImg src={movie.Poster} />
                <NominateButton
                  onClick={() => {
                    removeNomination(movie);
                  }}
                >
                  X
                </NominateButton>
              </MovieDiv>
            ))}
          </NominationsFlex>
        </NominationsContainer>
      </Container>
    </Main>
  );
};

export default IndexPage;
