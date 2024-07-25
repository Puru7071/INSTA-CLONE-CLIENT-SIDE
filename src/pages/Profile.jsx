import React from "react";
import AsideLeft from "../components/AsideLeft";
import { useState, useContext, useEffect } from "react";
import { Await, useLocation, useNavigate } from "react-router-dom";
import { BasicUtilityContext } from "../context/basicUtilityContext";
import { MdEdit } from "react-icons/md";
import { LiaUserEditSolid } from "react-icons/lia";
import { FaCircleChevronLeft } from "react-icons/fa6";
import { FaChevronCircleRight } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import toast from "react-hot-toast";
import axios from "axios";
import { basicURL } from "../data/basicURL";
import { GoDotFill } from "react-icons/go";
import PostsImageTiles from "../components/PostsImageTiles";
import profile from "../assets/profile.jpeg";
import { Dialog } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import AddHighlight from "../components/AddHighlight";
import Spinner from "../components/Spinner";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FcLikePlaceholder } from "react-icons/fc";
import { FcLike } from "react-icons/fc";
import { CiLock } from "react-icons/ci";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IoIosLogOut } from "react-icons/io";
import Switch from '@mui/material/Switch';
import { MdPhotoSizeSelectActual } from "react-icons/md";



const Profile = () => {
    const [userId, setUserID] = useState();
    const [bio, setBio] = useState("");
    const [image, setImage] = useState(null);
    const [profileImg, setProfileImg] = useState("");
    const [editBtnClicked, setIsEditBtnClicked] = useState(false);
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [storyDialogBox, setStoryDialogBox] = useState(false);
    const [stories, setStories] = useState([]);
    const [activeStories, setActiveStories] = useState([]);
    const [imgArr, setImgArr] = useState([]);
    const [imgIndex, setImgIndex] = useState(0);
    const [likedStories, setLikedStories] = useState([]);
    const [isPrivate, setIsPrivate] = useState(false);

    const { loading, setLoading } = useContext(BasicUtilityContext);

    const leftMoveHandler = () => {
        setTimeout(() => {
            const i = imgIndex;
            setImgIndex(i + 1)
        }, 80)
    }
    const rightMoveHandler = () => {
        setTimeout(() => {
            const i = imgIndex;
            setImgIndex(i - 1)
        }, 80)
    }


    const { authChecker } = useContext(BasicUtilityContext);
    const location = useLocation();
    const id = location.pathname.split("/").at(-1);
    const navigate = useNavigate();

    async function callAPI() {
        setLoading(true);
        const { isAuth, userID } = await authChecker();
        if (!isAuth) {
            navigate("/");
        }
        setUserID(userID)
    }
    async function callUserDetailsAPI() {
        const res = await axios.get(`${basicURL}/fetch/profile/${id}`, {});
        const { posts, userInfo, allStories, activeStories } = res.data;
        setBio(userInfo.bio);
        setProfileImg(userInfo.avatar);
        setPosts(posts);
        setUser(userInfo);
        setStories(allStories);
        setActiveStories(activeStories);
        setImgArr(activeStories);
        setLoading(false);
        setIsPrivate(userInfo?.isPrivate)
    }

    useEffect(() => {
        let likedArr = [];
        activeStories.forEach(item => {
            const { likes, id } = item;
            if (likes?.includes(userId)) likedArr?.push(id);
        })
        setLikedStories(likedArr);
    }, [activeStories])
    useEffect(() => {
        callAPI();
        callUserDetailsAPI();
    }, [id]);

    const editBtnHandler = () => {
        const val = editBtnClicked;
        setIsEditBtnClicked(!val);
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const imageUrl = URL.createObjectURL(file);
                toast.success("Please save your changes !!");
                setProfileImg(imageUrl);
                setImage(file);
            } catch (error) {
                toast.error("Error creating object URL:", error);
            }
        } else {
            // Handle case when no file is selected
            toast.error("No file selected.");
        }
    }

    const handleBioChange = (event) => {
        setBio(event.target.value);
    }

    const saveHandler = async (event) => {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('bio', bio);

        try {
            const res = await axios.post(`${basicURL}/update/profile/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const { profileUpdate, msg, updUrl, updBio } = res.data;
            if (profileUpdate) {
                setProfileImg(updUrl);
                setBio(updBio);
                setIsEditBtnClicked(false);
                setUser((prevUser) => ({
                    ...prevUser,
                    avatar: updUrl,
                    bio: updBio
                }));
                toast.success(msg);
            }
            else {
                toast.error(msg);
            }
        } catch (error) {
            toast.error("Something went wrong !!");
        }
    }

    const discardHandler = (event) => {
        console.log(event.target.files);
        setBio(user.bio);
        setImage(null)
        setProfileImg(user.avatar);
        setIsEditBtnClicked(false)
    }
    const viewStoriesHandler = () => {
        debugger ; 
        if (activeStories.length === 0) return;
        setStoryDialogBox(!storyDialogBox);
    }
    const toggleStoryLike = async (storyId) => {
        try {
            console.log(userId);
            const res = axios.post(`${basicURL}/create/story/like/${storyId}/${userId}`);
        } catch (err) {

        }
    }
    const likeHandler = () => {
        const curStoryId = activeStories?.[imgIndex]?.id;
        setLikedStories(prev => {
            if (!prev || !Array.isArray(prev)) {
                prev = [];
            }
            if (!prev.includes(curStoryId)) {
                return [...prev, curStoryId];
            } else {
                return prev.filter(item => item !== curStoryId);
            }
        });
        setActiveStories(prev => {
            let arr = prev;
            if (arr?.[imgIndex]?.likes?.includes(userId)) {
                arr[imgIndex].likes = arr?.[imgIndex]?.likes?.filter(like => like !== userId);
            } else {
                arr?.[imgIndex]?.likes?.push(userId);
            }
            return arr;
        })
        toggleStoryLike(curStoryId);
    }
    const followHandler = async () => {
        try {
            const res = await axios.post(`${basicURL}/create/follower/${id}/${userId}`, {});
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
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const accountPrivacyHandler = async (event) => {
        const newPrivacyStatus = event.target.checked;
        setIsPrivate(newPrivacyStatus); // Update state immediately
        try {
            const res = await axios.post(`${basicURL}/update/privacy/${id}/${newPrivacyStatus}`);
            if (!res?.data?.done) {
                setIsPrivate(!newPrivacyStatus); // Revert state if API call fails
            }
        } catch (error) {
            setIsPrivate(!newPrivacyStatus); // Revert state if API call fails
            console.error('Failed to update privacy status:', error);
        }
    };

    const removeToken = () => {
        localStorage.removeItem('login');
        toast.success("Logout Successful !!")
        navigate("/");
    };

    return (<div>
        {loading ? <Spinner /> : (<div>
            <AsideLeft userID={userId} />

            <div className="ml-[20vw] w-[80vw] h-[100vw] text-white font-[sans-serif] mt-[20px]">
                <div className="w-[100%] h-[220px] bg-[black] flex flex-row justify-center items-center gap-[100px] ">
                    <div className="h-[200px] w-[200px] relative">
                        <div onClick={viewStoriesHandler} className={activeStories.length === 0 || (userId !== id && isPrivate && !user?.followers?.includes(userId)) ? "h-[100%] w-[100%] overflow-hidden rounded-[200px] flex justify-center items-center" : "h-[100%] w-[100%] overflow-hidden rounded-[200px] cursor-pointer border-[3px] border-[#e500a4]"}>
                            {!!(profileImg) && <img className="h-[100%] w-[100%] object-cover" src={profileImg} />}
                            {!(!!profileImg) && <img className="h-[100%] w-[100%] object-cover" src={profile} />}
                        </div>
                        <div className={`h-[40px] w-[40px] rounded-[20px] absolute bottom-0 right-[-10px] bg-[rgba(255,255,255,0.1)] ${editBtnClicked ? "flex justify-center items-center" : "hidden"}`}>
                            <label htmlFor="fileInput" className="h-[100%] w-[100%] cursor-pointer flex justify-center items-center"><LiaUserEditSolid className="text-[24px] text-[#0496ff]" /></label>
                            <input id="fileInput" type="file" hidden={true} onChange={handleFileChange} />
                        </div>
                    </div>
                    <div className="w-[35%] h-[100%] flex flex-col items-start justify-around">
                        <div className="w-[100%] h-[auto] text-[20px] font-[400]  flex flex-row justify-between items-center">
                            <div className="flex flex-row h-[100%] gap-[15px]">
                                <h1 className="font-[600] text-[20px] font-[sans-serif]">{user?.name}</h1>
                                {!editBtnClicked && userId === id && <button onClick={editBtnHandler} className="py-[1px] font-[600] text-[14px] rounded-[5px] px-[10px] bg-[rgb(54,54,54)]">Edit profile</button>}
                                {editBtnClicked && <button onClick={saveHandler} className="py-[1px] font-[600] text-[14px] rounded-[5px] px-[10px] bg-[rgb(54,54,54)]">Save Changes</button>}
                                {editBtnClicked && <button onClick={discardHandler} className="py-[1px] font-[600] text-[14px] rounded-[5px] px-[10px] bg-[rgb(54,54,54)]">Discard</button>}
                                {userId !== id && !user?.followers?.includes(userId) && <button onClick={followHandler} className="bg-[#0095f6] py-[1px] font-[600] text-[14px] rounded-[5px] px-[10px] text-white">Follow</button>}
                                {userId !== id && user?.followers?.includes(userId) && <button className="py-[1px] font-[600] text-[14px] rounded-[5px] px-[10px] text-white bg-[rgb(54,54,54)]">Following</button>}
                            </div>

                            <div>
                                {/* Step 5: Render the button and menu */}
                                {userId === id && <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} variant="contained" sx={{
                                    background: 'none',
                                    boxShadow: 'none',
                                    padding: 0,
                                    minWidth: 0,
                                    '&:hover': {
                                        background: 'none',
                                        boxShadow: 'none'
                                    }
                                }}>
                                    <IoIosMore className="text-[24px]" />
                                </Button>}
                                <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose} sx={{
                                    '& .MuiPaper-root': {
                                        backgroundColor: '#343a40',
                                        color: 'white',
                                    },
                                }}>

                                    <MenuItem><Switch checked={isPrivate} onChange={accountPrivacyHandler} /><label id="label-of-private">Private Account</label> </MenuItem>
                                    <MenuItem><div onClick={removeToken} className="w-[100%] flex flex-row justify-around"><IoIosLogOut className="text-[32px]" /><div className="relative left-[-20px] top-[3px]">Logout</div></div></MenuItem>

                                </Menu>
                            </div>
                        </div>
                        <div className="w-[100%] h-[20px] font-[sans-serif] flex flex-row justify-start items-center gap-[40px]">
                            <span className="font-[600] text-[16px]"> {posts?.length} <span className="font-[400]">posts</span></span>
                            <span className="font-[600] text-[16px]">{user?.followers?.length} <span className="font-[400]">followers</span></span>
                            <span className="font-[600] text-[16px]">{user?.following?.length} <span className="font-[400]">followings</span></span>
                        </div>
                        <div className="w-[100%] relative">
                            <textarea value={bio} id="text-area" onChange={handleBioChange} disabled={editBtnClicked ? false : true} className="h-[80px] w-[100%] bg-transparent   font-[sans-serif] text-[white] font-[500] outline-none focus:text-[16px] focus:font-[400] focus:border-[#e500a4] focus:border-b-[2px]" />
                            <label htmlFor="text-area"><MdEdit className={`absolute bottom-10 right-[10px] text-[18px] text-[white] cursor-pointer ${editBtnClicked ? "" : "hidden"}`} /></label>
                        </div>
                    </div>
                </div>

                <div className="h-[auto] w-[60vw] flex flex-row item-center justify-start pt-[10px] m-[auto] overflow-x-auto relative moveable-highlights-section">
                    {(user?.followers?.includes(userId) || userId === id || !isPrivate) && <AddHighlight stories={stories} id={id} userId={userId} />}

                </div>

                <div className="mt-[30px]  w-[60vw] m-[auto] border-b-[0.9px] border-b-[#282828] pointer-cursor"></div>
                {(user?.followers?.includes(userId) || userId === id || !isPrivate) && <PostsImageTiles posts={posts} user={user} id={userId} />}
                {(user?.followers?.includes(userId) || userId === id || !isPrivate) && posts?.length === 0 &&
                    <div className="w-[100%] h-[300px] flex flex-row justify-center items-center text-[64px]">
                        <div className="flex flex-row h-[100px] w-[100%] justify-center items-center gap-[20px]">
                            <MdPhotoSizeSelectActual />
                            <div className="h-[100%] flex flex-col justify-center gap-[10px]">
                                <div className="text-[16px]">No Posts Yet</div>
                            </div>
                        </div>
                    </div>}
                {!user?.followers?.includes(userId) && userId !== id && isPrivate &&
                    <div className="w-[100%] h-[300px] flex flex-row justify-center items-center text-[64px]">
                        <div className="flex flex-row h-[100px] w-[100%] justify-center items-center gap-[20px]">
                            <CiLock />
                            <div className="h-[100%] flex flex-col justify-center gap-[10px]">
                                <div className="text-[16px]">This account is private</div>
                                <div className="text-[14px] text-[#a8a8a8]">Follow to see their photos and videos.</div>
                            </div>
                        </div>
                    </div>}
            </div>

            <Dialog open={storyDialogBox && (!isPrivate || user?.followers?.includes(userId) || userId === id)} BackdropProps={{
                classes: {
                    root: 'backdrop-filter backdrop-blur-sm backdrop-bg-opacity-80'
                }
            }}>
                <div className="w-[400px] h-[600px] bg-[black] relative">
                    <div className="w-[100%] h-[60px] pt-[10px] pl-[20px] flex flex-row items-center mb-[5px]">
                        <div className="h-[50px] w-[50px] rounded-[50px] overflow-hidden">
                            <img className="h-[100%] w-[100%] object-cover" src={profileImg}></img>
                        </div>
                        <div >
                            <div className="font-[500] text-[20px] font-[sans-serif] text-white ml-[30px]">{user?.name}</div>
                            <div className="text-[#495057] ml-[30px] text-[12px] mt-[-5px]">{activeStories[imgIndex]?.relativeTime}</div>
                        </div>
                    </div>
                    <div className="w-[400px] h-[480px]">
                        <img className="h-[100%] w-[100%] object-contain" src={imgArr[imgIndex]?.url}></img>
                    </div>
                    {(imgIndex > 0 && imgIndex <= imgArr.length - 1) && <div className="text-white w-[10px] h-[10px] absolute left-2 top-[335px] cursor-pointer" onClick={rightMoveHandler}>
                        <FaCircleChevronLeft />
                    </div>}
                    {(imgIndex >= 0 && imgIndex < imgArr.length - 1) && <div className="text-white w-[10px] h-[10px] absolute right-3 top-[335px] cursor-pointer" onClick={leftMoveHandler}>
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
                        {likedStories?.includes(activeStories?.[imgIndex]?.id) ? <div><FcLikePlaceholder className="heart-going-up-animation absolute text-[12px]" /> <FcLikePlaceholder className="heart-going-up-animation-2 absolute text-[12px]" />  <FcLike className="dark-heart-going-up-animation absolute text-[12px]" /> <FaHeart className="text-red-700 heart-animation" /> </div> : <FaRegHeart />}
                    </div>
                    {userId === id && (<div className="absolute bottom-2 right-4 text-[14px] text-white">
                        <div>{activeStories?.[imgIndex]?.likes?.length} likes</div>
                    </div>)}
                </div>
            </Dialog>
        </div>)}
    </div>)
}

export default Profile; 