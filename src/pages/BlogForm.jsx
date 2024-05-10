import { useContext, useState } from "react";
import NavBar from "../components/NavBar";
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { FaAccessibleIcon } from "react-icons/fa";
import { Toaster, toast } from "sonner";
import client from "../../axios.config";
import { ChevronRightIcon } from "@chakra-ui/icons";
import CredentialsContext from "../context/CredentialsContext";

const BlogForm = () => {
    const {token} = useContext(CredentialsContext)
  const [imageUploaded, setImageUploaded] = useState(false);
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState("");

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!image) {
      toast.error("Please select an image to upload.");
      return;
    }
    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await client.post('api/Blog/test/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200) {
        toast.success("Image uploaded successfully.");
        setImageUploaded(true);
        setImageURL(response.data);
      }
      else {
        toast.error("Failed to upload image.");
        console.error('Error:', response);
      }
      
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to upload image.");
    }
  };

  function ClearForm() {
    setTitle("");
    setBody("");
    setImageUploaded(false);
    setImage(null);
    setImageURL("");
  }

  async function handleBlogUpload() {
    console.log("Token: ", token)
    console.log("Title: ", title)
    console.log("Body: ", body)
    console.log("ImageURL: ", imageURL.path)
    const response = await client.post('api/Blog/add', {
        title: title,
        body: body,
        image : imageURL.path
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (response.status === 200) {
      toast.success("Blog added successfully.");
        ClearForm();
    }
    else {
      toast.error("Failed to add blog.");
      console.error('Error:', response);
    }
  }

  return (
    <div>
      <NavBar />
      <div className="p-5 min-w-full min-h-[750px]  overflow-scroll flex justify-center items-center">
        {!!!imageUploaded ? (
          <div className="bg-purple-50 p-5 rounded-lg shadow-xl">
            <div className="text-center">
              <h1 className="text-xl font-bold text-purple-600">
                Bislerium <span className=" text-gray-400">| Blog Form</span>
              </h1>
            </div>
            <div className="text-center mt-8">
              <form>
                {/* <p>Upload a image for your blog</p> */}
                <div className="flex flex-col items-center justify-center">
                  <input
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                    className="border border-purple-500 p-2 rounded-lg"
                    onChange={(e) => handleImageChange(e)}
                  />
                  <Button
                    className="w-full mt-5"
                    colorScheme="purple"
                    onClick={() => handleImageUpload()}
                  >
                    Continue <ChevronRightIcon/>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-purple-50 p-5 rounded-lg shadow-xl w-1/2">
            <div className="text-center">
              <h1 className="text-xl font-bold text-purple-600 ">
                Bislerium <span className=" text-gray-400">| Blog Form</span>
              </h1>
            </div>
            <div className="text-center mt-8">
              <Stack spacing={4}>
                <InputGroup>
                  <Input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </InputGroup>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.500"
                    fontSize="1.2em"
                  >
                  </InputLeftElement>
                  <Textarea
                    type="text"
                    placeholder="Body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </InputGroup>
              </Stack>
              <Button
                    className="w-full mt-5"
                    colorScheme="purple"
                    onClick={() => handleBlogUpload()}
                  >
                    Add Blog
                  </Button>
            </div>
          </div>
        )}
      </div>
      <Toaster position="top-right" richColors closeButton={true}/>
    </div>
  );
};

export default BlogForm;
