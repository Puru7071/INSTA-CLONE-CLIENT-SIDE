import React, { useEffect, useState } from "react";
import i1 from "../assets/i1.png" ; 
import i2 from "../assets/i2.png" ; 
import i3 from "../assets/i3.png" ; 


const FormImage = () => {
    const [index , setIndex] = useState(0) ; 
    const [imgURL , setImgUrl] = useState(i1) ; 
    const [isTransition , setIsTransition] = useState(false) ; 
    useEffect(() => {
        
        const interval = setInterval(() => {
            const arr = [i1 , i2 , i3] ; 
            const i = (index + 1) % 3 ; 
            setIndex(i) ; 
            setIsTransition(true)
            setTimeout(()=>{
                setIsTransition(false) ; 
                setImgUrl(arr[i])
            } , 500)
        } , 3000) ; 

        return () => clearInterval(interval)
    }) ; 
    return (
        <div className="rounded-[20px] overflow-hidden w-[500px] h-[600px] relative">
            <img
                className="w-[100%] h-[100%] object-contain"
                alt="BE HAPPY !"
                src='https://static.cdninstagram.com/images/instagram/xig/homepage/phones/home-phones-2x.png?__makehaste_cache_breaker=73SVAexZgBW' />

            <div className="absolute top-5 left-[177px] w-[48%]">
                <img src={imgURL} alt="Be Happy" className={`transition-all duration-500 ${isTransition ? "opacity-0" : "opacity-100"}`} />
            </div>

        </div>
    )
}

export default FormImage ; 