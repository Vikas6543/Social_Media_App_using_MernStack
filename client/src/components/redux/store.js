import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { getRecentPosts } from './reducer';

const reducer = combineReducers({
  recentPosts: getRecentPosts,
});

const store = createStore(reducer, composeWithDevTools());

export default store;
