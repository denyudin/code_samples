import React from "react";
import Articles from "../components/Articles";

const fetchPosts = async () => {
    return fetch(`${process.env.API_URL}/api/posts`)
        .then(res => res.json());
};

const Home = (props) => {
    const {posts} = props;
    return (
        <>
            <Articles items={posts}/>
        </>
    )
};

export async function getServerSideProps(context) {
    const data = await fetchPosts();
    return {
        props: {
            posts: data
        }
    }
}

export default Home
