import React from "react";
import { NavLink } from "react-router-dom";

const BottomNavigations = ({ cookies }) => {
  return (
    <div>
      {cookies.user && (
        <div className='flex justify-between items-center px-3 py-2 fixed bottom-0 w-full bg-red-500'>
          <NavLink
            to='/dashboard'
            className={({ isActive }) =>
              isActive
                ? "flex flex-col items-center text-white"
                : "flex flex-col items-center text-black"
            }
          >
            <div>
              <i className='fa-solid fa-house text-xl'></i>
            </div>
            <div>
              <h3 className='text-sm font-semibold'>Home</h3>
            </div>
          </NavLink>

          <NavLink
            to='/createPost'
            className={({ isActive }) =>
              isActive
                ? "flex flex-col items-center text-white"
                : "flex flex-col items-center text-black"
            }
          >
            <div>
              <i className='fa-solid fa-circle-plus text-xl'></i>
            </div>
            <div>
              <h3 className='text-sm font-semibold'>Add Post</h3>
            </div>
          </NavLink>

          <NavLink
            to='/my-profile'
            className={({ isActive }) =>
              isActive
                ? "flex flex-col items-center text-white"
                : "flex flex-col items-center text-black"
            }
          >
            <div>
              <i className='fa-solid fa-user text-xl'></i>
            </div>
            <div>
              <h3 className='text-sm font-semibold'>Profile</h3>
            </div>
          </NavLink>

          <NavLink
            to='/'
            className={({ isActive }) =>
              isActive
                ? "flex flex-col items-center text-white"
                : "flex flex-col items-center text-black"
            }
          >
            <div>
              <i className='fa-solid fa-right-from-bracket text-xl'></i>
            </div>
            <div>
              <h3 className='text-sm font-semibold'>Logout</h3>
            </div>
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default BottomNavigations;
