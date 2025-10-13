import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import searchController from "../controller/Search.controller.jsx";
import { useContext } from "react";
const DestinationContext=createContext();

export function DestinationProvider({children}){
    const [destination,setDestination]=useState('');
    const [searchResult,setSearchResult]=useState(null);
    const [loading,setloading]=useState(false);
    const [searchHistory,setSearchHistory]=useState([]);
    useEffect(() => {
        setSearchHistory(searchController.loadSearchHistory());
    }, []);

    const searchDestination=async(city)=>{
        setloading(true);
        setDestination(city);
        const result = await searchController.searchDestination(city);
        if(result.success){
            setSearchResult(result.data)
            setSearchHistory([...searchController.searchHistory])
        }
        setloading(false);
        return result;
    }
    const clearResults = () => {
        searchController.clearResults();
        setSearchResult(null);
        setDestination('');
    };
    const clearHistory = () => {
        searchController.clearHistory();
        setSearchHistory([]);
    };
    const getFilteredData = (type) => {
        return searchController.getFilteredData(type);
    };
    const getWeather = () => {
        return searchController.getWeather();
    };
    return (
        <DestinationContext.Provider value={{
            destination,
            setDestination,
            searchResult,
            loading,
            searchHistory,
            searchDestination,
            clearResults,
            clearHistory,
            getFilteredData,
            getWeather
        }}>
            {children}
        </DestinationContext.Provider>
    );
}
export function useDestination(){
    const context=useContext(DestinationContext);
    if(!context){
        throw new Error('useDestinantion must be used within DestinationProvider');
    }
    return context

}