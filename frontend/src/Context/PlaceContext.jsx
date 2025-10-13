import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

const PlaceContext=createContext()
export const PlaceProvider=({children})=>{
    const [destination,setDestination]=useState();
    const [searchResults,setSearchResults]=useState(null);
    const [loading,setloading]=useState(false);
    const [searchHistory,setSearchHistory]=useState([]);

    const searchDestination=async(city)=>{
        if(!city||!city.trim()){
            toast.warning("please enter a city naem")
            return{sucess:false}
        }
        setloading(true);
        setDestination(city);
        try{
            const response=await 
        }
    }

    return(
        <PlaceContext.Provider value={{destination,setDestination}}>
            {children}
        </PlaceContext.Provider>
    )
}
export function useDestinantion(){
    return useContext(PlaceContext);
}