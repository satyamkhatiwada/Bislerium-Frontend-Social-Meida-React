import { Link, NavLink } from "react-router-dom";
import CredentialsContext from "../context/CredentialsContext";
import { useContext, useEffect, useState } from "react";
import AdminNav from "../components/AdminNav";
import {
  Button,
  Card,
  Divider,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import client from "../../axios.config";

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [bloggers, setBloggers] = useState([]);

  const [totalBlogs, setTotalBlogs] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalUpvotes, setTotalUpvotes] = useState(0);
  const [totalDownvotes, setTotalDownvotes] = useState(0);

  const [monthValue, setMonthValue] = useState("");
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);

  const [fetch, setFetch] = useState(true);

  useEffect(() => {
    if (fetch) {
      if (month === 0) {
        getAllTimeBlogs();
        getTopBloggers();
        getTotalBlogs();
        getTotalComments();
        getTotalUpvotes();
        getTotalDownvotes();
      } else {
        console.log("Filtering by month", month);
        getBlogsByMonth();
        getTopBloggersByMonth()
        getTotalBlogsByMonth();
        getTotalCommentsByMonth();
        getTotalUpvotesByMonth();
        getTotalDownvotesByMonth();
      }
      setFetch(false);
    }
  }, [fetch]);

  useEffect(() =>{
    const [year, month] = monthValue.split('-');   
    setYear(year);
    setMonth(month); 
  },[monthValue])

  async function getAllTimeBlogs() {
    const response = await client.get("/top/blogs");
    if (response.status === 200) {
      setBlogs(response.data);
    } else {
      console.log("Error fetching blogs");
    }
  }

  async function getTopBloggers() {
    const response = await client.get("/top/bloggers");
    if (response.status === 200) {
      setBloggers(response.data);
    } else {
      console.log("Error fetching bloggers");
    }
  }

  async function getTotalBlogs() {
    const response = await client.get("/total/blogs");
    if (response.status === 200) {
      setTotalBlogs(response.data);
    } else {
      console.log("Error fetching blogs");
    }
  }

  async function getTotalComments() {
    const response = await client.get("/total/comments");
    if (response.status === 200) {
      setTotalComments(response.data);
    } else {
      console.log("Error fetching comments");
    }
  }

  async function getTotalUpvotes() {
    const response = await client.get("/total/upvotes");
    if (response.status === 200) {
      setTotalUpvotes(response.data);
    } else {
      console.log("Error fetching upvotes");
    }
  }

  async function getTotalDownvotes() {
    const response = await client.get("/total/downvotes");
    if (response.status === 200) {
      setTotalDownvotes(response.data);
    } else {
      console.log("Error fetching downvotes");
    }
  }

  async function getBlogsByMonth() {
    const response = await client.get(`/monthly/top/blogs?year=${year}&month=${month}`);
    if (response.status === 200) {
      setBlogs(response.data);
    } else {
      console.log("Error fetching blogs");
    }
  }

  async function getTopBloggersByMonth() {
    const response = await client.get(`/monthly/top/bloggers?year=${year}&month=${month}`);
    if (response.status === 200) {
      setBloggers(response.data);
    } else {
      console.log("Error fetching bloggers");
    }
  }

  async function getTotalBlogsByMonth() {
    const response = await client.get(`/monthly/total/blogs?year=${year}&month=${month}`);
    if (response.status === 200) {
      setTotalBlogs(response.data);
    } else {
      console.log("Error fetching blogs");
    }
  }

  async function getTotalCommentsByMonth() {
    const response = await client.get(`/monthly/total/comments?year=${year}&month=${month}`);
    if (response.status === 200) {
      setTotalComments(response.data);
    } else {
      console.log("Error fetching comments");
    }
  } 

  async function getTotalUpvotesByMonth() {
    const response = await client.get(`/monthly/total/upvotes?year=${year}&month=${month}`);
    if (response.status === 200) {
      setTotalUpvotes(response.data);
    } else {
      console.log("Error fetching upvotes");
    }
  }

  async function getTotalDownvotesByMonth() {
    const response = await client.get(`/monthly/total/downvotes?year=${year}&month=${month}`);
    if (response.status === 200) {
      setTotalDownvotes(response.data);
    } else {
      console.log("Error fetching downvotes");
    }
  }

  return (
    <div>
      <AdminNav />
      <div className="p-10 max-h-[750px] overflow-scroll ">
        <div className="flex justify-around">
          <Button colorScheme="purple" className="w-1/4" onClick={() => window.location.reload()}>
            All Time
          </Button>
          <div className="flex gap-4">
            <Input type="month" value={monthValue} onChange={(e) => setMonthValue(e.target.value)}/>
            <Button colorScheme="purple" className="w-1/4" onClick={() => {setFetch(true)}}>
              Filter
            </Button>
          </div>
        </div>
      </div>
      <div className=" px-10 grid grid-cols-4 grid-rows-1 gap-5 items-center">
        <div className="bg-purple-100 border border-gray-100 rounded-lg min-h-24 flex items-center p-5 justify-between shadow-lg">
          <p className="text-xl font-bold text-gray-500">Blogs</p>
          <p className=" text-4xl font-extrabold text-gray-700">{totalBlogs}</p>
        </div>
        <div className="bg-purple-100 border border-gray-100 rounded-lg min-h-24 flex items-center p-5 justify-between shadow-lg">
          <p className="text-xl font-bold text-gray-500">Upvotes</p>
          <p className=" text-4xl font-extrabold text-gray-700">
            {totalUpvotes}
          </p>
        </div>
        <div className="bg-purple-100 border border-gray-100 rounded-lg min-h-24 flex items-center p-5 justify-between shadow-lg">
          <p className="text-xl font-bold text-gray-500">Downvotes</p>
          <p className=" text-4xl font-extrabold text-gray-700">
            {totalDownvotes}
          </p>
        </div>
        <div className="bg-purple-100 border border-gray-100 rounded-lg min-h-24 flex items-center p-5 justify-between shadow-lg">
          <p className="text-xl font-bold text-gray-500">Comments</p>
          <p className=" text-4xl font-extrabold text-gray-700">
            {totalComments}
          </p>
        </div>
      </div>
      <div className="px-10 pt-7 flex flex-col gap-4">
        <h1 className="text-lg font-bold"> Top 10 Bloggers</h1>

        {bloggers.map((blogger, index) => (
          <div key={index} className="bg-purple-50   shadow-lg p-2">
            <p>
              {" "}
              {index + 1}. {blogger.fullName}
            </p>
          </div>
        ))}
      </div>
      <div className="px-10 pt-7">
        <h1 className="text-lg font-bold"> Top 10 blogs</h1>
        <div className="border border-3 mt-2 rounded-xl flex flex-col gap-4">
          {blogs.map((blog) => (
            <Card
              key={blog.id}
              variant="elevated"
              className="border border-3 mt-2 h-60 overflow-y-hidden "
            >
              <div className="bg-purple-50 h-full grid grid-cols-8 grid-rows-1  shadow-lg">
                <div className="left col-span-2 p-2 flex flex-col items-center justify-center">
                  <Divider colorScheme="purple" />
                  <Text className="text-xs">Popularity: {blog.popularity}</Text>
                </div>
                <div className="col-span-6 p-2 flex flex-col gap-4">
                  <Stack px={3} mt={7} spacing="3" className="flex h-4/6">
                    <Heading size="md">{blog.title}</Heading>
                    <Text>
                      {blog.body.length > 250
                        ? blog.body.substring(0, 250) + "..."
                        : blog.body}
                    </Text>
                  </Stack>
                  <div className="flex justify-end mr-2 mb-5">
                    <Link to={`/blog/${blog.id}`}>
                      <Button variant="solid" colorScheme="purple">
                        Read More
                      </Button>
                    </Link>
                  </div>
                </div>
               
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
