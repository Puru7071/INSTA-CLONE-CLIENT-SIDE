import React from "react";

const Comments = ({comment}) => {
    return (
        <div>
            <div className="w-[100%] h-[50px] flex flex-row justify-start items-center mt-[10px]">
                <div className="h-[40px] w-[40px] rounded-[40px] bg-black overflow-hidden ml-[5px]">
                    <img className="h-[100%] w-[100%] object-contain" src={user.avatar}></img>
                </div>
                <div className="text-[white]  font-[sans-serif] ml-[20px] h-[100%] flex flex-col mt-[10px]">
                    <span className="text-[14px] font-[600]">{user.name} <span className=" ml-[5px] font-[400]">{post.description}</span></span>
                    <span className="text-[10px] font-[300] text-[#adb5bd]">{post.relativeTime}</span>
                </div>
            </div>
        </div>
    )
}
export default Comments; 