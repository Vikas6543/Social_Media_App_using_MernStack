import moment from "moment";
import Axios from "axios";
import { useCookies } from "react-cookie";

const Post = ({ post, getRecentPosts }) => {
  const [cookies] = useCookies();

  const likeHandler = async (id) => {
    try {
      await Axios.get(`/api/post/likeUnlike/${id}`);
      getRecentPosts();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='mb-4 border-t'>
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
            <h4 className='font-bold text-lg'>{post.owner.name}</h4>
          </div>
        </div>
        <div className='cursor-pointer'>
          <i className='fa-solid fa-ellipsis'></i>
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
      <section className='mx-3 mt-2 flex justify-between'>
        <div className='flex'>
          <div className='flex flex-col items-center'>
            <div>
              <i
                onClick={() => likeHandler(post._id)}
                className={
                  post.likes.includes(cookies.user._id)
                    ? "fa-solid fa-thumbs-up text-red-500 cursor-pointer text-2xl"
                    : "fa-solid fa-thumbs-up text-gray-400 cursor-pointer text-2xl"
                }
              ></i>
            </div>
            <div>
              <h3 className='text-sm'>
                {post.likes.length} {post.likes.length > 1 ? "Likes" : "Like"}
              </h3>
            </div>
          </div>

          <div>
            <div>
              <i className='fa-solid fa-comment cursor-pointer text-2xl text-gray-500 ml-4'></i>
            </div>
          </div>
        </div>

        <div>
          <div className='pt-1'>
            <h3 className='text-xs font-semibold text-gray-500'>
              {moment(post.createdAt)
                .fromNow()
                .replace("hour", "hr")
                .replace("minutes", "min")}
            </h3>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Post;
