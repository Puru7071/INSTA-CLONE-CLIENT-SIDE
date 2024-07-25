import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { basicURL } from "../data/basicURL";
import profile from "../assets/profile.jpeg";
import { NavLink } from "react-router-dom";

const AsideRight = ({ userID }) => {
    const [suggestions, setSuggestions] = useState([]);

    const getSuggestionsAPI = async () => {
        try {
            const res = await axios.get(`${basicURL}/fetch/suggestions/${userID}`);
            setSuggestions(res.data?.suggestions || []);
        } catch (err) {
            toast.error("Could not load Suggestions");
        }
    };
    const followHandler = async (id) => {
        try {
            const res = await axios.post(`${basicURL}/create/follower/${id}/${userID}`, {});
            const { done, msg } = res?.data;

            if (done) {
                toast.success(msg);
            }
            else {
                toast.error(msg);
            }
        } catch (err) {
            toast.error("Something went wrong !!");
        }
    }
    useEffect(() => {
        getSuggestionsAPI();
    }, []);

    return (
        <div className="fixed top-0 right-0 h-full w-[27vw] pt-[100px] pl-[10px]">
            <div className="text-[#a8a8a8] text-[18px] font-[600] mb-[40px]">
                Suggestions for You
            </div>
            {suggestions.map((suggestion) => (
                suggestion?.id !== userID && <div key={suggestion?.id} className="h-[70px] w-[90%] mb-[10px] justify-between items-center flex flex-row">
                    <div className="flex flex-row h-[100%]">
                        <NavLink to={`/user-profile/${suggestion?.id}`}>
                            <div className="h-[65px] w-[65px] rounded-[60px] overflow-hidden">
                                {!!(suggestion?.avatar) && <img src={suggestion?.avatar} className="h-[100%] w-[100%] object-cover" />}
                                {!(!!suggestion?.avatar) && <img src={profile} className="h-[100%] w-[100%] object-cover" />}
                            </div>
                        </NavLink>
                        <div className="h-[100%] flex flex-col justify-center ml-[20px]">
                            <div className="text-white text-[18px] font-[700]">{suggestion?.name?.substr(0, 10)}</div>
                            <div className="text-[#a8a8a8] mt-[-5px] text-[12px]">{suggestion?.bio?.substr(0, 20) + "..."}</div>
                        </div>
                    </div>
                    <button onClick={() => followHandler(suggestion?.id)} className="bg-[#0095f6] py-[1px] font-[600] text-[14px] rounded-[5px] px-[10px] text-white ml-[60px]">Follow</button>
                </div>
            ))}
        </div>
    );
};

export default AsideRight;
