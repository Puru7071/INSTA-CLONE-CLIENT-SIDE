import React, { useState } from "react";
import { FaFire } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const OTP = () => {
    const navigate = useNavigate() ; 
    const [OTP , setOTP] = useState({
        OTP: "" 
    }) ; 

    const changeHandler = (event) => {
        const {name , value} = event.target ; 
        setOTP(prevOTP => ({
            ...prevOTP , 
            [name] : value
        }))
    }

    const submitHandler = async (event) => {
        event.preventDefault() ; 
        try{
            const {data} = await axios.post('http://localhost:7777/validate-OTP', OTP);
            console.log(data) ; 

            if(data?.created) {
                toast.success(`${data?.sucMsg}`) ; 
                navigate("/") ; 
            }
            else{
                toast.error(`${data?.errMsg}`) ; 
                return ; 
            }
        }
        catch(error){
            toast.error("Something is wrong, try again!")
        }
    }

    return (
        <div className="flex flex-col w-[100%] relative">
            <div className="flex flex-row justify-start items-center gap-[20px]">
                <div className=" bg-[#e9ecef] h-[60px] w-[60px] flex justify-center items-center rounded-[50px]">
                    <div className="bg-[#00a8e8] w-[40px] h-[40px] rounded-[50px] flex justify-center items-center">
                        <FaFire className="text-[white] text-[24px]" />
                    </div>

                </div>
                <div className="font-[700] text-[32px] text-slate-700">
                    OTP
                    <div className="font-[500] text-[18px] text-slate-500">
                        OTP adds an additional layer of security.
                    </div>
                </div>
            </div>

            <form className="flex flex-col" onSubmit={submitHandler}>

                <label>
                    <p className="text-[18px] font-[500] mt-[10px] text-slate-500 mb-[5px]">Enter OTP<sup className="text-[#00a8e8] relative">*</sup></p>
                </label>
                <input onChange={changeHandler} type="text" name="OTP" placeholder="Enter OTP" value={OTP.OTP} required={true} className="border-[2px] border-slate-200 w-[90%] px-[15px] py-[10px] rounded-[50px]" />

                <div className="flex flex-col gap-[20px] mt-[20px]">
                    <button type="submit" className="w-[35%] py-[8px] mt-[10px] border-[#0582ca] border-[2px] rounded-[10px] text-[18px] font-[600] bg-[#0582ca] text-[white] hover:bg-[white] hover:text-[#0582ca] transition transform duration-300">
                        Confirm
                    </button>
                </div>
            </form>
        </div>
    )
}

export default OTP; 