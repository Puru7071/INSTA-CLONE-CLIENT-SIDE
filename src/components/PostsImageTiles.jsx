import React from "react";
import PostImageTile from "./PostImageTile";

const PostsImageTiles = ({posts , user , id}) => {
    return(
        <div className="w-[930px] h-[auto] flex flex-row flex-wrap m-auto mt-[40px] gap-[2px]">
            {posts.map((post , index) => (<PostImageTile post = {post} key={index} user={user} id = {id}/>))}
        </div>
    )
}

export default PostsImageTiles ; 