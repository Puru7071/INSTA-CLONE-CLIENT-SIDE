import React, { useEffect, useState } from "react";
import Post from "./Post";
import profile from "../assets/profile.jpeg";
import { FaCircleChevronLeft } from "react-icons/fa6";
import { FaChevronCircleRight } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import { Dialog } from "@mui/material";
import toast from "react-hot-toast";
import axios from "axios";
import { basicURL } from "../data/basicURL";
import { useNavigate } from "react-router-dom";
import { MdAddAPhoto } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FcLikePlaceholder } from "react-icons/fc";
import { FcLike } from "react-icons/fc";






const PostStageArea = ({ posts, id, storiesGroupByUser , userAvatar , username }) => {
    const [imgIndex, setImgIndex] = useState(0);
    const [mainIndex, setMainIndex] = useState(0);
    const [imgArr, setImgArr] = useState(storiesGroupByUser?.[0] || []);
    const [storyDialogBox, setStoryDialogBox] = useState(false);
    const [viewedStories, setViewedStories] = useState([]);
    const [likedStories, setLikedStories] = useState([]);
    const navigate = useNavigate() ;

    const leftMoveHandler = () => {
        setTimeout(() => {
            const curViewStoryId = storiesGroupByUser?.[mainIndex]?.[imgIndex]?.storyId;
            if (!viewedStories.includes(curViewStoryId)) {
                setViewedStories(prev => [...prev, curViewStoryId]);
            }
            const i = imgIndex;
            if (i === imgArr.length - 1) {
                if (mainIndex === storiesGroupByUser.length - 1) {
                    setStoryDialogBox(false);
                    setImgArr(storiesGroupByUser?.[0])
                    setMainIndex(0);
                    setImgIndex(0);
                    toast.success("Everything caught up !! ✨")
                } else {
                    setImgArr(storiesGroupByUser?.[mainIndex + 1]);
                    setMainIndex(prev => prev + 1);
                    setImgIndex(0);
                }
            }
            else setImgIndex(i + 1)
        }, 80)
    }
    const makeStoryView = async () => {
        if (viewedStories?.length > 0) {
            try {
                setTimeout(() => {
                    const res = axios.post(`${basicURL}/create/story/view/${viewedStories[viewedStories.length - 1]}/${id}`);
                }, 4000)
            } catch (err) {

            }
        }
    }
    const toggleStoryLike = async(storyId) => {
        try{
            const res = axios.post(`${basicURL}/create/story/like/${storyId}/${id}`) ; 
        }catch(err){

        }
    }
    useEffect(() => {
        makeStoryView();
        console.log(viewedStories);

    }, [viewedStories]);

    useEffect(() => {
        console.log(likedStories)
    } , [likedStories])

    const rightMoveHandler = () => {
        setTimeout(() => {
            const i = imgIndex;
            if (i === 0) {
                if (mainIndex === 0) {
                    setStoryDialogBox(false);
                    setImgArr(storiesGroupByUser?.[0])
                    setMainIndex(0);
                    setImgIndex(0);
                }
                else {
                    setImgArr(storiesGroupByUser?.[mainIndex - 1]);
                    setMainIndex(prev => prev - 1);
                    setImgIndex(storiesGroupByUser?.[mainIndex - 1].length - 1)
                }
            } else setImgIndex(i - 1);
        }, 80)
    }

    const viewStoriesHandler = (index) => {
        if (!storyDialogBox) {
            let arr = [] ; 
            storiesGroupByUser?.forEach(group => {
                group.forEach(story => {
                    if(story?.likes?.includes(id)) arr.push(story?.storyId) ; 
                })
            })
            setLikedStories(arr) ; 
            const curViewStoryId = storiesGroupByUser?.[index]?.[0]?.storyId
            if (!viewedStories.includes(curViewStoryId)) {
                setViewedStories(prev => [...prev, curViewStoryId]);
            }
            console.log(index);
            setMainIndex(index);
            setImgArr(storiesGroupByUser?.[index]);
            setImgIndex(0);
        }
        setStoryDialogBox(prev => !prev);
    }

    const likeHandler = () => {
        const curStoryId = storiesGroupByUser?.[mainIndex]?.[imgIndex]?.storyId ; 
        if(!likedStories.includes(curStoryId)){
            setLikedStories(prev => [...prev , curStoryId]) ; 
            toggleStoryLike(curStoryId) ; 
        }
        else{
            setLikedStories(prev => prev.filter(item => item !== curStoryId)) ;
            toggleStoryLike(curStoryId) ; 
        }
    }

    return (
        <div className="w-[53vw] ml-[20vw]">
            <div className="h-[160px] w-[100%] ml-[40px] mt-[10px] flex flex-row justify-start items-center px-[30px] gap-[20px] overflow-y-auto moveable-highlights-section relative">
                <div className="flex flex-col h-[100%] justify-center items-center relative cursor-pointer"onClick={() => navigate("/create-post")}>
                    <div className="h-[80px] w-[80px] border-[2px] border-[#e9c46a] rounded-[60px] overflow-hidden shadow-2xl shadow-[#e9c46a]">
                        <img className="w-[100%] h-[100%] object-cover" src={!!(userAvatar) ? userAvatar : profile}></img>
                    </div>
                    <div className="text-[14px] text-[#bfc0c0] mt-2">
                        Your Story
                    </div>
                    <div className="bg-[#283618] absolute bottom-14 right-[2px] rounded-[50px]">
                        <MdAddAPhoto className="text-[white] text-[18px] "/>
                    </div>
                </div>
                {storiesGroupByUser.map((story, index) => (
                    (story?.[0]?.followers?.includes(id) || id === story?.[0]?.userId) &&
                    <div className="flex flex-col h-[100%] justify-center items-center cursor-pointer" key={index} onClick={() => viewStoriesHandler(index)}>
                        <div className="h-[80px] w-[80px] border-[2px] border-[#e500a4] rounded-[60px] overflow-hidden">
                            <img className="w-[100%] h-[100%] object-cover" src={!!(story?.[0]?.userAvatar) ? story[0].userAvatar : profile}></img>
                        </div>
                        <div className="text-[14px] text-[#bfc0c0]">
                            {story[0].username.substr(0, 10)}
                        </div>
                    </div>
                ))}
            </div>
            <Dialog open={storyDialogBox} BackdropProps={{
                classes: {
                    root: 'backdrop-filter backdrop-blur-sm backdrop-bg-opacity-80'
                }
            }}>
                <div className="w-[400px] h-[620px] bg-[black] relative">
                    <div className="w-[100%] h-[60px] pt-[10px] pl-[20px] flex flex-row items-center">
                        <div className="h-[50px] w-[50px] rounded-[50px] overflow-hidden">
                            <img src={!!(imgArr?.[imgIndex]?.userAvatar) ? imgArr?.[imgIndex]?.userAvatar : profile}></img>
                        </div>
                        <div >
                            <div className="font-[500] text-[20px] font-[sans-serif] text-white ml-[30px]">{imgArr?.[imgIndex]?.username}</div>
                            <div className="text-[#495057] ml-[30px] text-[12px] mt-[-5px]">{imgArr?.[imgIndex]?.relativeTime}</div>
                        </div>
                    </div>
                    <div className="w-[400px] h-[500px]">
                        <img className="h-[100%] w-[100%] object-contain" src={imgArr[imgIndex]?.story}></img>
                    </div>
                    {<div className="text-white w-[10px] h-[10px] absolute left-2 top-[310px] cursor-pointer" onClick={rightMoveHandler}>
                        <FaCircleChevronLeft />
                    </div>}
                    {<div className="text-white w-[10px] h-[10px] absolute right-3 top-[310px] cursor-pointer" onClick={leftMoveHandler}>
                        <FaChevronCircleRight />
                    </div>}

                    <div className="absolute bottom-1 w-[400px] flex justify-center items-center text-[14px] font-[800]">
                        <div className="flex flex-row ">
                            {imgArr.map((img, index) => {
                                if (index === imgIndex) {
                                    return <div><GoDotFill className="text-[white]" /></div>
                                }
                                return <div><GoDotFill className="text-slate-400" /></div>
                            })}
                        </div>
                    </div>
                    <IoMdClose onClick={viewStoriesHandler} className="absolute top-2 right-3 text-[34px] text-white font-[900] cursor-pointer transition transform duration-500 hover:text-[#adb5bd]" />
                    <div className="absolute bottom-2 left-7 cursor-pointer text-[32px] text-white" onClick={likeHandler}>
                        {likedStories.includes(storiesGroupByUser?.[mainIndex]?.[imgIndex]?.storyId) ?  <div><FcLikePlaceholder className="heart-going-up-animation absolute text-[12px]"/> <FcLikePlaceholder className="heart-going-up-animation-2 absolute text-[12px]"/>  <FcLike className="dark-heart-going-up-animation absolute text-[12px]"/> <FaHeart className="text-red-700 heart-animation"/> </div>: <FaRegHeart/>}
                    </div>
                </div>
            </Dialog>
            <div className="w-[53vw] h-[auto] min-h-[110vh] bg-[black] mt-[20px] flex flex-col justify-center items-center text-white font-[sans-serif]">
                {posts?.map((post, index) => ((post?.user?.followers?.includes(id) || id === post?.user?.id || !post?.user?.isPrivate ) && <Post key={index} post={post.post} user={post.user} id={id} />))}
            </div>
        </div>
    )
}

export default PostStageArea; 