import {
    ADD_STORIES_START, ADD_STORIES_SUCCESS, ADD_STORIES_ERROR
} from './index.actions';
import _ from 'lodash'
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import { API_URL } from '../../Config';
const fcmToken = AsyncStorage.getItem('@fcmtoken');

export const addStoryAction=(userId,userAccessToken,data)=>{
    return(dispatch)=>{
        dispatch({ type: ADD_STORIES_START });
console.log( 'raw data====',JSON.stringify({
  user_id:userId,upload:data
}));
const token = fcmToken ? fcmToken : '1111';
var otpUrl = `${API_URL}api-user/add-story`
console.log('Add product Url:' + otpUrl)
 fetch(`${API_URL}api-user/add-story`, {
  method: 'Post',
  headers:{
    'Content-Type': 'application/json',
    device_id: '1234',
    device_token: token,
    device_type: 'android',
    Authorization:JSON.parse(userAccessToken),
  },
  body:JSON.stringify({
    user_id:userId,upload:data
  }),
}).then(response => response.json())
  .then(responseData => {
    if (responseData.code == '200') {
      Toast.show(responseData.message);
      dispatch({
        type: ADD_STORIES_SUCCESS,
        payload: responseData
    })
    return Promise.resolve(responseData);
    }else{
        dispatch({
            type: ADD_STORIES_ERROR,
            payload: responseData
        })
        return Promise.reject(responseData)
    }
  })
  .catch(error => {
    console.error('error message', error);
    dispatch({
        type: ADD_STORIES_ERROR,
        payload: error
    })
  })
  .done();
}
}