import { useState, useEffect } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount, getTrendingMovies } from "./appwrite.js";

// TMDB API configuration
// API (Application Programming Interface) - rules that allow different software to communicate
const API_BASE_URL = "https://api.themoviedb.org/3";

// Get API key from environment variables
//console.log(API_KEY); // Uncomment to verify API key is loaded correctly
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// TMDB API uses Bearer token authorization (unlike WatchMode's query parameters)
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  //UseDebounce is a function that delays the execution of a function until a certain amount of time has passed since it was last called. To prevent singular character api request.

  // In this case, debounce the search term input by
  // waiting for the user to stop typing for 1 second
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  // State management for search functionality and error handling
  const [searchTerm, setSearchTerm] = useState(""); // InitialState: emptyString

  const [movieList, setMovieList] = useState([]); // State to hold fetched movie data -> InitialState: emptyArray so we can map and render it later.
  const [errorMessage, setErrorMessage] = useState(""); // For displaying API errors to user // Initialstate: emptyString
  const [isLoading, setIsLoading] = useState(false); // State to track loading status -> InitialState: false

  //Trending Movie List State
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isTrendingLoading, setIsTrendingLoading] = useState(false);
  const [trendingError, setTrendingError] = useState("");

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm]);

  // Function to normalize search terms for consistent database storage
  const normalizeSearchTerm = (term) => {
    return term
      .toLowerCase() // Convert to lowercase
      .replace(/[^\w\s]/g, "") // Remove special characters (keep only letters, numbers, and spaces)
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .trim(); // Remove leading and trailing spaces
  };

  // Fetch popular movies from TMDB API
  const fetchMovies = async (query = "") => {
    setIsLoading(true); // Set loading state to true when starting fetch
    setErrorMessage(""); // Clear any previous error messages -> cuz nothing happens yet.

    try {
      // TMDB discover endpoint - gets popular movies with full details (posters, overview, etc.)

      //TMDB search endpoint - searches movies by title, returns less data (no posters, etc.)

      //logic: if there's a query, use the search endpoint, otherwise use the discover endpoint
      //ternary operator: condition ? valueIfTrue : valueIfFalse

      //encodeURI - encodes instances of special character in a URL (like spaces). This will make sure our search term if weird characters are in it, it will still work.
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      //console.log(data); // Log the fetched movie data for debugging

      // Check for API errors in the response
      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies"); // value: data.Error
        setMovieList([]); // Set movieList to empty array on error
        return; //exit out of function
      }

      //If it succeeds, proceed to set movie list state
      setMovieList(data.results); // set movie list to data.results array -> populate with real movie

      // If there is a query and if a movie exist for that query
      // then updateSearchCount to which provide the query and the info about that movie
      if (query && data.results.length > 0) {
        const normalizedQuery = normalizeSearchTerm(query);
        await updateSearchCount(normalizedQuery, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Failed to fetch movies. Please try again later.");

      //Finally clause, no matter what happens, if it succeeds or fails, we want to set loading to false, cuz we
      // already have the data or we have an error, either way, we're done loading.
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Trending movies
  const loadTrendingMovies = async () => {
    setIsTrendingLoading(true);
    setTrendingError("");
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.log(`Error fetching trending movies: ${error}`);
      setTrendingError(
        "Failed to load trending movies. Please try again later."
      );
    } finally {
      setIsTrendingLoading(false);
    }
  };

  // Fetch movies when component first loads
  useEffect(() => {
    fetchMovies(debouncedSearchTerm); // Fetch movies with initial empty search term
  }, [debouncedSearchTerm]); // whenever search term changes, we want to refetch movies

  // Fetch trending movies when component first loads
  useEffect(() => {
    loadTrendingMovies();
  }, []); // Empty dependency array means this runs only at the start.

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            {" "}
            Discover your next favorite{" "}
            <span className="text-gradient"> Movies </span> everytime at
            Paldo.Com{" "}
          </h1>

          {/* Search component - passes searchTerm state up to parent */}
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          {/*<h1 className="text-white">{searchTerm}</h1> Display the current search term for testing */}
        </header>

        {/* Trending Movies Section */}

        {(trendingMovies.length > 0 || isTrendingLoading || trendingError) && (
          <section className="trending">
            <h2>Trending Movies</h2>
            {isTrendingLoading ? (
              <Spinner />
            ) : trendingError ? (
              <p className="text-red-500">{trendingError}</p>
            ) : trendingMovies.length > 0 ? (
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>
                      {" "}
                      {index + 1}. {movie.title}{" "}
                    </p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        )}

        <section className="all-movies">
          {/* Movie cards will go here */}

          <h2>All Movies</h2>

          {/* In tailwind css if you need custom values (you own sizes you need to use square brackets */}

          {/* Conditional Rendering
        Check if currently loadding then open up a ternary operator
        and show a <p> tag </p> of Loading...

        Else : if we're not loading, check if an error message exists.
        And if an error message exists, then render another p tag with
        the dynamic error message state.

        Then if ?, neither loading nor showing an error message, then
        we render an unordered list of movie titles from the movieList.
        
        We need to call the array and map it so that we can get the
        specific movie properties we want

        ? => If
        : => Else
        && => And
        */}

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
                //render a movie card and passed a movie.id and a prop movie to movie card
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;

// Add loading and error states for trending movies. (challenge completed)
// Add a type of filter in search to fix a bug where the searchTerm 
// when saved in db sometimes similar: Scenarios like Silent Voice -> saved, 
// Silent Voide + space -> saved as a different searchTerm. It needs to remove 
// spaces and special characters and make it lowercase only. So that it can be consistent.
// (CHALLENGE COMPLETED)
