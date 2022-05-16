import React, { useEffect } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Posts from './components/home';
import CreatePost from './components/createPost';
import Notifications from './components/notifications';
import Profile from './components/profile';
import ProtectedRoute from './components/utils/ProtectedRoute';
import { useCookies } from 'react-cookie';

const App = () => {
  const [cookies, setCookie] = useCookies();

  return (
    <BrowserRouter>
      <div className='flex justify-center items-center px-4 py-2 fixed top-0 w-full bg-red-500 text-white'>
        <h3 className='font-bold text-2xl'>Viks Share</h3>
      </div>

      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute user={cookies.user}>
              <Posts />
            </ProtectedRoute>
          }
        />
        <Route
          path='/createPost'
          element={
            <ProtectedRoute user={cookies.user}>
              <CreatePost />
            </ProtectedRoute>
          }
        />

        <Route
          path='/notifications'
          element={
            <ProtectedRoute user={cookies.user}>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute user={cookies.user}>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* bottom tabs */}
      {cookies.user && (
        <div className='flex justify-between items-center px-3 py-2 fixed bottom-0 w-full bg-gray-500 text-white'>
          <Link to='/dashboard' className='flex flex-col items-center'>
            <div>
              <i className='fa-solid fa-house text-xl'></i>
            </div>
            <div>
              <h3 className='text-sm'>Home</h3>
            </div>
          </Link>

          <Link to='/createPost' className='flex flex-col items-center'>
            <div>
              <i className='fa-solid fa-circle-plus text-xl'></i>
            </div>
            <div>
              <h3 className='text-sm'>Add Post</h3>
            </div>
          </Link>

          <Link to='/notifications' className='flex flex-col items-center'>
            <div>
              <i className='fa-solid fa-bell text-xl'></i>
            </div>
            <div>
              <h3 className='text-sm'>Notifications</h3>
            </div>
          </Link>

          <Link to='/profile' className='flex flex-col items-center'>
            <div>
              <i className='fa-solid fa-user text-xl'></i>
            </div>
            <div>
              <h3 className='text-sm'>Profile</h3>
            </div>
          </Link>
        </div>
      )}
    </BrowserRouter>
  );
};

export default App;
