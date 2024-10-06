import "./App.css";
import Posts from "./Components/Posts";
import Header from "./Components/Header";
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Components/Layout'
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useEffect } from "react";
import { UserContextProvider } from "./Components/UserContext";
import CreatePost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPost";

function App() {
  return (

    <>
      <UserContextProvider>
        <Routes>

          <Route path="/" element={<Layout />}>
            <Route index element={
              <main> <HomePage />  </main>
            } />

            <Route path='/login' element={< LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/create' element={<CreatePost />} />
            <Route path="/post/:id" element = {<PostPage/>} />
            <Route path="/edit/:id" element = {<EditPost/>} />
          </Route>
        </Routes>
      </UserContextProvider>


    </>
  );
}

export default App;

// 03 : 19 : 28