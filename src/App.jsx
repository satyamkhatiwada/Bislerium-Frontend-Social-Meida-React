import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import ChangePassword from "./pages/ChangePassword";
import Blogs from "./pages/Blogs";
import BlogDetails from "./pages/BlogDetails";
import { CredentialsProvider } from "./context/CredentialsProvider";
import { Profile } from "./pages/Profile";
import { useContext, useEffect } from "react";
import CredentialsContext from "./context/CredentialsContext";
import TestFilePage from "./pages/TestFileUpload";
import BlogForm from "./pages/BlogForm";
import BlogEdit from "./pages/BlogEdit";
import ForgotPassword from "./pages/ForgotPassword";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";

function App() {
  const { setToken } = useContext(CredentialsContext);

  useEffect(() => {
    const token = document.cookie.split("=")[1];
    if (token) {
      setToken(token);
    } 
  }, []);

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Blogs />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/upload" element={<TestFilePage />}></Route>
          <Route path="/change-pass" element={<ChangePassword />}></Route>
          <Route path="/forgot/password" element={<ForgotPassword />}></Route>
          <Route path="/admin/dashboard" element={<Dashboard />}></Route>
          <Route path="/admin/login" element={<AdminLogin />}></Route>
          <Route path = '/admin/register' element = {<AdminRegister />}></Route>
          {/* <Route path="/blogs" element={<Blogs />}></Route> */}
          <Route
            path="/blog/:id"
            element={<BlogDetails blogs={Blogs} />}
          ></Route>
          <Route path="/add/blog" element={<BlogForm/>}></Route>
          <Route
            path="/edit/blog/:id"
            element={<BlogEdit />}
          ></Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
