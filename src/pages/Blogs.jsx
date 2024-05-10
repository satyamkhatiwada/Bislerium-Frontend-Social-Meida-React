import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  Heading,
  Image,
  Stack,
  Text,
  Spinner,
  useToast,
  Divider,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";
import client from "../../axios.config";
import CredentialsContext from "../context/CredentialsContext";

const Blogs = () => {
  const { token } = useContext(CredentialsContext);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(3); // Number of blogs per page
  const [slicedBlogs, setSlicedBlogs] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentFilter, setCurrentFilter] = useState('id'); // Added to track the current filter
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage, currentFilter]);

  const fetchBlogs = async (page) => {
    setLoading(true);
    let url = '/api/Blog'; // Default endpoint
    switch(currentFilter) {
      case 'popularity':
        url = '/api/Blog/popular/list';
        break;
      case 'random':
        url = '/api/Blog/random/list';
        break;
      case 'date':
        url = '/api/Blog/newest/list';
        break;
    }

    try {
      const response = await client.get(url);
      if (response.status === 200) {
        const blogsDataWithImages = await Promise.all(
          response.data.map(async (blog) => {
            if (blog.image) {
              const imageUrl = encodeURIComponent(blog.image);
              try {
                const imageResponse = await client.get(
                  `/api/Blog/image?url=${imageUrl}`,
                  { responseType: "blob" }
                );
                blog.imageSrc = URL.createObjectURL(imageResponse.data);
              } catch (imageError) {
                console.error("Error fetching image:", imageError);
              }
            }
            return blog;
          })
        );
        setBlogs(blogsDataWithImages);
        setTotalPages(Math.ceil(response.data.length / pageSize));
      }
    } catch (error) {
      toast({
        title: "Error fetching blogs",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    const slicedBlogs = blogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    setSlicedBlogs(slicedBlogs);
  }, [blogs, currentPage, pageSize]);

  const handleUpvote = (blogId) => {
    if (token) {
      // Handle upvote logic
    } else {
      navigate("/login");
    }
  };

  const handleDownvote = (blogId) => {
    if (token) {
      // Handle downvote logic
    } else {
      navigate("/login");
    }
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  async function sortBlogsByPopularity(){
    setCurrentFilter('popularity');
    fetchBlogs(currentPage);
  };

  async function randomizeArray() {
    setCurrentFilter('random');
    fetchBlogs(currentPage);
  }

  async function sortByDateAscending() {
    setCurrentFilter('date');
    fetchBlogs(currentPage);
  }

  return (
    <div>
      <NavBar />
      <div className="p-10 max-h-[750px] overflow-scroll">
        <div className="flex justify-around">
          <Button colorScheme="purple" className="w-1/4" onClick={randomizeArray}>
            Sort by Random
          </Button>
          <Button colorScheme="purple" className="w-1/4" onClick={sortBlogsByPopularity}>
            Sort by Popularity
          </Button>
          <Button colorScheme="purple" className="w-1/4" onClick={sortByDateAscending}>
            Sort by Recency
          </Button>
        </div>
        {loading ? (
          <Spinner size="xl" />
        ) : (
          <Stack spacing={5} mt={3}>
            {slicedBlogs.map((blog) => (
               <Card
               key={blog.id}
               variant="elevated"
               className="border border-3 mt-2 h-60 overflow-y-hidden"
             >
               <div className="bg-purple-50 h-full grid grid-cols-8 grid-rows-1 shadow-lg">
                 <div className="left col-span-1 p-2 flex flex-col items-center justify-center">
                   <Divider colorScheme="purple" />
                   <Text className="text-xs">Popularity: {blog.popularity}</Text>
                 </div>
                 <div className="col-span-5 p-2 flex flex-col gap-4">
                   <Stack px={3} mt={7} spacing="3" className="flex h-4/6">
                     <Heading size="md">{blog.title}</Heading>
                     <Text>{blog.body.length > 250 ? blog.body.substring(0, 250) + "..." : blog.body}</Text>
                   </Stack>
                   <div className="flex justify-end mr-2 mb-5">
                     <Link to={`/blog/${blog.id}`}>
                       <Button variant="solid" colorScheme="purple">
                         Read More
                       </Button>
                     </Link>
                   </div>
                 </div>
                 <div className="right col-span-2 p-2 flex justify-center">
                   {blog.imageSrc ? (
                     <Image
                       src={blog.imageSrc}
                       alt="Blog"
                       className="h-60 bg-slate-500"
                       objectFit="cover"
                     />
                   ) : (
                     <Text>No image available</Text>
                   )}
                 </div>
               </div>
             </Card>
            ))}
          </Stack>
        )}
        <Stack direction="row" mt={4} justifyContent="space-between">
          <Button onClick={handlePrevious} isDisabled={currentPage === 1}>
            Previous
          </Button>
          <Text>Page {currentPage} of {totalPages}</Text>
          <Button onClick={handleNext} isDisabled={currentPage === totalPages}>
            Next
          </Button>
        </Stack>
      </div>
    </div>
  );
};

export default Blogs;
