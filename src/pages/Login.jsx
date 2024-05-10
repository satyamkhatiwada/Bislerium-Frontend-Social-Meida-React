import { useContext, useEffect, useState } from "react";
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
} from "@chakra-ui/react";
import { MdEmail } from "react-icons/md";
import { FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import client from "../../axios.config";
// import axios from "axios";
import CredentialsContext from "../context/CredentialsContext";
import NavBar from "../components/NavBar";
// import { PostData, setToken } from "../services/apiService";

const Login = () => {
  const { token, setToken } = useContext(CredentialsContext);

  const [show, setShow] = useState(false);
  const [userName, setUserName] = useState("kdb");
  const [password, setPassword] = useState("Nitin@123456789");
  // const [token, setToken] = useState("");
  const navigate = useNavigate();
  const handleClick = () => setShow(!show);

  function CredentialsSetter(creds) {
    console.log("CredentialsSetter called: ", creds);
    const credentials_obj = {
      accessToken: creds.accessToken,
      refreshToken: creds.refreshToken,
      expiresIn: creds.expiresIn,
    };
    setCredentials(credentials_obj);
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await client.post("/api/Authentication/login", {
        userName: userName,
        password: password
      });
      if (response.status === 200) {
        console.log("Login successful: ", response.data);
          setToken(response.data.token);
          //add cookie in browser with expiry date
          document.cookie = `token=${response.data.token}; expires=${response.data.expiration}`;
          // document.cookie = `token=${response.data.token}`;
          
          navigate("/");
      } else {
        console.log("Login failed");
        console.log(response);
      }
    } catch (error) {
      console.log("An error occurred during login");
      console.log(error);
    }
  }

 
  return (
    <div className="max-h-screen overflow-y-hidden">
      <NavBar />
      <div className="bg-[#e1e8ff] min-h-screen  flex justify-center items-center">
          <div className="p-6 bg-blue-50 w-[600px] rounded-lg">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-purple-600">
                Bislerium  <span className=" text-gray-400">| Login</span>
              </h1>
            
            </div>

            {/* Login form */}
            <div className="text-center mt-8">
              <form onSubmit={handleLogin}>
                <Stack spacing={4}>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      color="gray.500"
                      fontSize="1.2em"
                    >
                      <FaUserCircle size={20} />
                    </InputLeftElement>
                    <Input
                      type="text"
                      placeholder="UserName"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </InputGroup>
                  <InputGroup size="md">
                    <InputLeftElement
                      pointerEvents="none"
                      color="gray.500"
                      fontSize="1.2em"
                    >
                      <RiLockPasswordFill />
                    </InputLeftElement>
                    <Input
                      pr="4.5rem"
                      type={show ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={handleClick}
                        color="gray.500"
                      >
                        {show ? (
                          <FaEyeSlash size="1.3rem" />
                        ) : (
                          <FaEye size="1.3em" />
                        )}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </Stack>
                <div className="flex justify-end mt-3 underline text-purple-600">
                  <Link to="/forgot/password">Forgot Password?</Link>
                </div>
                {/* Sign in button */}
                <div className="flex justify-center mt-8 w-full">
                  <Button type="submit" colorScheme="purple" className="w-full">
                    Login
                  </Button>
                </div>
              </form>
              <div className="flex items-center justify-center mt-5 pb-4 w-full">
                <p className="mr-1">Don&apos;t have an account?</p>
                <Link to="/signup" className="text-purple-500 font-semibold">
                  Signup
                </Link>
              </div>
            </div>
          </div>

          {/* Image div on the right */}
          
      </div>
    </div>
  );
};

export default Login;
