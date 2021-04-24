import {combineReducers} from 'redux';
import signinReducer from './userLoginReducer';
import forgotPassReducer from './forgotPasswordReducer';
import forgotPassOtpReducer from './forgotPassOtpReducer';
import ResetPassReducer from './ResetPassReducer';
import SignUpReducer from './userSignUpReducer';
import SignUpConfReducer from './signUpConfReducer';
import ProfileViewReducer from './profileViewReducer';
import storiesReducer from './userStoriesReducer';
import loggedStoriesReducer from './loggedUserStoryReducer';
import RecentDataReducer from './RecentDataReducer';
import addStoryReducer from './addStoryReducer';
import productListReducer from './ProductListReducer';
import {RESET_STORE} from '../actions/index.actions';
const appReducer= combineReducers({
    signinReducer,
    forgotPassReducer,
    forgotPassOtpReducer,
    ResetPassReducer,
    SignUpReducer,
    SignUpConfReducer,
    ProfileViewReducer,
    storiesReducer,
    loggedStoriesReducer,
    RecentDataReducer,
    addStoryReducer,
    productListReducer
});
const rootReducer = (state, action) => {
    if (action.type === RESET_STORE) {
        console.log('state',state)
      state = undefined;
    }
    return appReducer(state, action)
  }
   
  export default rootReducer;