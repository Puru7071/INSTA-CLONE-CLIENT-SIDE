import React, { useContext, useEffect } from "react";
import { useState } from "react";
import AsideLeft from "../components/AsideLeft";
import { BasicUtilityContext } from "../context/basicUtilityContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { basicURL } from "../data/basicURL.js";
import { FaInstagram } from "react-icons/fa";
import { IoMdPhotos } from "react-icons/io";
import { IoAddOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { Dialog } from "@mui/material";
import { IoMdClose } from "react-icons/io";

const CreatePostPage = () => {
    const [userId, setUserID] = useState();
    const { authChecker } = useContext(BasicUtilityContext);
    const navigate = useNavigate();

    const [images, setImages] = useState([]);
    const [bio, setBio] = useState("");
    const [story, setStory] = useState(null);
    const [storyPreview, setStoryPreview] = useState("");
    const [storyPreviewDialog, setStoryPreviewDialog] = useState(false);

    const handleImgChange = (event) => {
        const selectedImages = Array.from(event.target.files);
        if (selectedImages.length > 0) toast.success("Action done , add a caption !!")
        setImages(selectedImages);
    }
    const handleBioChange = (event) => {
        setBio(event.target.value);
    }
    const handleCreateStory = async () => {
        const formData = new FormData();
        formData.append('story', story);
        try {
            const res = await axios.post(`${basicURL}/create/story/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const {isCreated, msg} = res.data ; 
            if(isCreated){
                toast.success(msg) ;
                setStoryPreviewDialog(false) ; 
                return ; 
            }
            else{
                toast.error(msg) ; 
                return ; 
            }
        } catch (error) {
            toast.error("Something went wrong !!");
        }
    }
    const handleUpload = async () => {
        const formData = new FormData();
        if (bio === "") {
            toast.error("Add a Caption !!");
            return;
        }
        formData.append("bio", bio);
        images.forEach((image) => {
            formData.append("images", image);
        })

        try {
            const response = await axios.post(`${basicURL}/create/post?id=${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const { isPostCreated, msg } = response.data;
            if (isPostCreated) {
                toast.success(msg);
            }
            else {
                toast.error(msg);
            }

        } catch (err) {
            toast.error("Something went wrong!!");
        }
    }
    const discardStory = () => {
        setStoryPreviewDialog(false);
        setStoryPreview("");
        setStory(null);
        toast.success("Story Discarded")
    }

    const handleStoryChange = (event) => {
        const selectedImages = Array.from(event.target.files);
        if (selectedImages.length === 0) {
            toast.error("Please select a image !!");
            return;
        }
        if (selectedImages.length > 1) {
            toast.error("Only one image at a time !!");
            return;
        }
        const imageURL = URL.createObjectURL(event.target.files[0]);
        toast.success("Click Preview.")
        setStoryPreview(imageURL);
        setStory(selectedImages[0]);
    }

    const storyPreviewHandler = () => {
        if (storyPreview === "") {
            toast.error("Please select a image !!");
            return;
        }
        setStoryPreviewDialog(!storyPreviewDialog);
    }

    useEffect(() => {
        async function callAPI() {
            const { isAuth, userID } = await authChecker();
            if (!isAuth) {
                navigate("/");
            }
            setUserID(userID)
        }
        callAPI();
    }, []);

    return (<div className="text-white font-[sans-serif]">
        <AsideLeft userID={userId} />
        <div className=" mt-[20px]  ml-[20vw] w-[53vw] h-[100vh] pl-[100px]">
            <div className="w-[95]% h-[500px] ">
                <div className="h-[100px] flex flex-row justify-start items-center gap-[10px] mb-[50px]">
                    <div>
                        <FaInstagram className="text-[64px] text-[#e500a4]" />
                    </div>
                    <div className="h-[100%] flex flex-col justify-center">
                        <h1 className="text-[#a8a8a8] text-[32px] font-[sans-serif] font-[600]">Create Post</h1>
                        <div className="text-[#a8a8a8] text-[14px] font-[400] mt-[-5px]">Each post is a chance to ✨ connect, 💬 share, and 🌟 inspire. Through our words and images.</div>
                    </div>
                </div>
                <div className="flex flex-row w-[100%] ">
                    <div className="flex flex-col gap-[30px] w-[100%] items-start">
                        <label htmlFor="fileInput" className="gap-[20px] cursor-pointer flex flex-row h-[20px] justify-start items-center text-[24px] font-[500] text-[#a8a8a8] font-[sans-serif]">Add your memories <IoMdPhotos className="text-[white] text-[26px]" /> </label>
                        {images.length > 0 && <div className="text-[16px] mt-[-20px] text-[#0077b6]"> {images.length} {images.length == 1 ? "memory" : "memories"} added</div>}
                        <input id="fileInput" type="file" multiple onChange={handleImgChange} hidden />
                        <textarea required value={bio} onChange={handleBioChange} className="h-[150px] w-[100%] bg-transparent border-b-[2px] border-b-[#262626] font-[sans-serif] text-[white] font-[500] outline-none focus:text-[16px] focus:font-[400] focus:border-[#e500a4]" />
                        <button onClick={handleUpload} className="mb-[20px] px-[40px] py-[5px] border-[4px] rounded-[5px]  font-[sans-serif] font-[600] transition transform duration-200 border-[#0077b6] text-[white] bg-[#0077b6]">Submit</button>
                    </div>
                </div>
            </div>
            <div className="w-[95]% h-[500px] ">
                <div className="h-[100px] flex flex-row justify-start items-center gap-[10px] mb-[50px]">
                    <div>
                        <FaInstagram className="text-[64px] text-[#e500a4]" />
                    </div>
                    <div className="h-[100%] flex flex-col justify-center">
                        <h1 className="text-[#a8a8a8] text-[32px] font-[sans-serif] font-[600]">Create Story</h1>
                        <div className="text-[#a8a8a8] text-[14px] font-[400] mt-[-5px]">Stories: where moments become memories, and memories become magic ✨</div>
                    </div>
                </div>
                <div className="flex flex-row w-[100%] ">
                    <div className="flex flex-col gap-[50px] w-[100%] items-start">
                        <label htmlFor="storyInput" className=" cursor-pointer gap-[20px] flex flex-row h-[20px] justify-start items-center text-[24px] font-[500] text-[#a8a8a8] font-[sans-serif]">Make a story<IoMdPhotos className="text-[white] text-[26px]" /> </label>
                        <input id="storyInput" type="file" onChange={handleStoryChange} hidden />
                        <button onClick={storyPreviewHandler} className="mb-[20px] px-[40px] py-[5px] border-[4px] rounded-[5px]  font-[sans-serif] font-[600] transition transform duration-200 border-[#0077b6] text-[white] bg-[#0077b6]">Preview</button>
                    </div>
                </div>
            </div>
        </div>
        <Dialog open={storyPreviewDialog}>
            <div className="w-[400px] h-[600px] bg-[#212529]">
                <img src={storyPreview} className="h-[100%] w-[100%] object-contain" />
            </div>
            <div className="absolute top-[0] h-[40px] w-[100%]  flex flex-row justify-between items-center px-[10px]">
                <div className="h-[100%] flex flex-row items-center gap-[20px]">
                    <IoAddOutline onClick={handleCreateStory} className="text-[34px] text-white font-[900] cursor-pointer transition transform duration-500 hover:text-[#e500a4] hover:rotate-180" />
                    <MdDelete onClick={discardStory} className="text-[34px] text-white font-[900] cursor-pointer transition transform duration-500 hover:text-[#adb5bd]" />
                </div>
                <IoMdClose onClick={storyPreviewHandler} className="text-[34px] text-white font-[900] cursor-pointer transition transform duration-500 hover:text-[#adb5bd]" />
            </div>
        </Dialog>

    </div>)
}

export default CreatePostPage;



{/* <div className="flex flex-col">
                    <div className="h-[100px] flex flex-row justify-start items-center gap-[10px] mb-[2px]">
                        <div>
                            <GiBlackBook className="text-[48px] text-[#a8a8a8]" />
                        </div>
                        <div className="h-[100%] flex flex-col justify-center">
                            <h1 className="text-[#a8a8a8] text-[24px] font-[sans-serif] font-[600]">Community Guidelines</h1>
                            <div className="text-[#a8a8a8] text-[12px] font-[400] mt-[-3px]">Our shared commitment to respect, safety, and inclusivity online.</div>
                        </div>
                    </div>
                    {communityGuidelines.map(guideline => (
                        <li className="text-[#a8a8a8] font-[400] text-[14px] mb-[2px]">
                            <span className="font-[600]">{guideline.title} : </span>
                            <span>{guideline.content}</span>
                        </li>
                    ))}
                </div> */}