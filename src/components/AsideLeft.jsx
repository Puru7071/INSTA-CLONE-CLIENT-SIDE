import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { IoMdSearch } from "react-icons/io";
import { FaRegCompass } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { GoPerson } from "react-icons/go";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaInstagram } from "react-icons/fa6";
import { GoHome } from "react-icons/go";
import { MdCancel } from "react-icons/md";
import axios from "axios";
import { basicURL } from "../data/basicURL";
import profile from "../assets/profile.jpeg";
import toast from "react-hot-toast";
import { IoIosLogOut } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";




const AsideLeft = ({ userID }) => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [closeDrawer, setCloseDrawer] = useState(false);
    const [openDrawer2, setOpenDrawer2] = useState(false);
    const [closeDrawer2, setCloseDrawer2] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [querySearch, setQuerySearch] = useState("");
    const navigate = useNavigate();
    const searchUserHandler = (event) => {
        console.log(event.target.value);
        setQuerySearch(event.target.value);
        if (!event.target.value) {
            setSearchedUsers([]);
            return;
        }
        const filteredUsers = allUsers.filter(user => user?.name?.toLowerCase()?.includes(event.target.value.toLowerCase()));
        setSearchedUsers(filteredUsers);
        console.log(filteredUsers);
    }
    const callFetchUsers = async () => {
        try {
            const res = await axios.get(`${basicURL}/fetch/all-users`, {})
            const { users } = res?.data;
            setAllUsers(users);
        } catch (err) {

        }
    }
    const [notifications, setNotifications] = useState([]);
    const callFetchNotifications = async () => {
        try {
            const res = await axios.get(`${basicURL}/fetch/notifications/${userID}`, {})
            setNotifications(res?.data?.notifications)

        } catch (err) {

        }
    }
    const opneDrawerHandler = () => {
        callFetchUsers()
        setOpenDrawer(true);
        setCloseDrawer(false);
        setCloseDrawer2(false);
        setOpenDrawer2(false);
    }
    const closeDrawerHandler = () => {
        setOpenDrawer(false);
        setCloseDrawer(true);
        setOpenDrawer2(false);
        setCloseDrawer2(false);
        setAllUsers([]);
        setSearchedUsers([]);
    }
    const cancelHandler = () => {
        setSearchedUsers([]);
        setQuerySearch("");
    }
    const opneDrawerHandler2 = () => {
        callFetchNotifications();
        setOpenDrawer2(true);
        setCloseDrawer2(false);
        setCloseDrawer(false);
        setOpenDrawer(false);
    }
    const closeDrawerHandler2 = () => {
        setOpenDrawer2(false);
        setCloseDrawer2(true);
        setCloseDrawer(false);
        setOpenDrawer(false);
    }
    const acceptHandler = async (requestMakerId, id) => {
        try {
            const res = await axios.post(`${basicURL}/create/link/${userID}/${requestMakerId}`);
            if (res?.data?.msg) {
                toast.success("Added a new follower !!");
                setNotifications(prev => prev.filter(p => p?._id != id));
            }
            else {
                toast.error("Something went wrong !!");
            }
        } catch {
            toast.error("Something went wrong !!");
        }
    }
    const removeToken = () => {
        localStorage.removeItem('login');
        toast.success("Logout Successful !!")
        navigate("/");
    };
    return (
        <div>
            <div className="fixed top-[0] left-0 w-[20vw] h-[100vh] font-[sans-serif] text-white bg-[#000000]">
                <div className="relative h-[100%] w-[100%] border-r-[1px] border-[#262626] pt-[20%] pl-[20px]">
                    <div className="logo w-[100%] pl-[20px] mb-[60px]">
                        <svg aria-label="Instagram" className="x1lliihq x1n2onr6 x5n08af" fill="white" height="29" role="img" viewBox="32 4 113 32" width="103"><title>Instagram</title><path clip-rule="evenodd" d="M37.82 4.11c-2.32.97-4.86 3.7-5.66 7.13-1.02 4.34 3.21 6.17 3.56 5.57.4-.7-.76-.94-1-3.2-.3-2.9 1.05-6.16 2.75-7.58.32-.27.3.1.3.78l-.06 14.46c0 3.1-.13 4.07-.36 5.04-.23.98-.6 1.64-.33 1.9.32.28 1.68-.4 2.46-1.5a8.13 8.13 0 0 0 1.33-4.58c.07-2.06.06-5.33.07-7.19 0-1.7.03-6.71-.03-9.72-.02-.74-2.07-1.51-3.03-1.1Zm82.13 14.48a9.42 9.42 0 0 1-.88 3.75c-.85 1.72-2.63 2.25-3.39-.22-.4-1.34-.43-3.59-.13-5.47.3-1.9 1.14-3.35 2.53-3.22 1.38.13 2.02 1.9 1.87 5.16ZM96.8 28.57c-.02 2.67-.44 5.01-1.34 5.7-1.29.96-3 .23-2.65-1.72.31-1.72 1.8-3.48 4-5.64l-.01 1.66Zm-.35-10a10.56 10.56 0 0 1-.88 3.77c-.85 1.72-2.64 2.25-3.39-.22-.5-1.69-.38-3.87-.13-5.25.33-1.78 1.12-3.44 2.53-3.44 1.38 0 2.06 1.5 1.87 5.14Zm-13.41-.02a9.54 9.54 0 0 1-.87 3.8c-.88 1.7-2.63 2.24-3.4-.23-.55-1.77-.36-4.2-.13-5.5.34-1.95 1.2-3.32 2.53-3.2 1.38.14 2.04 1.9 1.87 5.13Zm61.45 1.81c-.33 0-.49.35-.61.93-.44 2.02-.9 2.48-1.5 2.48-.66 0-1.26-1-1.42-3-.12-1.58-.1-4.48.06-7.37.03-.59-.14-1.17-1.73-1.75-.68-.25-1.68-.62-2.17.58a29.65 29.65 0 0 0-2.08 7.14c0 .06-.08.07-.1-.06-.07-.87-.26-2.46-.28-5.79 0-.65-.14-1.2-.86-1.65-.47-.3-1.88-.81-2.4-.2-.43.5-.94 1.87-1.47 3.48l-.74 2.2.01-4.88c0-.5-.34-.67-.45-.7a9.54 9.54 0 0 0-1.8-.37c-.48 0-.6.27-.6.67 0 .05-.08 4.65-.08 7.87v.46c-.27 1.48-1.14 3.49-2.09 3.49s-1.4-.84-1.4-4.68c0-2.24.07-3.21.1-4.83.02-.94.06-1.65.06-1.81-.01-.5-.87-.75-1.27-.85-.4-.09-.76-.13-1.03-.11-.4.02-.67.27-.67.62v.55a3.71 3.71 0 0 0-1.83-1.49c-1.44-.43-2.94-.05-4.07 1.53a9.31 9.31 0 0 0-1.66 4.73c-.16 1.5-.1 3.01.17 4.3-.33 1.44-.96 2.04-1.64 2.04-.99 0-1.7-1.62-1.62-4.4.06-1.84.42-3.13.82-4.99.17-.8.04-1.2-.31-1.6-.32-.37-1-.56-1.99-.33-.7.16-1.7.34-2.6.47 0 0 .05-.21.1-.6.23-2.03-1.98-1.87-2.69-1.22-.42.39-.7.84-.82 1.67-.17 1.3.9 1.91.9 1.91a22.22 22.22 0 0 1-3.4 7.23v-.7c-.01-3.36.03-6 .05-6.95.02-.94.06-1.63.06-1.8 0-.36-.22-.5-.66-.67-.4-.16-.86-.26-1.34-.3-.6-.05-.97.27-.96.65v.52a3.7 3.7 0 0 0-1.84-1.49c-1.44-.43-2.94-.05-4.07 1.53a10.1 10.1 0 0 0-1.66 4.72c-.15 1.57-.13 2.9.09 4.04-.23 1.13-.89 2.3-1.63 2.3-.95 0-1.5-.83-1.5-4.67 0-2.24.07-3.21.1-4.83.02-.94.06-1.65.06-1.81 0-.5-.87-.75-1.27-.85-.42-.1-.79-.13-1.06-.1-.37.02-.63.35-.63.6v.56a3.7 3.7 0 0 0-1.84-1.49c-1.44-.43-2.93-.04-4.07 1.53-.75 1.03-1.35 2.17-1.66 4.7a15.8 15.8 0 0 0-.12 2.04c-.3 1.81-1.61 3.9-2.68 3.9-.63 0-1.23-1.21-1.23-3.8 0-3.45.22-8.36.25-8.83l1.62-.03c.68 0 1.29.01 2.19-.04.45-.02.88-1.64.42-1.84-.21-.09-1.7-.17-2.3-.18-.5-.01-1.88-.11-1.88-.11s.13-3.26.16-3.6c.02-.3-.35-.44-.57-.53a7.77 7.77 0 0 0-1.53-.44c-.76-.15-1.1 0-1.17.64-.1.97-.15 3.82-.15 3.82-.56 0-2.47-.11-3.02-.11-.52 0-1.08 2.22-.36 2.25l3.2.09-.03 6.53v.47c-.53 2.73-2.37 4.2-2.37 4.2.4-1.8-.42-3.15-1.87-4.3-.54-.42-1.6-1.22-2.79-2.1 0 0 .69-.68 1.3-2.04.43-.96.45-2.06-.61-2.3-1.75-.41-3.2.87-3.63 2.25a2.61 2.61 0 0 0 .5 2.66l.15.19c-.4.76-.94 1.78-1.4 2.58-1.27 2.2-2.24 3.95-2.97 3.95-.58 0-.57-1.77-.57-3.43 0-1.43.1-3.58.19-5.8.03-.74-.34-1.16-.96-1.54a4.33 4.33 0 0 0-1.64-.69c-.7 0-2.7.1-4.6 5.57-.23.69-.7 1.94-.7 1.94l.04-6.57c0-.16-.08-.3-.27-.4a4.68 4.68 0 0 0-1.93-.54c-.36 0-.54.17-.54.5l-.07 10.3c0 .78.02 1.69.1 2.09.08.4.2.72.36.91.15.2.33.34.62.4.28.06 1.78.25 1.86-.32.1-.69.1-1.43.89-4.2 1.22-4.31 2.82-6.42 3.58-7.16.13-.14.28-.14.27.07l-.22 5.32c-.2 5.37.78 6.36 2.17 6.36 1.07 0 2.58-1.06 4.2-3.74l2.7-4.5 1.58 1.46c1.28 1.2 1.7 2.36 1.42 3.45-.21.83-1.02 1.7-2.44.86-.42-.25-.6-.44-1.01-.71-.23-.15-.57-.2-.78-.04-.53.4-.84.92-1.01 1.55-.17.61.45.94 1.09 1.22.55.25 1.74.47 2.5.5 2.94.1 5.3-1.42 6.94-5.34.3 3.38 1.55 5.3 3.72 5.3 1.45 0 2.91-1.88 3.55-3.72.18.75.45 1.4.8 1.96 1.68 2.65 4.93 2.07 6.56-.18.5-.69.58-.94.58-.94a3.07 3.07 0 0 0 2.94 2.87c1.1 0 2.23-.52 3.03-2.31.09.2.2.38.3.56 1.68 2.65 4.93 2.07 6.56-.18l.2-.28.05 1.4-1.5 1.37c-2.52 2.3-4.44 4.05-4.58 6.09-.18 2.6 1.93 3.56 3.53 3.69a4.5 4.5 0 0 0 4.04-2.11c.78-1.15 1.3-3.63 1.26-6.08l-.06-3.56a28.55 28.55 0 0 0 5.42-9.44s.93.01 1.92-.05c.32-.02.41.04.35.27-.07.28-1.25 4.84-.17 7.88.74 2.08 2.4 2.75 3.4 2.75 1.15 0 2.26-.87 2.85-2.17l.23.42c1.68 2.65 4.92 2.07 6.56-.18.37-.5.58-.94.58-.94.36 2.2 2.07 2.88 3.05 2.88 1.02 0 2-.42 2.78-2.28.03.82.08 1.49.16 1.7.05.13.34.3.56.37.93.34 1.88.18 2.24.11.24-.05.43-.25.46-.75.07-1.33.03-3.56.43-5.21.67-2.79 1.3-3.87 1.6-4.4.17-.3.36-.35.37-.03.01.64.04 2.52.3 5.05.2 1.86.46 2.96.65 3.3.57 1 1.27 1.05 1.83 1.05.36 0 1.12-.1 1.05-.73-.03-.31.02-2.22.7-4.96.43-1.79 1.15-3.4 1.41-4 .1-.21.15-.04.15 0-.06 1.22-.18 5.25.32 7.46.68 2.98 2.65 3.32 3.34 3.32 1.47 0 2.67-1.12 3.07-4.05.1-.7-.05-1.25-.48-1.25Z" fill="white" fill-rule="evenodd"></path></svg>
                    </div>

                    <div className="nav-opts w-[100%] flex flex-col items-start gap-[25px]">
                        <div className="w-[100%]">
                            <NavLink to="/home" className="flex flex-row w-[90%] pl-[20px] h-[50px] justify-start items-center text-[16px] gap-[20px] font-[600] rounded-[5px] hover:bg-[#212529]">
                                <GoHomeFill className="text-[28px]" /> <span>Home</span>
                            </NavLink>
                        </div>

                        <div className="w-[100%]">
                            <NavLink onClick={opneDrawerHandler} className="flex flex-row w-[90%] pl-[20px] h-[50px] justify-start items-center text-[16px] gap-[20px] font-[600] rounded-[5px] hover:bg-[#212529]">
                                <IoMdSearch className="text-[28px]" /> <span>Search</span>
                            </NavLink>
                        </div>

                        <div className="w-[100%]">
                            <NavLink onClick={opneDrawerHandler2} className="flex flex-row w-[90%] pl-[20px] h-[50px] justify-start items-center text-[16px] gap-[20px] font-[600] rounded-[5px] hover:bg-[#212529]">
                                <FaRegHeart className="text-[28px]" /> <span>Notifications</span>
                            </NavLink>
                        </div>

                        <div className="w-[100%]">
                            <NavLink to="/create-post" className="flex flex-row w-[90%] pl-[20px] h-[50px] justify-start items-center text-[16px] gap-[20px] font-[600] rounded-[5px] hover:bg-[#212529]">
                                <MdOutlineAddCircleOutline className="text-[28px]" /> <span>Create</span>
                            </NavLink>
                        </div>

                        <div className="w-[100%]">
                            <NavLink to={`/user-profile/${userID}`} className="flex flex-row w-[90%] pl-[20px] h-[50px] justify-start items-center text-[16px] gap-[20px] font-[600] rounded-[5px] hover:bg-[#212529]">
                                <GoPerson className="text-[28px]" /> <span>Profile</span>
                            </NavLink>
                        </div>
                    </div>

                    <div onClick={removeToken} className="w-[90%] text-white absolute bottom-[50px] cursor-pointer">
                        <div className="flex flex-row w-[90%] pl-[20px] h-[50px] justify-start items-center text-[16px] gap-[20px] font-[600] rounded-[5px] hover:bg-[#212529]">
                            <IoIosLogOut onClick={removeToken} className="text-[28px]" /> <span>Logout</span>
                        </div>
                    </div>

                </div>
            </div>
            <div className={openDrawer ? `drawer border-r-[1px] border-[#262626] rounded-tr-[20px] rounded-br-[20px] fixed top-0 w-[40vw] h-[100vh] font-[sans-serif] text-white bg-[black] z-20 flex flex-row` : (closeDrawer ? "fixed top-0 close-drawer w-[40vw] h-[100vh] font-[sans-serif] text-white bg-[black] z-20 flex flex-row" : "fixed top-0 left-[-40vw] w-[40vw] h-[100vh] font-[sans-serif] text-white bg-[black] z-20 flex flex-row")}>
                <RxCross2 className="absolute text-white right-4 top-5 text-[32px] cursor-pointer" onClick={closeDrawerHandler} />
                <div className="relative h-[100%] w-[10%]  pt-[15%] pl-[20px] text-[32px]">
                    <div className="logo w-[100%]  mb-[60px]">
                        <NavLink onClick={closeDrawerHandler} className="flex flex-row w-[90%]  h-[50px] justify-center items-center text-[16px] gap-[20px] font-[600] rounded-[5px] ">
                            <FaInstagram className="text-[32px]" />
                        </NavLink>
                    </div>
                    <div className="nav-opts w-[100%] flex flex-col items-start gap-[25px]">
                        <div className="w-[100%]">
                            <NavLink to="/home" className="flex flex-row w-[90%]  h-[50px] justify-center items-center text-[16px] gap-[20px] font-[600] rounded-[5px] ">
                                <GoHome className="text-[32px]" />
                            </NavLink>
                        </div>

                        <div className="w-[100%]">
                            <NavLink onClick={closeDrawerHandler} className="flex flex-row w-[90%]  h-[50px] justify-center items-center text-[16px] gap-[20px] font-[600] rounded-[5px] ">
                                <IoMdSearch className="text-[32px]" />
                            </NavLink>
                        </div>



                        <div className="w-[100%]">
                            <NavLink onClick={opneDrawerHandler2} className="flex flex-row w-[90%]  h-[50px] justify-center items-center text-[16px] gap-[20px] font-[600] rounded-[5px] ">
                                <FaRegHeart className="text-[32px]" />
                            </NavLink>
                        </div>

                        <div className="w-[100%]">
                            <NavLink to="/create-post" className="flex flex-row w-[90%]  h-[50px] justify-center items-center text-[16px] gap-[20px] font-[600] rounded-[5px] ">
                                <MdOutlineAddCircleOutline className="text-[32px]" />
                            </NavLink>
                        </div>

                        <div className="w-[100%]">
                            <NavLink to={`/user-profile/${userID}`} className="flex flex-row w-[90%]  h-[50px] justify-center items-center text-[16px] gap-[20px] font-[600] rounded-[5px] ">
                                <GoPerson className="text-[32px]" />
                            </NavLink>
                        </div>
                    </div>
                    <div onClick={removeToken} className="absolute bottom-[50px] cursor-pointer left-[25px]">
                        <NavLink className="flex flex-row w-[90%]   h-[50px] justify-center items-center text-[16px] gap-[20px] font-[600] rounded-[5px] ">
                            <IoIosLogOut onClick={removeToken} className="text-[32px]" />
                        </NavLink>
                    </div>
                </div>
                <div className="w-[90%] pl-[10px]">
                    <h1 className="text-[28px] pt-[92px] ml-[24px] font-[sans-serif] font-[600] mb-[30px]">
                        Search
                    </h1>
                    <div className="flex flex-row gap-[15px] w-[100%] justify-center h-[60px] mb-[40px] relative">
                        <input value={querySearch} onChange={searchUserHandler} id="search-field" className="border-[none] outline-none w-[93%] h-[50px] mb-[20px] rounded-[10px] bg-[#262626] pl-[20px]"></input>
                        <MdCancel onClick={cancelHandler} className="absolute right-[40px] top-[16px] text-[20px] cursor-pointer" />
                    </div>


                    {searchedUsers?.map(user => (
                        <NavLink to={`/user-profile/${user?.id}`}>
                            <div className="h-[70px] w-[100%] text-teal-50 flex flex-row pl-[20px]">
                                <div className="h-[50px] w-[50px] rounded-[50px] overflow-hidden">
                                    {!!(user?.avatar) ? <img className="h-[100%] w-[100%] object-cover" src={user?.avatar} /> : <img src={profile} />}
                                </div>
                                <div className="h-[100%] flex flex-col ml-[30px] mt-[6px]">
                                    <span className="font-[600] text-[14px] flex flex-row">{user?.name}<span className="flex flex-row gap-[10px] before:content-['◦'] before:ml-[10px] text-[#a8a8a8]">{user?.followers?.length} followers</span></span>
                                    <span className="text-[#a8a8a8] text-[14px] flex flex-row"><span className="">{user?.bio}</span></span>
                                </div>
                            </div>
                        </NavLink>
                    ))}

                </div>
            </div>
            <div className={openDrawer2 ? `drawer border-r-[1px] border-[#262626] rounded-tr-[20px] rounded-br-[20px] fixed top-0 w-[40vw] h-[100vh] font-[sans-serif] text-white bg-[black] z-20 flex flex-row` : (closeDrawer2 ? "fixed top-0 close-drawer w-[40vw] h-[100vh] font-[sans-serif] text-white bg-[black] z-20 flex flex-row" : "fixed top-0 left-[-40vw] w-[40vw] h-[100vh] font-[sans-serif] text-white bg-[black] z-20 flex flex-row")}>
                <RxCross2 className="absolute text-white right-4 top-5 text-[32px] cursor-pointer" onClick={closeDrawerHandler2} />
                <div className="relative h-[100%] w-[10%]  pt-[15%] pl-[20px] text-[32px]">
                    <div className="logo w-[100%]  mb-[60px]">
                        <NavLink onClick={closeDrawerHandler2} className="flex flex-row w-[90%]  h-[50px] justify-center items-center text-[16px] gap-[20px] font-[600] rounded-[5px] ">
                            <FaInstagram className="text-[32px]" />
                        </NavLink>
                    </div>
                    <div className="nav-opts w-[100%] flex flex-col items-start gap-[25px]">
                        <div className="w-[100%]">
                            <NavLink to="/home" className="flex flex-row w-[90%]  h-[50px] justify-center items-center text-[16px] gap-[20px] font-[600] rounded-[5px] ">
                                <GoHome className="text-[32px]" />
                            </NavLink>
                        </div>

                        <div className="w-[100%]">
                            <NavLink onClick={opneDrawerHandler} className="flex flex-row w-[90%]  h-[50px] justify-center items-center text-[16px] gap-[20px] font-[600] rounded-[5px] ">
                                <IoMdSearch className="text-[32px]" />
                            </NavLink>
                        </div>


                        <div className="w-[100%]">
                            <NavLink onClick={closeDrawerHandler2} className="flex flex-row w-[90%]  h-[50px] justify-center items-center text-[16px] gap-[20px] font-[600] rounded-[5px] ">
                                <FaRegHeart className="text-[32px]" />
                            </NavLink>
                        </div>

                        <div className="w-[100%]">
                            <NavLink to="/create-post" className="flex flex-row w-[90%]  h-[50px] justify-center items-center text-[16px] gap-[20px] font-[600] rounded-[5px] ">
                                <MdOutlineAddCircleOutline className="text-[32px]" />
                            </NavLink>
                        </div>

                        <div className="w-[100%]">
                            <NavLink to={`/user-profile/${userID}`} className="flex flex-row w-[90%]  h-[50px] justify-center items-center text-[16px] gap-[20px] font-[600] rounded-[5px] ">
                                <GoPerson className="text-[32px]" />
                            </NavLink>
                        </div>
                    </div>
                    <div onClick={removeToken} className="absolute bottom-[50px] cursor-pointer left-[25px]">
                        <NavLink className="flex flex-row w-[90%]   h-[50px] justify-center items-center text-[16px] gap-[20px] font-[600] rounded-[5px] ">
                            <IoIosLogOut onClick={removeToken} className="text-[32px]" />
                        </NavLink>
                    </div>
                </div>
                <div className="w-[90%] pl-[10px] h-[100%] overflow-x-auto">
                    <h1 className="text-[28px] pt-[92px] ml-[24px] font-[sans-serif] font-[600] mb-[30px]">
                        Notifications
                    </h1>

                    {notifications?.map(notification => {
                        if (notification?.type !== "REPORT_POST") {
                            return (<div className="w-[95%] h-[70px] pl-[20px] flex flex-row items-center mb-[10px] justify-between">
                                <div className="h-[100%] flex flex-row">
                                    <NavLink to={`/user-profile/${notification?.metadata?.requestMakerId}`}>
                                        <div className="h-[60px] w-[60px] rounded-[60px] overflow-hidden">
                                            {
                                                !!(notification?.metadata?.requestMakerAvatar) ?
                                                    <img className="h-[100%] w-[100%] object-cover" src={notification?.metadata?.requestMakerAvatar} /> :
                                                    <img className="h-[100%] w-[100%] object-cover" src={profile} />
                                            }
                                        </div>
                                    </NavLink>
                                    <div className="h-[100%] flex flex-col pl-[20px] justify-center">

                                        <div className="flex flex-row gap-[20px] relative">
                                            <div className="text-white font-[sans-serif] text-[16px] font-[600]">
                                                {`${notification?.metadata?.requestMakerName?.substr(0, 5) + "..."} ${notification?.metadata?.msg}`}
                                            </div>
                                        </div>
                                        <div className="text-[#a8a8a8] flex flex-row">
                                            <div className="mr-[20px] empty:mr-[0px] text-pink-700 font-[700]" >{notification?.metadata?.comment?.substr(0, 20)}</div>  {notification?.relativeTime}
                                        </div>
                                    </div>
                                </div>
                                {notification?.type === "FOLLOW_REQ" && <button onClick={() => acceptHandler(notification?.metadata?.requestMakerId, notification?._id)} className="bg-[#0095f6] py-[1px] font-[600] text-[14px] rounded-[5px] px-[10px] text-white">Accept</button>}
                                {(notification?.type === "LIKE_POST" || notification?.type === "POST_COMMENT") && <div className="h-[70px] w-[70px]"> <img src={notification?.metadata?.postFirstImg} className="h-[100%] w-[100%] object-contain" /></div>}
                            </div>)
                        } else {
                            return (<div className="w-[95%] h-[auto] pl-[30px] flex flex-row items-start mb-[10px] justify-between gap-[5px]">
                                <div className="flex-col w-[90%]">
                                    <div className="font-[600] text-[18px] text-red-700">
                                        {notification?.metadata?.msg}..
                                    </div>
                                    <div className="text-[12px] text-[#a8a8a8]">
                                        Total Reports : {notification?.metadata?.postReports}/200
                                    </div>
                                </div>
                                <div className="h-[70px] w-[70px]">
                                    { !!(notification?.metadata?.postFirstImg)&&<img className="h-[100%] w-[100%] object-contain" src={notification?.metadata?.postFirstImg}/>}
                                </div>
                            </div>)
                        }
                    }
                    )}

                </div>

            </div>
        </div>
    )
}

export default AsideLeft; 