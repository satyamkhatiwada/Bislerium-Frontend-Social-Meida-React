import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import client from "../../axios.config";
import CredentialsContext from "../context/CredentialsContext";
import { EditIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const { token, setToken } = useContext(CredentialsContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initialize loading state

  const [edit, setEdit] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate();

  async function getUser() {
    try {
      const response = await client.get("/api/Authentication/loggedin/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setUser(response.data);
        console.log("User data fetched: ", response.data);
      } else {
        console.log("Error fetching user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false); // Set loading state to false regardless of success or failure
    }
  }

  async function updateUser() {
    const response = await client.put("/api/Authentication/update", {
      userName: user.userName,
      fullName: fullName,
      phoneNumber: phoneNumber,
      gender: gender
    });
    if (response.status === 200) {
      console.log("User updated successfully");
      setEdit(false);
      getUser();
    } else {
      console.log("Error updating user");
    }
  }

  async function deleteUser() {
    const response = await client.delete(`/api/Authentication/delete?userName=${user.userName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      console.log("User deleted successfully");
      setToken("");
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      navigate("/");
      window.location.reload();
    } else {
      console.log("Error deleting user");
    }
  
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      <NavBar />
      <div className="flex flex-col justify-center h-full pb-11">
        <div className="flex flex-row-reverse p-2"></div>
        <div className="mt-20 p-5 flex justify-center">
          <Card className=" sm:w-4/6 lg:w-1/2 ">
            <div className="bg-purple-50">
              <CardHeader>
                <Heading className="flex items-center gap-3">
                  Profile{" "}
                  <EditIcon
                  size={24}
                  className="cursor-pointer"
                    onClick={() => {
                      setFullName(user.fullName);
                      setPhoneNumber(user.phoneNumber);
                      setGender(user.gender);
                      setEdit(!edit);
                    }}
                  />{" "}
                </Heading>
                <p>Your Information</p>
              </CardHeader>
              {loading ? ( // Display loading indicator while loading
                <div className="flex justify-center items-center ">
                  <Spinner />{" "}
                </div>
              ) : (
                <div className="flex justify-center items-center ">
                  <CardBody className="grid grid-cols-6 ">
                    <div className="text-lg col-span-2 font-medium">
                      <p className="pb-3">Email:</p>
                      <p className="pb-3">Full Name:</p>
                      <p className="pb-3">Phone Number:</p>
                      <p className="pb-3">Gender:</p>
                    </div>
                    <div className="values col-span-4  text-muted-foreground text-lg">
                      {!!!edit ? (
                        <>
                          <p className="pb-3">{user.email}</p>
                          <p className="pb-3">{user.fullName}</p>
                          <p className="pb-3">{user.phoneNumber}</p>
                          <p className="pb-3">{user.gender}</p>
                        </>
                      ) : (
                        <div className="">
                          <Input
                            placeholder="email"
                            value={user.email}
                            isDisabled
                          />
                          <Input
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                          />
                          <Input
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
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
                        </div>
                      )}
                    </div>
                  </CardBody>
                </div>
              )}
              <CardFooter className="flex justify-end gap-3">
                {edit && <Button colorScheme="purple" onClick={() => updateUser()}>Edit</Button>}
                <Button colorScheme="red" onClick={onOpen}>Delete</Button>
                <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Delete?</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <p> Are you sure you want to delete your profile? </p>
                  </ModalBody>

                  <ModalFooter>
                    <Button colorScheme="red" mr={3} onClick={() => {onClose(); deleteUser();}}>
                      Delete
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
                <Button colorScheme="linkedin" onClick={() => navigate("/change-pass")}>Change Password</Button>
              </CardFooter>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
