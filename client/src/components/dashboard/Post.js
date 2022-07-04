import moment from "moment";
import Axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const Post = ({ post, getRecentPosts }) => {
  const [cookies] = useCookies();

  const navigate = useNavigate();

  const likeHandler = async (id) => {
    try {
      await Axios.get(`/api/post/likeUnlike/${id}`);
      getRecentPosts();
    } catch (error) {
      console.log(error);
    }
  };

  const deletePostHandler = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this post?")) {
        await Axios.delete(`/api/post/delete/${id}`);
      }
      getRecentPosts();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const goToUserProfile = (id) => {
    if (cookies.user && cookies.user._id === id) {
      navigate("/my-profile");
    } else {
      navigate(`/userProfile/${id}`);
    }
  };

  return (
    <div className='mb-6 border-t'>
      {/* post title */}
      <section className='flex justify-between items-center py-3 px-3'>
        <div className='flex items-center cursor-pointer'>
          <div>
            <img
              className='rounded-full w-8 h-8	object-cover'
              src={post.owner.profilePictureUrl}
              alt={post.owner.name}
            />
          </div>
          <div className='pl-2'>
            <button
              onClick={() => goToUserProfile(post.owner._id)}
              className='font-bold text-lg'
            >
              {post.owner.name}
            </button>
          </div>
        </div>
        <div>
          <i
            className='fa fa-trash text-red-600 text-lg cursor-pointer'
            aria-hidden='true'
            onClick={() => deletePostHandler(post._id)}
          ></i>
        </div>
      </section>

      {/* post image */}
      <section>
        <img
          className='w-full max-h-96 object-cover'
          src={post.imageUrl}
          alt={post.title}
        />
      </section>

      {/* Actions */}
      <section className='mx-3 mt-2'>
        <div className='flex justify-between'>
          <div className='flex'>
            <div className='flex flex-col items-center'>
              <div>
                <i
                  onClick={() => likeHandler(post._id)}
                  className={
                    post.likes.includes(cookies.user._id)
                      ? "fa-solid fa-thumbs-up text-red-400 cursor-pointer text-2xl"
                      : "fa-solid fa-thumbs-up text-gray-300 cursor-pointer text-2xl"
                  }
                ></i>
              </div>
              <div>
                <p className='text-sm'>
                  {post.likes.length} {post.likes.length > 1 ? "Likes" : "Like"}
                </p>
              </div>
            </div>
            <div>
              <i className='fa-solid fa-comment cursor-pointer text-2xl text-gray-500 ml-4'></i>
            </div>
          </div>
          <div>
            <p className='text-xs font-semibold text-gray-500'>
              {moment(post.createdAt)
                .fromNow()
                .replace("hour", "hr")
                .replace("minutes", "min")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Post;
