import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Dialog from '@mui/material/Dialog';
import DialogContent from "./DialogContent";
import axios from "axios";
import { basicURL } from "../data/basicURL";



const dialogStyle = {
    height: "600px",
    width: "auto",
    maxWidth: "100%",
    maxHeight: "100%",
    boxShadow: "none",
    overflow: "hidden"
}


const PostImageTile = ({ post, user , id }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [likes , setLikes] = useState(post.likes.length) ; 
    const [comments , setComments] = useState(post.comments.length) ; 
    const [isLiked , setIsLiked] = useState(post?.likes?.includes(id)) ;  

    const getLikesComment = async () => {
        const res = await axios.get(`${basicURL}/fetch/like-comments-of-a-post/${post.id}` , {}) ; 
        const {likes , comments} = res.data ; 
        setLikes(likes.length) ; 
        setComments(comments.length) ;    
    }
    const clickHandler = () => {
        if(openDialog){
            getLikesComment() ; 
        }
        setOpenDialog(!openDialog);
    }
    return (
        <div>
            <div className="h-[300px] w-[300px] relative group" onClick={clickHandler}>
                <div className="absolute h-[300px] w-[300px] bg-[rgba(255,255,255,0.1)] backdrop-blur-[3px] cursor-pointer justify-center items-center gap-[30px] flex transition transform duration-500 opacity-0 group-hover:opacity-100">
                    <div className="flex flex-row text-white text-[24px] justify-center items-center gap-[10px]">
                        <FaHeart /> <span className="text-[28px] font-[sans-serif] font-[600]"> {likes}</span>
                    </div>
                    <div className="flex flex-row text-white text-[24px] justify-center items-center gap-[10px]">
                        <FaComment /> <span className="text-[28px] font-[sans-serif] font-[600]"> {comments}</span>
                    </div>
                </div>
                <img src={post.postImage[0]} className="w-[100%] h-[100%] object-contain" />
            </div>
            <Dialog open={openDialog} PaperProps={{ sx: dialogStyle }} >
                <DialogContent post={post} user={user} id = {id} postLiked = {isLiked} />
                <IoClose onClick={clickHandler} className="absolute cursor-pointer left-0  text-white text-[32px]" />
            </Dialog>
        </div>
    )
}

export default PostImageTile; 