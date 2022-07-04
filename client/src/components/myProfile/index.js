import React, { useEffect, useState } from "react";
import Axios from "axios";
import LoadingSpinner from "../utils/LoadingSpinner";
import UpdateProfileModal from "./UpdateProfileModal";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedProfilePictureUrl, setUpdatedProfilePictureUrl] = useState("");

  const navigate = useNavigate();

  const getMyProfile = async () => {
    try {
      setLoading(true);
      const { data } = await Axios.get("/api/user/myProfile");
      setProfile(data.user);
      setLoading(false);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const updateProfileImageHandler = (e) => {
    const file = e.target.files[0];

    const Reader = new FileReader();
    Reader.readAsDataURL(file);

    Reader.onload = () => {
      if (Reader.readyState === 2) {
        setUpdatedProfilePictureUrl(Reader.result);
      }
    };
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      await Axios.post("/api/user/updateProfile", {
        name: updatedName,
        email: updatedEmail,
        profilePictureUrl: updatedProfilePictureUrl,
      });
      setIsOpen(false);
      getMyProfile();
      setLoading(false);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    getMyProfile();
  }, []);

  return (
    <div className='mt-12'>
      {isOpen && (
        <div className='modal'>
          <UpdateProfileModal
            setIsOpen={setIsOpen}
            updatedName={updatedName}
            updatedEmail={updatedEmail}
            setUpdatedName={setUpdatedName}
            setUpdatedEmail={setUpdatedEmail}
            updateProfileImageHandler={updateProfileImageHandler}
            updateProfile={updateProfile}
          />
        </div>
      )}

      {loading ? (
        <div className='absolute top-1/2 left-1/2'>
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <section className='flex mx-6 pt-4'>
            <div>
              <img
                src={profile.profilePictureUrl}
                alt='profile-img'
                className='rounded-full w-20 h-20	object-cover'
              />
            </div>
            <div className='flex-1 ml-6'>
              <h3 className='text-3xl'>{profile.name}</h3>
              <p className='text-sm text-gray-500'>{profile.email}</p>

              <button
                onClick={() => setIsOpen(true)}
                className='border-2 w-full mt-2 cursor-pointer py-1'
              >
                Update Profile
              </button>
            </div>
          </section>

          <section className='flex justify-around my-6 border-t border-b py-2'>
            <div className='flex flex-col items-center'>
              <div>
                <h3 className='font-bold'>
                  {profile.post && profile.post.length}
                </h3>
              </div>
              <div className='text-gray-600'>Posts</div>
            </div>

            <div className='flex flex-col items-center'>
              <button onClick={() => navigate("/my-profile/followers")}>
                <div>
                  <h3 className='font-bold'>
                    {profile.followers && profile.followers.length}
                  </h3>
                </div>
                <div className='text-gray-600'>followers</div>
              </button>
            </div>

            <div className='flex flex-col items-center'>
              <button onClick={() => navigate("/my-profile/following")}>
                <div>
                  <h3 className='font-bold'>
                    {profile.following && profile.following.length}
                  </h3>
                </div>
                <div className='text-gray-600'>following</div>
              </button>
            </div>
          </section>

          {/* posts */}
          <section className='mx-2'>
            {profile.post && profile.post.length > 0 ? (
              <div className='grid grid-cols-12 gap-2'>
                {profile.post.map((item) => (
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
        </>
      )}
    </div>
  );
};

export default MyProfile;
