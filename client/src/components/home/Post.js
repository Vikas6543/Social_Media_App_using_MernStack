import moment from 'moment';
import Axios from 'axios';

const Post = ({ post, getRecentPosts }) => {
  const likeHandler = async (id) => {
    try {
      await Axios.get(`/api/post/likeUnlike/${id}`);
      getRecentPosts();
    } catch (error) {
      console.log(error);
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
      <section className='mx-3 mt-2'>
        <div className='flex'>
          <div className='flex flex-col items-center'>
            <button>
              <i
                onClick={() => likeHandler(post._id)}
                className='fa-solid fa-thumbs-up text-gray-500 cursor-pointer text-2xl'
              ></i>
            </button>
            <div>
              <h3 className='text-sm'>{post.likes.length}</h3>
            </div>
          </div>
          <div>
            <i className='fa-solid fa-comment cursor-pointer text-2xl text-gray-500 ml-4'></i>
          </div>
        </div>

        <div>
          <h3 className='text-xs font-semibold text-gray-500'>
            {moment(post.createdAt)
              .fromNow()
              .replace('hour', 'hr')
              .replace('minutes', 'min')}
          </h3>
        </div>
      </section>
    </div>
  );
};

export default Post;
