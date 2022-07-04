import React from "react";

const UpdateProfileModal = ({
  setIsOpen,
  updatedName,
  updatedEmail,
  setUpdatedName,
  setUpdatedEmail,
  updateProfileImageHandler,
  updateProfile,
}) => {
  return (
    <>
      <main className='relative bg-white mt-40 mx-3 rounded'>
        <section className='absolute right-1 top-1 cursor-pointer bg-red-500 text-white px-1 rounded'>
          <button onClick={() => setIsOpen(false)}>X</button>
        </section>

        <section className='px-8 py-10'>
          <input
            type='text'
            className='px-3
            py-1.5
         border border-solid border-gray-300
         rounded
         w-full
         m-0
         focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
       '
            placeholder='Name'
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
          />

          <input
            type='text'
            className='px-3
         py-1.5
         border border-solid border-gray-300
         rounded
         my-3
          w-full
         focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
       '
            placeholder='E-mail'
            value={updatedEmail}
            onChange={(e) => setUpdatedEmail(e.target.value)}
          />

          <input type='file' onChange={updateProfileImageHandler} />

          <button
            onClick={updateProfile}
            className='mt-5 bg-blue-500 w-full text-white py-1 rounded cursor-pointer'
          >
            Update Profile
          </button>
        </section>
      </main>
    </>
  );
};

export default UpdateProfileModal;
