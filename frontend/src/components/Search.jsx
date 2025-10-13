import { useState } from "react";
import { useNavigate } from "react-router-dom";
import searchController from "../controller/Search.controller.jsx";

export default function SearchPage(){
  const [city,setCity]=useState('')
  const navigate=useNavigate()
  
  const handleSearch=async(e)=>{
    e.preventDefault();
    const result= await searchController.searchDestination(city)
    if(result.success){

      navigate(`/results/${city}`)
    }

  };
    return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <h1 className="text-3xl font-bold mb-6">Discover Your Next Destination 🌍</h1>
      <form onSubmit={handleSearch} className="flex items-center space-x-3">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-4 py-2 border rounded-lg w-64"
        />
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>
    </div>
  );


}