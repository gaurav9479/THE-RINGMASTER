import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { X, Mail, Lock, User, Phone } from 'lucide-react';
import { RegisterUser } from "../utils/axios.auth";
import {toast} from "react-hot-toast"

function RegisterModal() {
    const { isRegisterOpen, setIsRegisterOpen, setIsLoggedIn, setIsLoginOpen } = useAuth();
    const [fullname, setfullname] = useState('');
    const [UserName, setUserName] = useState('');
    const [Phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!fullname || !UserName || !email || !Phone || !password || !confirmPassword) {
            toast.error("All fields are required");
            return;
        }
        
        if (password !== confirmPassword) {
            toast.error("Passwords don't match!");
            return;
        }

        try{
            const userData={ UserName, email, fullname, Phone, password}
            const res= await RegisterUser(userData) 
            toast.success("Registration Successfull",res)

            setIsLoggedIn(true);
            setIsRegisterOpen(false);
        }catch(error){
            console.error("Registration failed:", error);
            toast.error(error?.response?.data?.message || "Registration failed");
        }
        
    }
    
    const switchToLogin = () => {
        setIsRegisterOpen(false);
        setIsLoginOpen(true);
    }
    
    if (!isRegisterOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-md"
                onClick={() => setIsRegisterOpen(false)}
            />
            
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6">
                <button
                    onClick={() => setIsRegisterOpen(false)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                    <X size={20}/>
                </button>
                
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
                    <p className="text-sm text-gray-600 mt-1">Join us today</p>
                </div>
                
                <div className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={UserName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="UserName"
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>
                    
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="name"
                            value={fullname}
                            onChange={(e) => setfullname(e.target.value)}
                            placeholder="fullname"
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="Number"
                            value={Phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Phone"
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>
                    
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>
                    
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-purple-600 text-white py-2.5 rounded-lg font-semibold hover:bg-purple-700"
                    >
                        Register
                    </button>
                </div>
                
                <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{' '}
                    <button 
                        onClick={switchToLogin}
                        className="text-purple-600 font-semibold hover:text-purple-700"
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
}

export default RegisterModal;