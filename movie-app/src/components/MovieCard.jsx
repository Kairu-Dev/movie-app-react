import React from "react";

// Presentational Component to display individual movie details in a card format

const MovieCard = ({
  movie:
    // destructure movie prop to get individual movie details
    // instead of repeating movie.title, movie.vote_average, etc
    { title, vote_average, poster_path, release_date, original_language, id },
}) => {

  return (
    <div className="movie-card">
        {/*image render for card*/} 
        <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : './no-poster.png'} alt={title} />

        <div className="mt-4">
            <h3>{title}</h3>
            <div className="content">
                <div className="rating">
                    <img src="star.svg" alt="Star Icon" />
                    <p>{vote_average ? vote_average.toFixed(1) : 'N/A'} </p>
                </div>
                {/* Logic: 
                If vote_average exists, then show the vote_average to one decimal place, : else N/A
                */}

                <span> • </span>
                <p className="lang">{original_language}</p>

                <span> • </span>
                <p className="year">{release_date ? release_date.split('-')[0] : "N/A"}</p>
            </div>

            {/* Logic: 

            If release_date exists, then split the string at the hyphen and take the first element (the year), : else N/A. in tmdb dates are formatted as YYYY-MM-DD
            
            */}
        </div>
    </div>

    // logic: if ? poster path exists, then render the image from the tmdb url, : else render a placeholder image.
    
  );
};

export default MovieCard;
