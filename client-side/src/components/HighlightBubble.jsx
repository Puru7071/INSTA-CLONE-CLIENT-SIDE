import { Dialog } from "@mui/material";
import React from "react";
import { useState } from "react";
import { FaCircleChevronLeft } from "react-icons/fa6";
import { FaChevronCircleRight } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { IoMdClose } from "react-icons/io";

const HighlightBubble = ({ highlight }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [imgArr, setImgArr] = useState(highlight.images);
    const [imgIndex, setImgIndex] = useState(0);
    const openDialogBox = () => {
        setImgIndex(0) ; 
        setOpenDialog(prev => !prev);
    }
    
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

    return (
        <div>
            <div onClick={openDialogBox} className="relative cursor-pointer h-[90px] w-[90px] rounded-[90px] border-[1.8px] border-[#282828] flex flex-col justify-center items-center">
                <div className="h-[85px] w-[85px] rounded-[80px] flex justify-center items-center overflow-hidden">
                    <img src={highlight.images[0].url} alt="highlight" className="h-[100%] w-[100%] object-contain" />
                </div>
                <div className="absolute bottom-[-24px] font-[sans-serif] text-[14px] font-[600]">
                    {highlight.name}
                </div>
            </div>
            <Dialog open={openDialog} BackdropProps={{
                classes: {
                    root: 'backdrop-filter backdrop-blur-sm backdrop-bg-opacity-80'
                }
            }}>

                <div className="w-[400px] h-[600px] bg-[black] relative">
                    <div className="w-[100%] h-[60px] pt-[10px] pl-[0px] flex flex-row items-center">
                        <div >
                            <div className="font-[500] text-[20px] font-[sans-serif] text-white ml-[30px] flex flex-row gap-[20px]"><div className="uppercase">{highlight?.name}</div>  Created {highlight.highlightRelativeTime} </div>
                            <div className="text-[#495057] ml-[30px] text-[12px] mt-[-5px]">Story create {highlight?.images?.[imgIndex]?.relativeTime}</div>
                        </div>
                    </div>
                    <div className="w-[400px] h-[540px]">
                        <img className="h-[100%] w-[100%] object-contain" src={highlight?.images?.[imgIndex].url}></img>
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
                    <IoMdClose onClick={openDialogBox} className="absolute top-2 right-3 text-[34px] text-white font-[900] cursor-pointer transition transform duration-500 hover:text-[#adb5bd]" />

                </div>

            </Dialog>
        </div>
    )
}
export default HighlightBubble; 