import React, { useState } from "react";
import { IoIosMore } from "react-icons/io";
import { FaCircleChevronLeft } from "react-icons/fa6";
import { FaChevronCircleRight } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import { FaRegPaperPlane } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FaRegBookmark } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { IoAddOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { IoMdPersonAdd } from "react-icons/io";
import Dialog from '@mui/material/Dialog';
import DialogContent from "./DialogContent";
import axios from "axios";
import { basicURL } from "../data/basicURL";
import toast from "react-hot-toast";
import { Menu, MenuItem } from '@mui/material';
import { MdOutlineDeleteOutline } from "react-icons/md";
import { MdOutlineReportProblem } from "react-icons/md";

import profile from "../assets/profile.jpeg";


const dialogStyle = {
    height: "600px",
    width: "auto",
    maxWidth: "100%",
    maxHeight: "100%",
    boxShadow: "none",
    overflow: "hidden"
}

const Post = ({ post, user, id }) => {
    const imgArr = post?.postImage || [];
    const [imgIndex, setImgIndex] = useState(0);
    const [isScrollingLeft, setIsSrollingLeft] = useState(false);
    const [isScrollingRight, setIsSrollingRight] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const [comments, setComments] = useState(post?.comments?.length);
    const [comment, setComment] = useState("");
    const handleCommentChange = (event) => {
        setComment(event.target.value);
    }
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const getLikesComment = async () => {
        const res = await axios.get(`${basicURL}/fetch/like-comments-of-a-post/${post.id}`, {});
        const { likes, comments } = res.data;
        setLikes(likes?.length);
        setComments(comments?.length);
        setIsLiked(likes?.includes(id));
    }
    const createCommentHandler = async () => {
        try {
            if (comment === "") return toast.error("Create Comment first !!");
            const res = await axios.post(`${basicURL}/create/comment/${post.id}/${id}`, { comment: comment });
            const { createdComment, commentCreated, msg } = res.data;
            if (commentCreated) {
                getLikesComment();
                toast.success(msg);
            }
            else {
                toast.error(msg);
            }

        } catch (error) {
            toast.error("Something went wrong !!")
        }
    }

    const [likes, setLikes] = useState(post?.likes?.length);
    const [isLiked, setIsLiked] = useState(post?.likes?.includes(id));
    const likePost = async () => {
        try {
            console.log(user);
            const res = await axios.post(`${basicURL}/create/like/${post.id}/${id}`, {});
            const { isLiked } = res.data;
            setIsLiked(isLiked);
            if (isLiked) {
                setLikes(likes + 1);
            } else {
                setLikes(likes - 1);
            }

        } catch (err) {
            toast.error("Something went wrong !!");
        }
    }
    const clickHandler = () => {
        if (openDialog) {
            getLikesComment();
        }
        setOpenDialog(!openDialog);
    }

    const leftMoveHandler = () => {
        setIsSrollingLeft(true);
        setTimeout(() => {
            setIsSrollingLeft(false);
            const i = imgIndex;
            setImgIndex(i + 1)
        }, 80)
    }
    const rightMoveHandler = () => {
        setIsSrollingRight(true);
        setTimeout(() => {
            setIsSrollingRight(false);
            const i = imgIndex;
            setImgIndex(i - 1)
        }, 80)
    }
    const followHandler = async () => {
        try {
            const res = await axios.post(`${basicURL}/create/follower/${user?.id}/${id}`, {});
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

    const [isDeleted, setIsDeleted] = useState(false);
    const deletePostHandler = async () => {
        try {
            const res = await axios.post(`${basicURL}/update/delete/post/${post?.id}/${user?.id}`);
            console.log(res?.data?.done) ; 
            if(res?.data?.done){
                setIsDeleted(true);
                toast.success("Post Deleted !!") ; 
            }
        } catch (err) {
            toast.error("Something went wrong !!");
        }
    }
    const reportPostHandler = async () => {
        try {
            const res = await axios.post(`${basicURL}/create/report/post/${post?.id}/${id}`);
            console.log(res?.data?.done) ; 
            if(res?.data?.done){
                toast.success("Post Reported !!") ; 
            }
        } catch (err) {
            toast.error("Something went wrong !!");
        }
    }

    return (
        <div>
            {!isDeleted && <div className="h-[830px] w-[440px] relative border-b-[2px] border-b-[#262626] mb-[20px]">
                {(imgIndex > 0 && imgIndex <= imgArr?.length - 1) && <div className="w-[10px] h-[10px] absolute left-2 top-[335px] cursor-pointer text-[#495057] text-[24px]" onClick={rightMoveHandler}>
                    <FaCircleChevronLeft />
                </div>}
                {(imgIndex >= 0 && imgIndex < imgArr?.length - 1) && <div className="w-[10px] h-[10px] absolute right-5 top-[335px] cursor-pointer text-[#495057] text-[24px]" onClick={leftMoveHandler}>
                    <FaChevronCircleRight />
                </div>}
                <div className="absolute top-[590px] w-[440px] flex justify-center items-center text-[14px] font-[800]">
                    <div className="flex flex-row ">
                        {imgArr?.map((img, index) => {
                            if (index === imgIndex) {
                                return <div><GoDotFill className="text-[white]" /></div>
                            }
                            return <div><GoDotFill className="text-slate-400" /></div>
                        })}
                    </div>
                </div>

                <div className="w-[100%] h-[60px] mb-[5px] flex flex-row text-white justify-between items-center">
                    <div className="h-[100%] flex flex-row justify-start items-center gap-[10px] font-[sans-serif]">
                        <div className="h-[40px] w-[40px] rounded-[45px] border-[2px] border-[#262626] flex justify-center items-center relative group">
                            <NavLink to={`/user-profile/${user?.id}`} >
                                {!!(user?.avatar) ? <img src={user?.avatar}
                                    alt="image"
                                    className="w-[40px] h-[40px] object-cover rounded-[40px]"
                                /> : <img src={profile}
                                alt="image"
                                className="w-[100%] h-[100%] object-cover rounded-[40px]"
                            />}
                            </NavLink>
                            <div className="absolute top-[30px] left-[27px] h-[340px] rounded-[10px] w-[400px] bg-[black] hidden group-hover:flex p-[10px] shadow-2xl shadow-white">
                                <div className="w-[100%] h-[100%] flex flex-col">
                                    <div className=" flex flex-row h-[80px] w-[100%]  items-center gap-[20px]">
                                        <div className=" h-[80px] w-[80px] rounded-[80px] overflow-hidden">
                                            { !!(user?.avatar)? <img src={user?.avatar} className="h-[100%] w-[100%] object-cover"></img> : <img src={profile} className="h-[100%] w-[100%] object-cover"></img>}
                                        </div>
                                        <div className="flex flex-col text-[28px] font-[sans-serif] font-500">
                                            <h1>{user?.name}</h1>
                                            <h5 className="text-[16px] font-600 font-[sans-serif] text-[#adb5bd] mt-[-10px]">{user?.bio.substr(0, 25) + "..."}</h5>
                                        </div>
                                    </div>
                                    <div className="flex flex-row w-[100%] h-[40px] text-white mt-[10px]">
                                        <div className="flex flex-col w-[33%] justify-center items-center">
                                            <div>{user?.posts}</div>
                                            <div>Posts</div>
                                        </div>
                                        <div className="flex flex-col w-[33%] justify-center items-center">
                                            <div>{user?.followers?.length}</div>
                                            <div>followers</div>
                                        </div>
                                        <div className="flex flex-col w-[33%] justify-center items-center">
                                            <div>{user?.following?.length}</div>
                                            <div>following</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row w-[100% gap-[10px] justify-start items-center mt-[10px]">
                                        {user?.profileImages?.map((image, index) => (<div className="h-[120px] w-[120px]">
                                            <img className="w-[100%] h-[100%] object-contain" src={user?.profileImages?.[index]}></img>
                                        </div>))}
                                    </div>
                                    {!user?.followers?.includes(id) && <button onClick={followHandler} className=" w-[90%] py-[7px] bg-[#00a8e8] m-[auto] text-[18px] font-[600] flex flex-row justify-center items-center gap-[10px] rounded-[6px]">
                                        <IoMdPersonAdd /> <span>Follow</span>
                                    </button>}
                                    {user?.followers?.includes(id) && <button className=" w-[90%] py-[7px] bg-[#a8a8a8] m-[auto] text-[18px] font-[600] flex flex-row justify-center items-center gap-[10px] rounded-[14px]">
                                        <span>Following</span>
                                    </button>}
                                </div>
                            </div>
                        </div>
                        <div className="font-[600] text-[white] text-[14px] flex flex-row items-center gap-[5px]">
                            {user?.name}<span className="text-[12px] font-[500] text-slate-400 flex flex-row items-center"> <GoDotFill /> {post?.relativeTime}</span>
                        </div>
                    </div>
                    <div>
                        <IoIosMore className="text-[24px] font-[500] cursor-pointer" onClick={handleClick} />
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            sx={{
                                '& .MuiPaper-root': {
                                    backgroundColor: '#343a40',
                                    color: 'white',
                                },
                            }}
                        >

                            {id === user?.id && <MenuItem onClick={deletePostHandler} ><MdOutlineDeleteOutline className="text-[24px] mr-[10px]" /><div className="font-[700]">Delete Post</div> </MenuItem>}
                            {id !== user?.id && <MenuItem onClick={reportPostHandler} > <MdOutlineReportProblem className="text-[24px] mr-[10px]" /> <div className="font-[700]">Report Post</div></MenuItem>}

                        </Menu>
                    </div>
                </div>

                <div className="h-[550px] w-[100%] border-[0.9px] border-[#262626] mb-[5px] overflow-hidden">
                    <div className={`w-[4000%] h-[100%] flex flex-row justify-start  ${isScrollingLeft ? "duration-500 transform-all translate-x-[-440px]" : (isScrollingRight ? "duration-500 transform-all translate-x-[440px]" : "")}`}>
                        <div className="w-[440px] h-[100%]">
                            <img className="w-[100%] h-[100%] object-contain" src={imgArr[imgIndex]} />
                        </div>
                    </div>
                </div>
                <div className="h-[50px] w-[100%] flex flex-row justify-between items-center text-[white] font-[400] text-[28px] mb-[5px]">
                    <div className="flex flex-row h-[100%] items-center gap-[20px]">
                        {!isLiked ? <FaRegHeart onClick={likePost} className="cursor-pointer" /> : <FaHeart onClick={likePost} className="cursor-pointer text-red-700 heart-animation" />}
                        <FaRegComment className="cursor-pointer" onClick={clickHandler} />
                        <FaRegPaperPlane />
                    </div>
                    <FaRegBookmark />
                </div>
                <div className="w-[100%] font-[600] text-[14px] text-white ">
                    {likes} likes
                </div>
                <div className="w-[100%] ">
                    <span className="text-[14px] font-[600] mr-[10px]">{user?.name}</span>
                    <span className="text-[14px] font-[400]">{post?.description}</span>
                </div>
                <div className=" text-[14px] font-[400] text-[#a8a8a8] cursor-pointer" onClick={clickHandler}>
                    {comments ? (comments === 1 ? `View a comment` : `View all ${comments} comments`) : "View Post"}
                </div>
                <div className=" pb-[20px] relative">
                    <input onChange={handleCommentChange} className="w-[100%] bg-[transparent] border-[0px] outline-none text-[14px] text-[text-[#a8a8a8]] " placeholder="Add a comment...."></input>
                    <IoAddOutline onClick={createCommentHandler} className=" absolute top-0 right-3 text-[20px] text-white font-[900] cursor-pointer transition transform duration-500 hover:text-[#e500a4] hover:rotate-180" />
                </div>

                <Dialog open={openDialog} PaperProps={{ sx: dialogStyle }} >
                    <DialogContent post={post} user={user} id={id} postLiked={isLiked} setIsDeleted={setIsDeleted}/>
                    <IoClose onClick={clickHandler} className="absolute cursor-pointer left-0  text-white text-[32px]" />
                </Dialog>
            </div>}
        </div>
    )
}

export default Post; 