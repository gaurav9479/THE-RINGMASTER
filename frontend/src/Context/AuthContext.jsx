import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

const AuthContext=createContext();
export const AuthProvider=({children})=>{
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    return(
        <AuthContext.Provider value={{isRegisterOpen, setIsRegisterOpen,isLoginOpen,setIsLoginOpen,setIsLoggedIn,isLoggedIn}}>
            {children}
        </AuthContext.Provider>
    )
}
export function useAuth(){
    return useContext(AuthContext)
}