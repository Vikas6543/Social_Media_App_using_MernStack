import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import LoadingSpinner from '../utils/LoadingSpinner';

const CreatePost = () => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];

    const Reader = new FileReader();
    Reader.readAsDataURL(file);

    Reader.onload = () => {
      if (Reader.readyState === 2) {
        setImage(Reader.result);
      }
    };
  };

  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      await Axios.post('/api/post/create', {
        caption,
        imageUrl: image,
      });
      setLoading(false);
      navigate('/dashboard');
    } catch (error) {
      setLoading(false);
      alert(error.response.data.message);
    }
  };

  return (
    <div className='mt-24 mx-4'>
      <h3 className='text-center py-3 text-lg font-semibold'>
        Create a New Post
      </h3>

      <div>
        <input
          className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4'
          id='caption'
          type='text'
          placeholder='Add a caption'
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* Image */}
        <input
          className='shadow border rounded w-full py-2 px-3'
          type='file'
          onChange={handleImage}
        />

        <div className='flex justify-center'>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4'
            type='submit'
            onClick={handleSubmit}
          >
            {loading ? <LoadingSpinner /> : <span>Submit</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
