import React, { useState, useEffect } from "react";
import Axios from "axios";

const Following = () => {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);

  const getMyProfile = async () => {
    try {
      setLoading(true);
      const { data } = await Axios.get("/api/user/myProfile");
      setUsers(data.user.following);
      setLoading(false);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    getMyProfile();
  }, []);

  return (
    <div className='mt-14 mx-4'>
      {users &&
        users.map((user) => {
          return (
            <section
              key={user._id}
              className='flex justify-between items-center py-4 px-3 border-b-2'
            >
              <div className='flex items-center cursor-pointer'>
                <div>
                  <img
                    className='rounded-full w-8 h-8	object-cover'
                    src={user.profilePictureUrl}
                    alt={user.name}
                  />
                </div>
                <div className='pl-2'>
                  <button className='font-bold text-lg'>{user.name}</button>
                </div>
              </div>
              <div>
                <button className='bg-blue-500 text-white font-bold py-1 px-2 rounded'>
                  Unfollow
                </button>
              </div>
            </section>
          );
        })}
    </div>
  );
};

export default Following;
