import React, { useContext, useEffect, useState } from "react";
import { FaFire } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BasicUtilityContext } from "../context/basicUtilityContext";


const Login = () => {
    const navigate = useNavigate();
    const { authChecker } = useContext(BasicUtilityContext);

    useEffect(() => {
        async function callAPI() {
            const res = await authChecker();
            console.log(res);
            const { isAuth } = res;

            if (isAuth) {
                navigate("/home")
            }
        }
        callAPI() ; 
        return;
    }, [])

    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    })

    const changeHandler = (event) => {
        const { name, value } = event.target;
        setLoginData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        try {
            const { data } = await axios.post('http://localhost:7777/login-request', loginData);
            if (data.log) {
                localStorage.setItem("login", JSON.stringify({
                    loggedIn: true,
                    token: data.token
                }));
                toast.success(`${data.msg}`);
                navigate("/home")
            }
            else {
                toast.error(`${data.msg}`)
            }
        }
        catch (error) {
            if (error?.response?.data === "Unauthorized") {
                toast.error(`${error.response.data}`);
            }
            else {
                toast.error("Something is wrong, try again!")
            }
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
                    Login
                    <div className="font-[500] text-[18px] text-slate-500">
                        Welcome Back !
                    </div>
                </div>
            </div>

            <form className="flex flex-col" onSubmit={submitHandler}>

                <label>
                    <p className="text-[18px] font-[500] mt-[10px] text-slate-500 mb-[5px]">Email Address <sup className="text-[#00a8e8] relative">*</sup></p>
                </label>
                <input onChange={changeHandler} value={loginData.email} type="email" name="email" placeholder="Enter email" required={true} className="border-[2px] border-slate-200 w-[90%] px-[15px] py-[10px] rounded-[50px]" />

                <label>
                    <p className="text-[18px] font-[500] mt-[10px] text-slate-500 mb-[5px]">Enter Password <sup className="text-[#00a8e8] relative">*</sup></p>
                </label>
                <input onChange={changeHandler} value={loginData.password} type="password" name="password" placeholder="Password" required={true} className="border-[2px] border-slate-200 w-[90%] px-[15px] py-[10px] rounded-[50px]" />

                <div className="flex flex-col gap-[20px] mt-[20px]">
                    <button type="submit" className="w-[35%] py-[8px] mt-[10px] border-[#0582ca] border-[2px] rounded-[10px] text-[18px] font-[600] bg-[#0582ca] text-[white] hover:bg-[white] hover:text-[#0582ca] transition transform duration-300">
                        Login
                    </button>
                    <div className="text-slate-700 font-[600] cursor-pointer" onClick={() => navigate("/sign-up")}>
                        Dont't have an account, Create one !
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Login; 