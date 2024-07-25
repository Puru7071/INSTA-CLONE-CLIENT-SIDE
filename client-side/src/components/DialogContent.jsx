import React, { useContext, useState } from "react";
import { FaRegComments } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FaRegBookmark } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import { FaCircleChevronLeft } from "react-icons/fa6";
import { FaChevronCircleRight } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { basicURL } from "../data/basicURL";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import profile from "../assets/profile.jpeg"
import CommentBoxSpinner from "./CommentBoxSpinner";
import { BasicUtilityContext } from "../context/basicUtilityContext";
import { useLocation } from "react-router-dom";


const DialogContent = ({ post, user, id , postLiked }) => {
    const [isScrollingLeft, setIsSrollingLeft] = useState(false);
    const [isScrollingRight, setIsSrollingRight] = useState(false);
    const [comment, setComment] = useState("");
    const imgArr = post.postImage;
    const [imgIndex, setImgIndex] = useState(0);
    const [allComments, setAllComments] = useState([]);
    const {loading , setLoading} = useContext(BasicUtilityContext) ; 
    const location = useLocation() ; 
    const isUserPage = location.pathname.includes("user-profile") ; 
    const [isLiked , setIsLiked] = useState(postLiked);
    const likePost =  async() => {
        try{
            const res = await axios.post(`${basicURL}/create/like/${post.id}/${id}`, {});
            const {isLiked}  = res.data; 
            setIsLiked(isLiked) ; 
        }catch(err){
            toast.error("Something went wrong !!") ; 
        }
    }

    const getAllComments = async () => {
        try {
            const res = await axios.get(`${basicURL}/fetch/comments/${post.id}`, {});
            const { fetchedComments, commentsFetched, msg } = res.data;
            if (commentsFetched) {
                setAllComments(fetchedComments);
            } else {
                toast.error(msg);
            }

        } catch (error) {
            toast.error("Comments fialed to load")
        }
    }

    useEffect(() => {
        getAllComments();
        console.log(user) ; 
        console.log(id) ; 
    }, []);

    const createCommentHandler = async () => {
        try {
            if(comment === "") return  toast.error("Create Comment first !!") ; 

            const res = await axios.post(`${basicURL}/create/comment/${post.id}/${id}`, { comment: comment });
            const { createdComment, commentCreated, msg } = res.data;
            if (commentCreated) {
                setAllComments(prev => {
                    let arr =  [...prev , createdComment] ; 
                    let final = arr.reverse() ; 
                    return final ; 
                });
                toast.success(msg);
            }
            else {
                toast.error(msg);
            }
        } catch (err) {
            toast.error("Something went wrong !!")
        }
    }
    const commentHandler = (event) => {
        console.log(event.target.value);
        setComment(event.target.value);
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
    const deletePostHandler = async () => {
        try {
            const res = await axios.post(`${basicURL}/update/delete/post/${post?.id}/${user?.id}`);
            console.log(res?.data?.done) ; 
            if(res?.data?.done){
                toast.success("Post Deleted !!") ; 
                window.location.reload();
            }
        } catch (err) {
            toast.error("Something went wrong !!");
        }
    }
    return (
        <div className="w-[100%] h-[100%] flex flex-row relative">
            <div className={`w-[600px] h-[100%] bg-[black] border-r-[#adb5bd] relative ${isScrollingLeft ? "duration-500 transform-all " : (isScrollingRight ? "duration-500 transform-all " : "")}`}>
                <img src={post.postImage[imgIndex]} className="h-[100%] w-[100%] object-contain" />
                {(imgIndex > 0 && imgIndex <= imgArr.length - 1) && <div className="w-[10px] h-[10px] absolute left-2 top-[300px] cursor-pointer text-white" onClick={rightMoveHandler}>
                    <FaCircleChevronLeft />
                </div>}
                {(imgIndex >= 0 && imgIndex < imgArr.length - 1) && <div className="w-[10px] h-[10px] absolute right-3 top-[300px] cursor-pointer text-white" onClick={leftMoveHandler}>
                    <FaChevronCircleRight />
                </div>}
                {(imgArr.length > 1) && <div className="absolute top-[590px] w-[600px] flex justify-center items-center text-[14px] font-[800]">
                    <div className="flex flex-row ">
                        {imgArr.map((img, index) => {
                            if (index === imgIndex) {
                                return <div><GoDotFill className="text-[white]" /></div>
                            }
                            return <div><GoDotFill className="text-slate-400" /></div>
                        })}
                    </div>
                </div>}
            </div>
            <div className="w-[400px] h-[100%px] bg-[#333533] text-[white] pt-[10px]">
                <div className="w-[100%] h-[60px] flex flex-row items-center pl-[15px] border-b-[#6c757d] border-b-[0.2px] justify-between">
                    <div className="flex flex-row h-[100%] items-center">
                        <div className="w-[50px] h-[50px] rounded-[50px] overflow-hidden bg-black">
                            <img src={user?.avatar ? user?.avatar : profile} className="w-[100%] h-[100%] object-cover"></img>
                        </div>
                        <div className="text-[white] text-[18px] font-[600] font-[sans-serif] ml-[20px] h-[100%] flex flex-col mt-[10px]">
                            <span>{user?.name}</span>
                            <span className="text-[12px] font-[300]">{post?.date}</span>
                        </div>
                    </div>
                    <div className="text-[24px] text-white font-[900] cursor-pointer transition transform duration-500 hover:text-[#adb5bd] mr-[10px] h-[100%]">
                        {(isUserPage && user?.id === id) && <MdDelete onClick={deletePostHandler} />}
                    </div>
                </div>
                <div className="w-[100%] h-[50px] flex flex-row justify-start items-center mt-[10px] pl-[15px]">
                    <div className="h-[40px] w-[40px] rounded-[40px] bg-black overflow-hidden ml-[5px]">
                        <img className="h-[100%] w-[100%] object-cover" src={user?.avatar ? user?.avatar : profile}></img>
                    </div>
                    <div className="text-[white] w-[80%] font-[sans-serif] ml-[20px] h-[100%] flex flex-col mt-[10px]">
                        <span className="text-[14px] font-[600]">{user?.name} <span className=" ml-[5px] font-[400]">{post?.description}</span></span>
                        <span className="text-[10px] font-[300] text-[#adb5bd]">{post?.relativeTime}</span>
                    </div>
                </div>
                <div className="h-[360px] w-[100%] border-b-[#6c757d] border-b-[0.2px] overflow-auto moveable-highlights-section">
                    {loading ? <CommentBoxSpinner/> : allComments.map((item, key) => (
                        <div key={key} className="w-[100%] h-[50px] flex flex-row justify-start items-center mt-[10px] pl-[15px]">
                            <div className="h-[30px] w-[30px] rounded-[40px] bg-black overflow-hidden ml-[5px]">
                                <NavLink to={`/user-profile/${item?.userInfo?.userID}`}><img className="h-[100%] w-[100%] object-cover" src={item?.userInfo?.avatar ? item?.userInfo?.avatar : profile}></img></NavLink>
                            </div>
                            <div className="text-[white]  font-[sans-serif] ml-[20px] h-[100%] flex flex-col mt-[10px]">
                                <span className="text-[14px] font-[600]">{item?.userInfo?.username} <span className=" ml-[5px] font-[400]">{item?.content}</span></span>
                                <span className="text-[10px] font-[300] text-[#adb5bd]">{item?.relativeTime}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-[100%] h-[50px] pl-[15px] flex flex-row justify-between items-center">
                    <div className="flex flex-row h-[100%] gap-[20px] items-center">
                        {!isLiked ? <FaRegHeart onClick={likePost} className="cursor-pointer text-[30px]"/> : <FaHeart onClick={likePost} className="cursor-pointer text-red-700 heart-animation text-[30px]"/> }
                        <FaRegComments className="text-[32px] font-[200] cursor-pointer text-white" />
                    </div>
                    <div className="mr-[10px]">
                        <FaRegBookmark className="text-[28px] font-[200] text-white" />
                    </div>
                </div>
                <div className="pl-[15px] text-[12px] text-[#adb5bd] mt-[-5px]">
                    {post.date}
                </div>
                <div className="h-[50px] w-[100%] pd-[2px] relative">
                    <input name="comment" value={comment} onChange={commentHandler} placeholder="Add a comment..." type="text" className="h-[50px] pl-[15px] w-[100%] outline-none bg-transparent text-white"></input>
                    <IoIosAdd onClick={createCommentHandler} className="absolute bottom-[5px] right-[1px] text-[48px] cursor-pointer transition transform duration-500 hover:text-[#e500a4] hover:rotate-180" />
                </div>

            </div>
        </div>)
}
export default DialogContent; 