export const getRecentPosts = (state = {}, action) => {
  switch (action.type) {
    case 'GET_RECENT_POSTS':
      return {
        ...state,
        recentPosts: action.payload,
      };
    default:
      return state;
  }
};
