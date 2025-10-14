import { toast } from "react-toastify";
import { searchByCity } from "../utils/axios.auth.jsx";

class SearchControler{
    constructor(){
        this.searchResult=null;
        this.loading=false;
        this.searchHistory=this.loadSearchHistory();

    }
    loadSearchHistory(){
        try{
            const history=localStorage.getItem('searchHistory')
            return history?JSON.parse(history):[];
        }catch(error){
            console.error('Failed to load search history:', error)
            return [];
        }
    }
    saveSearchHistory(history){
        try{
            localStorage.setItem('searchHistory',JSON.stringify(history))

        }catch(error){
            console.error('Failed to save search history:', error);
        }
    }
    addtoHistory(city){
        const filtered=this.searchHistory.filter(
            item=>item.toLowerCase()!==city.toLowerCase()
        );
        this.searchHistory=[city,...filtered].slice(0,5);
        this.saveSearchHistory(this.searchHistory);
        return this.searchHistory;
    }
    clearHistory() {
        this.searchHistory = [];
        localStorage.removeItem('searchHistory');
    }
    async searchDestination(city){
        if(!city||!city.trim()){
            toast.warning("please enter city name");
            return { success: false, error: 'Empty city name' };

        }
        this.loading=true
        try{
            const response=await searchByCity(city)
            this.searchResult=response.data.data;
            this.addtoHistory(city)
            toast.success(`Found results for ${city}`);
            return {
                success: true,
                data: this.searchResult
            };
        }catch(error){
            const errormsg=error.response?.data?.message||"failed to fetch"
            toast.error(errormsg);
            console.error('Search error:', error);
            return {
                success: false,
                error: errormsg
            };
        }finally {
            this.loading = false;
        }
    }
    getFilterData(type='all'){
        if(!this.searchResult)return[];
        const {hotels,resturant,events}=this.searchResult.data;
        const typeMap={
            hotels:()=>hotels.map(item=>({...item,type:"hotel"})),
            resturant:()=>resturant.map(item=>({...item,type:"resturant"})),
            events:()=>events.map(item=>({...item,type:"event"})),
            all:()=>[
                ...hotels.map(item=>({...item,type:"hotel"})),
                ...resturant.map(item=>({...item,type:"resturant"})),
                ...events.map(item=>({...item,type:"event"}))
            ]

        }
        return typeMap[type]? typeMap[type]() : typeMap.all();
        
    }
    getResultsCount() {
        if (!this.searchResult) return 0;
        const { hotels, restaurant, events } = this.searchResult.results;
        return hotels + restaurant + events;
    }
    getWeather() {
        if (!this.searchResult) return null;
        return this.searchResult.data.weather;
    }
    clearResults() {
        this.searchResult = null;
    }
}
const searchController = new SearchControler();
export default searchController;
