import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ThumbsDownIcon,
  ThumbsUpIcon,
  MessageCirclePlus,
  EditIcon,
  Trash2,
  Save,
  ArrowLeftCircleIcon,
} from "lucide-react";
import client from "../../axios.config";
import CredentialsContext from "../context/CredentialsContext";
import { jwtDecode } from "jwt-decode";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { Toaster, toast } from "sonner";

const BlogDetails = () => {
  const { id } = useParams();
  const [token, setToken] = useState("");
  const [blog, setBlog] = useState(null);
  const [claims, setClaims] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fetch, setFetch] = useState(true);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showEditComment, setShowEditComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [selectedComment, setSelectedComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [likeStatus, setLikeStatus] = useState(3);
  const [blogReactionId, setBlogReactionId] = useState(0);

  // const [reactedComment, setReactedComments] = useState();

  // const [commentLikeStatus, setCommentLikeStatus] = useState(0);
  // const [commentReactionId, setCommentReactionId] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    setToken(document.cookie.split("=")[1]);
  }, []);

  useEffect(() => {
    if (token) {
      const userInfo = getUserInfo(token);
      if (userInfo) {
        setClaims(userInfo.nameIdentifier);
      }
    }
  }, [token]);

  useEffect(() => {
    if (fetch || token || claims) {
      getBlogReaction();
      setFetch(false);
    }
  }, [fetch, token, claims]);

  useEffect(() => {
    async function getBlog() {
      const response = await client.get(`/api/Blog/${id}`);
      if (response.status === 200) {
        console.log("Blog details:", response.data);
        if (response.data.image) {
          const imageUrl = encodeURIComponent(response.data.image);
          try {
            const imageResponse = await client.get(
              `/api/Blog/image?url=${imageUrl}`,
              { responseType: "blob" }
            );
            console.log("Image response:", imageResponse);
            response.data.imageSrc = URL.createObjectURL(imageResponse.data);
          } catch (imageError) {
            console.error("Error fetching image:", imageError);
          }
        }
        setBlog(response.data);
      } else {
        console.error("Error fetching blog details:", response);
      }
    }

    async function getComments() {
      const response = await client.get(`/api/Comment/${id}`);
      if (response.status === 200) {
        const commentsWithReactions = await Promise.all(
          response.data.map(async (comment) => {
            const [likeStatus, reactionId] = await Promise.all([
              getCommentReactionByID(comment),
              getCommentReactionID(comment),
            ]);
            return {
              ...comment,
              commentLikeStatus: likeStatus,
              commentReactionId: reactionId,
            };
          })
        );
        setComments(commentsWithReactions);
      } else {
        console.error("Error fetching comments:", response);
      }
    }

    async function initializeData() {
      try {
        await getBlog();
        await getComments();
      } catch (error) {
        console.error("Error initializing data:", error);
      }
      setFetch(false);
    }

    if (fetch) {
      initializeData();
    }
  }, [id, token, fetch, claims]); // Only re-run the effect if these dependencies change

  async function getCommentReactionByID(comment) {
    console.log("Getting comment reaction details...CLAIMS: ", claims);
    console.log("Getting comment reaction details...ID: ", comment.id);
    try {
      const response = await client.post("/api/CommentReaction/getbyid", {
        userId: comment.author.id,
        commentId: comment.id,
      });
      if (response.status === 200) {
        console.log("Comment reaction details:", response.data);
        if (response.data.isLiked) {
          return 1;
        } else {
          return -1;
        }
      } else {
        return 0;
      }
    } catch (error) {
      return 0;
    }
  }

  async function getCommentReactionID(comment) {
    try {
      const response = await client.post("/api/CommentReaction/getbyid", {
        userId: comment.author.id,
        commentId: comment.id,
      });
      if (response.status === 200) {
        return response.data.id;
      } else {
        return 0;
      }
    } catch (error) {
      return 0;
    }
  }

  useEffect(() => {
    console.log("Comments:", comments);
  }, [comments]);

  async function getBlogReaction() {
    try {
      const res = await client.post(
        "/api/BlogReaction/getbyid",
        {
          userId: claims,
          blogId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        console.log("Blog reaction details:", res.data);
        setBlogReactionId(res.data.id);
        if (res.data.isLiked) {
          setLikeStatus(1);
        } else {
          setLikeStatus(-1);
        }
      } else {
        console.log("Error fetching blog reaction details:", res.data);
      }
    } catch (error) {
      setLikeStatus(0);
    }
  }

  function getUserInfo(token) {
    try {
      const decoded = jwtDecode(token);
      const nameIdentifier =
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];
      return {
        nameIdentifier,
        fullDecoded: decoded,
      };
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      return null;
    }
  }

  function handleNavigate() {
    navigate(`/edit/blog/${id}`);
  }

  async function DeleteBlog() {
    const response = await client.delete(`/api/Blog/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      navigate("/");
    } else {
      console.error("Error deleting blog:", response);
    }
  }

  async function addReaction(reaction) {
    const response = await client.post("api/BlogReaction/add", {
      userId: claims,
      blogId: id,
      isLiked: reaction,
    });
    if (response.status === 200) {
      console.log("Reaction added:", response.data);
      setLikeStatus(reaction ? 1 : -1);
      setFetch(true);
    } else {
      console.error("Error adding reaction:", response);
    }
  }

  async function updateReaction(reaction) {
    const response = await client.patch(
      `api/BlogReaction/update/${blogReactionId}`,
      {
        isLiked: reaction,
      }
    );
    if (response.status === 200) {
      console.log("Reaction updated:", response.data);
      setLikeStatus(reaction ? 1 : -1);
      setFetch(true);
      setBlogReactionId(response.data.id);
    } else {
      console.error("Error updating reaction:", response);
    }
  }

  async function deleteReaction() {
    const response = await client.delete(`delete/${blogReactionId}`);
    if (response.status === 200) {
      console.log("Reaction deleted:", response.data);
      setLikeStatus(0);
      setFetch(true);
    }
  }

  async function handleBlogUpvote(blogId) {
    console.log("Upvoting blog:", blogId);
    if (likeStatus === 0) {
      console.log("This should upvote");
      addReaction(true);
    } else if (likeStatus === 1) {
      console.log("This should unlike the blog");
      deleteReaction();
    } else if (likeStatus === -1) {
      console.log("This should delete downvote and add upvote");
      updateReaction(true);
    }
  }

  function handleBlogDownvote(blogId) {
    console.log("Downvoting blog:", blogId);
    if (likeStatus === 0) {
      console.log("This should upvote");
      addReaction(false);
    } else if (likeStatus === 1) {
      console.log("This should unlike the blog");
      updateReaction(false);
    } else if (likeStatus === -1) {
      console.log("This should delete downvote and add upvote");
      deleteReaction();
    }
  }

  async function addCommentReaction(reaction, comment) {
    const response = await client.post(`api/CommentReaction/add/`, {
      userId: claims,
      commentId: comment.id,
      isLiked: reaction,
    });
    if (response.status === 200) {
      console.log("Comment reaction added:", response.data);
      setFetch(true);
    }
  }

  async function updateCommentReaction(reaction, comment) {
    const response = await client.patch(
      `api/CommentReaction/update/${comment.commentReactionId}`,
      {
        isLiked: reaction,
      }
    );
    if (response.status === 200) {
      console.log("Comment reaction updated:", response.data);
      setFetch(true);
    }
  }

  async function deleteCommentReaction(comment) {
    const response = await client.delete(
      `api/CommentReaction/delete/${comment.commentReactionId}`
    );
    if (response.status === 200) {
      console.log("Comment reaction deleted:", response.data);
      setFetch(true);
    }
  }

  function handleCommentUpvote(comment) {
    if (comment.commentLikeStatus === 0) {
      console.log("This should upvote");
      addCommentReaction(true, comment);
    } else if (comment.commentLikeStatus === 1) {
      console.log("This should unlike the comment");
      deleteCommentReaction(comment);
      // delete here
    } else if (comment.commentLikeStatus === -1) {
      console.log("This should delete downvote and add upvote");
      updateCommentReaction(true, comment);
      //update here
    }
  }

  function handleCommentDownvote(comment) {
    if (comment.commentLikeStatus === 0) {
      console.log("This should upvote");
      addCommentReaction(false, comment);
    } else if (comment.commentLikeStatus === 1) {
      console.log("This should unlike the comment");
      updateCommentReaction(false, comment);
    } else if (comment.commentLikeStatus === -1) {
      console.log("This should delete downvote and add upvote");
      deleteCommentReaction(comment);
    }
  }

  async function AddComment() {
    const response = await client.post(
      "/api/Comment/add",
      {
        blogId: id,
        commentText: comment,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      console.log("Comment added:", response.data);
      toast.success("Comment added successfully");
      setComment("");
      setFetch(true);
    } else {
      console.error("Error adding comment:", response);
      toast.error("Failed to add comment");
    }
  }

  async function EditComment() {
    console.log("Selected comment:", selectedComment);
    console.log("url for edit:", `/api/Comment/update/${selectedComment.id}`);
    const response = await client.put(
      `/api/Comment/update/${selectedComment.id}`,
      {
        commentText: editCommentText,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      console.log("Comment updated:", response.data);
      setEditCommentText("");
      setShowEditComment(false);
      setSelectedComment("");
      setFetch(true);
    } else {
      toast.error("Failed to update comment");
    }
  }

  async function DeleteComment(id) {
    const response = await client.delete(`/api/Comment/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      console.log("Comment deleted:", response.data);
      toast.success("Comment deleted successfully");
      setFetch(true);
    } else {
      console.error("Error deleting comment:", response);
    }
  }

  if (!blog || !comments) {
    return (
      <div className="flex justify-center h-screen items-center">
        <Spinner size="xl" />
      </div>
    ); // Show loading state until blog is fetched
  }

  return (
    <div>
      {/* <NavBar /> */}
      <Link
        to="/"
        className="text-lg font-bold m-2 mt-4 ml-4 flex items-center gap-3"
      >
        {" "}
        <ArrowLeftCircleIcon /> Back to Home
      </Link>
      <div className="min-h-screen grid grid-cols-4 grid-rows-1 gap-4 p-2">
        <div className="col-span-3 flex flex-col gap-4 border bg-purple-50 p-4 rounded-lg shadow-lg">
          <div className="row-span-1 items-center grid grid-cols-8 gap-4">
            <div className="col-span-1 flex flex-col items-center justify-center pt-3 gap-2">
              <ThumbsUpIcon
                onClick={() => handleBlogUpvote(id)}
                size={23}
                strokeWidth={2}
                className={
                  likeStatus === 1
                    ? "cursor-pointer fill-emerald-500 hover:stroke-emerald-500"
                    : "cursor-pointer hover:stroke-emerald-800"
                }
              />

              <p className="text-center">
                {blog.upVoteCount || blog.downVoteCount
                  ? blog.upVoteCount - blog.downVoteCount
                  : 0}
              </p>
              <ThumbsDownIcon
                onClick={() => handleBlogDownvote(id)}
                size={23}
                strokeWidth={2}
                className={
                  likeStatus === -1
                    ? "cursor-pointer fill-red-500 hover:fill-red-600"
                    : "cursor-pointer hover:fill-red-600 hover:stroke-red-600"
                }
              />
            </div>
            <div className="col-span-7 p-3">
              <h1 className="text-2xl font-bold">{blog.title}</h1>
              <div className="author text-left pt-3">
                <p className="italic font-semibold text-gray-400 text-xs">
                  Author:{" "}
                  {blog.author && blog.author.email
                    ? blog.author.fullName
                    : "Anonymous"}
                </p>
                <p className="text-xs font-medium text-gray-400">
                  Last Modified: {blog.createdAt}
                </p>
                <div className="flex gap-3 mt-3">
                  {claims && claims === blog.author.id && (
                    <>
                      <Button
                        colorScheme="yellow"
                        onClick={() => handleNavigate()}
                      >
                        Edit
                      </Button>
                      <Button colorScheme="red" onClick={onOpen}>
                        Delete
                      </Button>
                      <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                          <ModalHeader>Delete this article?</ModalHeader>
                          <ModalCloseButton />
                          <ModalBody>
                            <p> Are you sure you want to delete? </p>
                          </ModalBody>

                          <ModalFooter>
                            <Button
                              colorScheme="red"
                              mr={3}
                              onClick={() => {
                                onClose();
                                DeleteBlog();
                              }}
                            >
                              Delete
                            </Button>
                          </ModalFooter>
                        </ModalContent>
                      </Modal>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="row-span-3 h-96 flex justify-center">
            <img src={blog.imageSrc} className="bg-cover" />
          </div>
          <div className="bg-blue-90 p-3 text-justify">{blog.body}</div>
        </div>
        <div className="col-span-1 bg-purple-100 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Comments </h2>
            <MessageCirclePlus
              onClick={() => setShowCommentInput(!showCommentInput)}
            />
          </div>
          {showCommentInput && (
            <div className="flex gap-2 mt-2 items-center">
              <Textarea
                type="text"
                placeholder="Enter your comment"
                className="border p-2 rounded-lg w-full"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></Textarea>

              <Button
                colorScheme="purple"
                isDisabled={comment.length < 1}
                onClick={() => AddComment()}
              >
                Submit
              </Button>
            </div>
          )}
          <div className="flex pt-3">
            <div className="rounded-lg w-full flex flex-col gap-2 justify-between text-sm font-medium">
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="rounded-lg shadow-xl flex justify-between items-center p-3 bg-purple-50"
                >
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-bold">
                      {comment.author.fullName}
                    </p>
                    <p className="text-[8px] font-semibold italic">
                      Last Modified Date: {comment.commentedAt}
                    </p>
                    {!showEditComment && (
                      <p className="text-sm text-justify">
                        {comment.commentText}
                      </p>
                    )}
                    <div className="flex gap-2">
                      {claims && claims === comment.author.id && (
                        <>
                          <EditIcon
                            size={18}
                            strokeWidth={2}
                            className="cursor-pointer hover:shadow hover:shadow-emerald-800"
                            onClick={() => {
                              setShowEditComment(!showEditComment);
                              setSelectedComment(comment);
                              setEditCommentText(comment.commentText);
                            }}
                          />
                          <Trash2
                            size={18}
                            strokeWidth={2}
                            className="cursor-pointer hover:shadow hover:shadow-red-800"
                            onClick={() => DeleteComment(comment.id)}
                          />
                          {showEditComment &&
                            selectedComment.id === comment.id && (
                              <Save
                                size={18}
                                strokeWidth={2}
                                className="cursor-pointer hover:shadow hover:shadow-yellow-800"
                                onClick={EditComment}
                              />
                            )}
                        </>
                      )}
                    </div>
                    {showEditComment && selectedComment.id === comment.id && (
                      <Textarea
                        className="text-sm text-justify"
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                      />
                    )}
                  </div>

                  <div className="flex flex-row items-center justify-center gap-2 p-3 ">
                    <ThumbsUpIcon
                      size={18}
                      strokeWidth={2}
                      className={
                        comment.commentLikeStatus === 1
                          ? "cursor-pointer fill-emerald-500 hover:stroke-emerald-500"
                          : "cursor-pointer hover:stroke-gray-400"
                      }
                      onClick={() => handleCommentUpvote(comment)}
                    />
                    <p>
                      {comment.upVoteCount || comment.downVoteCount
                        ? comment.upVoteCount - comment.downVoteCount
                        : 0}
                    </p>
                    <ThumbsDownIcon
                      size={18}
                      strokeWidth={2}
                      onClick={() => handleCommentDownvote(comment)}
                      className={
                        comment.commentLikeStatus === -1
                          ? "cursor-pointer fill-red-500 hover:fill-red-600"
                          : "cursor-pointer hover:fill-gray-400"
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default BlogDetails;
