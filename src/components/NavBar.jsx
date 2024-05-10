import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import CredentialsContext from "../context/CredentialsContext";
import client from "../../axios.config";
import { EditIcon } from "@chakra-ui/icons";

const NavBar = () => {
  const { token, setToken } = useContext(CredentialsContext);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate();

 
  async function Logout() {
    //delete token from cookies in the browser
    try{  
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate("/login");
    }
    catch(err){
        console.log("Error in deleting cookie: ", err);
    }
    setToken("");
    window.location.reload();
  }

  return (
    <div>
      <nav className=" border p-3  flex justify-between pr-5">
        <div className="flex items-center justify-center gap-5">
          <p className="text-xl font-bold text-purple-700 cursor-pointer" onClick={() => navigate("/")}>Bislerium</p>
          {token && (
            <Link to="/add/blog" className="font-bold bg-green-700 text-white p-2 rounded-lg flex justify-center items-center gap-3">
            {" "}
            Create a post <EditIcon />{" "}
          </Link>
          )}
          
        </div>
        <ul className="flex gap-7 justify-center items-center text-purple-700  cursor-pointer text-lg font-bold">
          <Link to="/" className=" ">
            Home
          </Link>
          {token ? (
            <>
              <Link to="/profile">Profile</Link>
              <Button colorScheme="red" onClick={onOpen}>
                Logout
              </Button>
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Logout?</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <p> Are you sure you want to logout? </p>
                  </ModalBody>

                  <ModalFooter>
                    <Button colorScheme="red" mr={3} onClick={() => {onClose(); Logout();}}>
                      Logout
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </>
          ) : (
            <>
              {" "}
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
