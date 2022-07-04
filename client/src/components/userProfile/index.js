import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import LoadingSpinner from "../utils/LoadingSpinner";
import { useCookies } from "react-cookie";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [followUnfollowStatus, setFollowUnfollowStatus] = React.useState("");
  const [cookies] = useCookies();

  const { id } = useParams();

  const getUser = async () => {
    try {
      setLoading(true);
      const { data } = await Axios.get(`/api/user/userProfile/${id}`);
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const followUnfollowUserHandler = async () => {
    try {
      await Axios.get(`/api/user/followUnfollow/${id}`);
      getUser();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [id]);

  return (
    <div className='mt-12'>
      {loading ? (
        <div className='absolute top-1/2 left-1/2'>
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {user && (
            <main>
              <section className='flex mx-6 pt-4'>
                <div>
                  <img
                    src={user.profilePictureUrl}
                    alt='profile-img'
                    className='rounded-full w-20 h-20	object-cover'
                  />
                </div>
                <div className='flex-1 ml-6'>
                  <p className='text-3xl'>{user.name}</p>
                  <p className='text-sm text-gray-500'>{user.email}</p>

                  <button
                    onClick={followUnfollowUserHandler}
                    className='w-full mt-2 cursor-pointer bg-blue-500 text-white py-1'
                  >
                    {user.followers &&
                    user.followers.some(
                      (follower) => follower._id === cookies.user._id
                    )
                      ? "Unfollow"
                      : "Follow"}
                  </button>
                </div>
              </section>

              <section className='flex justify-around my-6 border-t border-b py-2'>
                <div className='flex flex-col items-center'>
                  <div>
                    <p className='font-bold'>{user.post && user.post.length}</p>
                  </div>
                  <div className='text-gray-600'>Posts</div>
                </div>

                <div className='flex flex-col items-center'>
                  <div>
                    <p className='font-bold'>
                      {user.followers && user.followers.length}
                    </p>
                  </div>
                  <div className='text-gray-600'>followers</div>
                </div>

                <div className='flex flex-col items-center'>
                  <div>
                    <p className='font-bold'>
                      {user.following && user.following.length}
                    </p>
                  </div>
                  <div className='text-gray-600'>following</div>
                </div>
              </section>

              {/* posts */}
              <section className='mx-2'>
                {user.post && user.post.length > 0 ? (
                  <div className='grid grid-cols-12 gap-2'>
                    {user.post.map((item) => (
                      <div key={item._id} className='col-span-4'>
                        <img
                          src={item.imageUrl}
                          alt='post-img'
                          className='w-full h-32 object-cover'
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center text-gray-600'>
                    You have no posts yet.
                  </div>
                )}
              </section>
            </main>
          )}
        </>
      )}
    </div>
  );
};

export default UserProfile;
