import React, { useContext, useEffect, useState } from "react";
import { BasicUtilityContext } from "../context/basicUtilityContext";
import { useNavigate } from "react-router-dom";
import AsideLeft from "../components/AsideLeft";
import PostStageArea from "../components/PostStageArea";
import { basicURL } from "../data/basicURL";
import axios from "axios";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import AsideRight from "../components/AsideRight";

const HomePage = () => {
    const [userId, setUserID] = useState(null);
    const [userAvatar , setUserAvatar] = useState(null) ; 
    const [username , setUsername] = useState("") ; 
    const [posts, setPosts] = useState([]);
    const [storiesGroupByUser, setStoriesGroupByUser] = useState([]);
    
    const { authChecker, loading, setLoading } = useContext(BasicUtilityContext);
    const navigate = useNavigate();

    useEffect(() => {
        const callAPI = async () => {
            setLoading(true) ; 
            const { isAuth, userID , avatar , username } = await authChecker();
            setUserAvatar(avatar) ; 
            setUsername(username) ; 
            if (!isAuth) {
                navigate("/");
                return;
            }
            setUserID(userID);
        };

        const fetchPosts = async () => {
            try {
                const res = await axios.get(`${basicURL}/fetch/home-page-posts`);
                const { isHomeFetched, posts } = res.data;
                if (isHomeFetched) {
                    setPosts(posts);
                } else {
                    toast.error(res?.data?.msg);
                }
            } catch (error) {
                toast.error("Failed to fetch posts");
            }
        };

        const fetchStories = async () => {
            if (!userId) return;
            try {
                const res = await axios.get(`${basicURL}/fetch/home-page-stories/${userId}`);
                const { storiesGroupByUser } = res.data;
                setStoriesGroupByUser(storiesGroupByUser); 
            } catch (error) {
                toast.error("Failed to fetch stories");
            }
        };

        callAPI();
        fetchPosts();
        if (userId) {
            fetchStories();
            setTimeout(() => setLoading(false) , 1000) ; 
        }
    }, [userId]);

    return (
        loading ? 
            (<Spinner />) : 
            (
                <div>
                    <AsideLeft userID={userId} />
                    <PostStageArea posts={posts} id={userId} storiesGroupByUser={storiesGroupByUser} userAvatar = {userAvatar} username={username}/>
                    <AsideRight userID = {userId}/>
                </div>
            )
    );
};

export default HomePage;
