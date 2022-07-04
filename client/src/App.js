import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Posts from "./components/dashboard";
import CreatePost from "./components/createPost";
import MyProfile from "./components/myProfile";
import UserProfile from "./components/userProfile";
import Followers from "./components/myProfile/Followers";
import Following from "./components/myProfile/Following";
import ProtectedRoute from "./components/utils/ProtectedRoute";
import { useCookies } from "react-cookie";
import BottomNavigations from "./components/bottomNavigations";

const App = () => {
  const [cookies, setCookie] = useCookies();

  return (
    <BrowserRouter>
      <nav className='flex justify-center items-center px-4 py-2 fixed top-0 w-full bg-red-500 text-white'>
        <h3 className='font-bold text-2xl'>Socially</h3>
      </nav>

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
          path='/my-profile'
          element={
            <ProtectedRoute user={cookies.user}>
              <MyProfile />
            </ProtectedRoute>
          }
        />
        <Route path='/userProfile/:id' element={<UserProfile />} />
        <Route path='/my-profile/followers' element={<Followers />} />
        <Route path='/my-profile/following' element={<Following />} />
      </Routes>

      <BottomNavigations cookies={cookies} />
    </BrowserRouter>
  );
};

export default App;
