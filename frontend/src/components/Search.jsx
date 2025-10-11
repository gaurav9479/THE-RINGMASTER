import React from 'react'
import { useState } from 'react';
function Search(){
const [destination, setDestination] = useState("");

const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for trips to ${destination}`);

  };

  return (
    <div className="h-screen flex items-center justify-center bg-secondary">
      <form
        onSubmit={handleSearch}
        className="bg-primary p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Where are you going?
        </h1>
        <input
          type="text"
          placeholder="Enter destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="w-full bg-secondary text-white py-2 rounded "
        >
          Search
        </button>
      </form>
    </div>
  );
}

export default Search