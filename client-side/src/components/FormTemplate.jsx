import React from "react";
import Signup from "./Signup";
import FormImage from "./FormImage";
import Login from "./Login";
import OTP from "./OTP";

const FormTemplate = ({ isLogin, isOTP}) => {
    console.log(isOTP , isLogin) ; 

    return (
        <div className="bg-[#e9ecef] w-[100vw] h-[100vh] flex justify-center items-center">
            <div className="bg-[white] w-[80%] h-[80%] rounded-[30px] flex flex-row justify-evenly items-center">
                <div className="flex flex-col w-[50%] h-[auto] items-center justify-start">
                    {isLogin && !isOTP && <Login/>}
                    {!isLogin && !isOTP && <Signup/>}
                    {!isLogin && isOTP && <OTP/>}
                </div>
                <div className="w-[40%] h-[90%] overflow-hidden relative mt-[30px]">
                    <FormImage />
                </div>
            </div>
        </div>
    )
}

export default FormTemplate; 