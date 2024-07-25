import { Dialog } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoIosAddCircle } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { IoAddOutline } from "react-icons/io5";
import { basicURL } from "../data/basicURL";
import HighlightBubble from "./HighlightBubble";

const AddHighlight = ({ stories, id , userId}) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [highlights , setHighlights] = useState([]) ; 
    const [name , setName] = useState("") ; 

    const [allhighlights , setAllHighlights] = useState([]) ; 
    const getAllHighLights = async() => {
        const res = await axios.get(`${basicURL}/fetch/highlights/${id}` , {}) ; 
        setAllHighlights(res.data.allhighlights) ; 
    }
    useEffect(() => {
        getAllHighLights() ; 
    } , []) ; 

    const openDialogBox = () => {
        if (stories.length === 0) return toast.error("Upload Stories to add Highlights..")
        setOpenDialog(prev => !prev);
        setHighlights([]) ; 
        setName("") ; 
    }
    const checkboxHandler = (event) => {
        if(event.target.checked){
            setHighlights([...highlights , event.target.id])
        }
        else{
            setHighlights(prev => prev.filter(item => event.target.id != item)) ; 
        }
    }
    const nameHandler = (event) => {
        setName(event.target.value) ; 
    }
    const saveHighlights = async () => {
        try{
            if(name === "") return toast.error("Please Name your highlight !!") ; 
            if(highlights.length === 0 ) return toast.error("Please select atleast one story !!")
            const data = {
                name , 
                highlights
            }
            const res = await axios.post(`${basicURL}/create/highlight/${id}` , data) ; 
            const {highlightCreated , msg , highlightNew} = res.data ; 
            if(highlightCreated){
                toast.success("Highlight Created !!") ; 
                setOpenDialog(false) ; 
                setAllHighlights(prev => {
                    return [...prev , highlightNew] ; 
                })
            }else{
                toast.error(msg) ;
            }
        }
        catch(err){
            toast.err("Something went wrong !!")
        }
    }
    return (
        <div className="flex flex-row justify-start items-center h-[150px] w-[100%] gap-[20px] empty:h-[0px]">
            {id === userId && <div onClick={openDialogBox} className="relative cursor-pointer h-[90px] w-[90px] rounded-[90px] border-[1.8px] border-[#282828] flex flex-col justify-center items-center">
                <div className="h-[85px] w-[85px] rounded-[80px] flex justify-center items-center">
                    <IoIosAddCircle className="text-[90px] text-[rgba(255,255,255,0.1)]" />
                </div>
                <div className="absolute bottom-[-24px] font-[sans-serif] text-[14px] font-[600]">
                    New
                </div>
            </div>}
            {allhighlights.map((item , index) => (<HighlightBubble highlight = {item} key = {index}  />))}
            <Dialog open={openDialog} BackdropProps={{
                classes: {
                    root: 'backdrop-filter backdrop-blur-sm backdrop-bg-opacity-80'
                }
            }}>
                <div className="h-[600px] w-[500px] bg-black p-[20px]">
                    <input onChange={nameHandler} placeholder="Add your highlight name ✍🏻" className="mt-[30px] w-[100%] h-[40px] bg-transparent border-b-[2px] border-b-[#262626] font-[sans-serif] text-[white] font-[500] outline-none focus:text-[16px] focus:font-[400] focus:border-[#e500a4]" />
                    <div className="h-[470px] w-[100%] overflow-y-auto">
                        {stories.map((story, index) => (
                            <div key={index} className="flex flex-row relative">
                                <label htmlFor={story?.id} className="mt-[20px] cursor-pointer"  >
                                    <div key={index} className="h-[80px]">
                                        <div className="flex flex-row items-center justify-start gap-[20px]">
                                            <div className="h-[80px] w-[80px] rounded-[80px] overflow-hidden">
                                                <img className="w-[100%] h-[100%] object-cover" src={story?.url} alt={`Story ${index + 1}`} />
                                            </div>
                                            <div className="text-white ml-[30px] font-[600] flex flex-row items-center">
                                                <span className="text-[24px] mr-[20px]">📆</span>
                                                <span>Created on: {story?.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </label>
                                <div className="h-[80px] flex flex-col absolute right-[30px] top-5 items-center justify-center">
                                    <input onChange={checkboxHandler} id={story?.id} type="checkbox" className="w-[20px] h-[20px] cursor-pointer"></input>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <IoAddOutline onClick={saveHighlights} className="absolute top-2 left-4 text-[34px] text-white font-[900] cursor-pointer transition transform duration-500 hover:text-[#e500a4] hover:rotate-180" />
                <IoMdClose onClick={openDialogBox} className="absolute top-2 right-3 text-[34px] text-white font-[900] cursor-pointer transition transform duration-500 hover:text-[#adb5bd]" />
            </Dialog>

        </div>

    )
}

export default AddHighlight; 