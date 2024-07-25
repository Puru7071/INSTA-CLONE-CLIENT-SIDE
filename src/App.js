import './App.css';
import React from 'react';
import FormTemplate from './components/FormTemplate';
import { Route , Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreatePostPage from './pages/CreatePostPage';
import Profile from './pages/Profile';
function App() {
  return (
    <div>
      <Routes>
        <Route path='/'  element={<FormTemplate isLogin={true} isOTP={false}/>}/>
        <Route path="/sign-up" element = {<FormTemplate isLogin={false} isOTP={false}/>}/>
        <Route path='/confirm-otp' element={<FormTemplate  isLogin={false} isOTP={true}/>}/>
        <Route path='/home' element={<HomePage/>} />
        <Route path='create-post' element={<CreatePostPage/>}/>
        <Route path='/user-profile/:id' element={<Profile/>} />
      </Routes>
      
    </div>
  );
}

export default App;
