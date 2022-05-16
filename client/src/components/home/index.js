import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Post from './Post';

const Posts = () => {
  const [posts, setPosts] = useState([]);

  const getRecentPosts = async () => {
    try {
      const { data } = await Axios.get('/api/post/recent');
      setPosts(data.posts);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    getRecentPosts();
  }, []);

  return (
    <div className='mt-14 mb-20'>
      {posts.map((post) => (
        <div key={post._id}>
          <Post post={post} getRecentPosts={getRecentPosts} />
        </div>
      ))}
    </div>
  );
};

export default Posts;
