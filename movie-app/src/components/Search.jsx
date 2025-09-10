import React from 'react'


const Search = ({ searchTerm, setSearchTerm }) => {
// to not use props. you can destructure the props object directly in the function parameter list
  return (
   <div className="search">
    <div>
      <img src="search.svg" alt="search" />

      <input 
      type="text"
      placeholder="Search through thousands of animes"
      value={searchTerm}
      onChange={(event) => setSearchTerm(event.target.value)} // Update the search term state on input change
      />
    </div>
   </div>
  )
}

export default Search

//summary
// This Search component is a functional React component that renders a search input field.
// It takes two props: searchTerm (the current value of the search input) and setSearchTerm (a function to update the search term).
// The component includes an input field where users can type their search queries.
// As the user types, the onChange event handler calls setSearchTerm with the new input value, allowing the parent component to manage the search state.