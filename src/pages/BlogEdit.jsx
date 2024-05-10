import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { Button, Input, Textarea, Spinner } from "@chakra-ui/react";  // Import Spinner for loading indicator
import client from "../../axios.config";
import { useContext, useEffect, useState } from "react";
import CredentialsContext from "../context/CredentialsContext";

const BlogEdit = () => {
  const { id } = useParams();
  const { token } = useContext(CredentialsContext);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false); // State to manage loading status

  const navigate = useNavigate();

  async function getBlog() {
    setLoading(true); // Start loading when fetching data
    const response = await client.get(`/api/Blog/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      setBlog(response.data);
    } else {
      console.error("Error fetching blog details:", response);
    }
    setLoading(false); // Stop loading after fetching data
  }

  useEffect(() => {
    getBlog();
  }, []);

  async function UpdateBlog() {
    setLoading(true); // Start loading when updating data
    const response = await client.patch(
      `/api/Blog/update/${id}`,
      {
        title: blog.title,
        body: blog.body,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      navigate(`/blog/${id}`);
    } else {
      console.error("Error updating blog:", response);
    }
    setLoading(false); // Stop loading after updating data
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-36">
        <Spinner size="xl" /> 
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="p-2 w-full  flex justify-center mt-36">
        <div className="bg-purple-50 w-2/5 rounded-lg shadow-lg p-4">
          <h1 className="text-2xl font-semibold p-3">Edit Blog</h1>
          <form className="p-3">
            <div className="flex flex-col gap-3">
              <Input
                value={blog?.title || ''}  // Safe access using optional chaining and defaulting to empty string
                onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                type="text"
                placeholder="Title"
                className="p-2 rounded-lg border border-gray-300"
              />
              <Textarea
                value={blog?.body || ''}  // Safe access using optional chaining and defaulting to empty string
                onChange={(e) => setBlog({ ...blog, body: e.target.value })}
                placeholder="Content"
                className="p-2 rounded-lg border border-gray-300"
              ></Textarea>
              <Button colorScheme="purple" onClick={() => UpdateBlog()}>Save</Button>
              <Button colorScheme="red" onClick={() => navigate(`/blog/${id}`)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogEdit;
