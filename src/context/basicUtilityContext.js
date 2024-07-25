import React, { useState } from 'react';
import { createContext } from 'react';
import axios from 'axios';

export const BasicUtilityContext = createContext() ; 

export default function BasicUtilityContextProvider({children}){
    const authChecker = async () => {
        const login = JSON.parse(localStorage.getItem('login'));
        axios.defaults.headers.common['Authorization'] = `Bearer ${login?.token}`;
        const res = await axios.post('http://localhost:7777/is-auth-user');
        return res.data ; 
    }
    const [loading , setLoading] = useState(false) ; 
    const data = {
        authChecker , 
        loading , 
        setLoading
    }
    
    return <BasicUtilityContext.Provider value = {data}>
        {children}
    </BasicUtilityContext.Provider>
}