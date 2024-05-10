import { useState } from "react";
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Radio,
  RadioGroup,
  Select,
  Stack,
} from "@chakra-ui/react";
import {
  FaAddressBook,
  FaAngrycreative,
  FaLungsVirus,
  FaUserAlt,
  FaUserCircle,
} from "react-icons/fa";
import { MdEmail, MdOutlineSignalCellularConnectedNoInternet4Bar } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { ChevronDownIcon, PhoneIcon } from "@chakra-ui/icons";
import client from "../../axios.config";
import { Toaster, toast } from "sonner";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [userName, setUserName] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const handleClick = () => setShow(!show);

  const {navigate} = useNavigate();

  function ClearForm() {
    setEmail("");
    setFullName("");
    setGender("");
    setUserName("");
    setPassword1("");
    setPassword2("");
    setPhoneNumber("");
  }

  async function Register(e) {
    e.preventDefault();
    if (password1 !== password2) {
      toast.error("Passwords do not match");
      return;
    }
    const role = 'USER'; // Hardcoding the role as 'USER'
    const url = `/api/Authentication/register?role=${role}`;
    try {
      const response = await client.post(url, {
        email: email,
        fullName: fullName,
        userName: userName,
        password: password1,
        phoneNumber: phoneNumber,
        gender: gender,
      });
      if (response.status === 200) {
        toast.success("Registration successful");
        ClearForm();
        navigate("/login");
      }
      else if (response.status === 403) {
        toast.error("User already exists");
        ClearForm();
      }
       else {
        toast.error("Registration failed! An unknown error occurred");
        ClearForm();
      }
    } catch (error) {
      // toast.error("Registration failed!", error);
      console.error("An error occurred during registration", error);
      ClearForm();
    }
  }

  return (
    <div className="max-h-screen overflow-y-hidden">
      <NavBar />
      <div className="bg-[#e1e8ff] min-h-screen  flex justify-center items-center">
        <div className="p-6 bg-blue-50 w-[600px] rounded-lg shadow-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-purple-600">
              Bislerium <span className=" text-gray-400">| Register</span>
            </h1>
          </div>

          {/* Login form */}
          <div className="text-center mt-8">
            <form>
              <Stack spacing={4}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.500"
                    fontSize="1.2em"
                  >
                    <FaAddressBook size={20} />
                  </InputLeftElement>
                  <Input
                    type="text"
                    placeholder="FullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </InputGroup>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.500"
                    fontSize="1.2em"
                  >
                    <MdEmail size={20} />
                  </InputLeftElement>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </InputGroup>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.500"
                    fontSize="1.2em"
                  >
                    <PhoneIcon size={20} />
                  </InputLeftElement>
                  <Input
                    type="text"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </InputGroup>

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
                    placeholder="Username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </InputGroup>

                <InputGroup gap={4}>
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
                      value={password1}
                      onChange={(e) => setPassword1(e.target.value)}
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
                      type={show2 ? "text" : "password"}
                      placeholder="Confirm password"
                      value={password2}
                      onChange={(e) => setPassword2(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={() => setShow2(!show2)}
                        color="gray.500"
                      >
                        {show2 ? (
                          <FaEyeSlash size="1.3rem" />
                        ) : (
                          <FaEye size="1.3em" />
                        )}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </InputGroup>

                <RadioGroup onChange={setGender} value={gender}>
                  <Stack direction="row" gap={6}>
                    <Radio value="Male" colorScheme="purple">
                      Male
                    </Radio>
                    <Radio value="Female" colorScheme="pink">
                      Female
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Stack>
              {/* Sign in button */}
              <div className="flex justify-center mt-8 w-full ">
                <Button
                  className="w-full"
                  type="submit"
                  colorScheme="purple"
                  onClick={(e) => Register(e)}
                  isDisabled={
                    email === "" ||
                    password1 === "" ||
                    password2 === "" ||
                    phoneNumber === "" ||
                    userName === "" ||
                    fullName === "" ||
                    gender === ""
                  }
                >
                  Signup
                </Button>
              </div>
            </form>
            <div className="flex items-center justify-center mt-5 pb-4 w-full">
              <p className="mr-1">Already have an account?</p>
              <Link to="/login" className="text-purple-500 font-semibold">
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* Image div on the right */}
      </div>
      <Toaster  position="top-right" richColors/>
    </div>
  );
};

export default Signup;
