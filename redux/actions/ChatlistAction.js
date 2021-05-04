import {
  CHAT_LIST_START,
  CHAT_LIST_SUCCESS,
  CHAT_LIST_ERROR,
} from './index.actions';
import AsyncStorage from '@react-native-community/async-storage';
import {API_URL} from '../../Config';
const fcmToken = AsyncStorage.getItem('@fcmtoken');

export const ChatlistAction = (userId, userAccesstoken) => {
  console.log(userId, userAccesstoken);
  return (dispatch) => {
    dispatch({type: CHAT_LIST_START});
    var urlprofile = `${API_URL}api-message/chat-list?user_id=${userId}`;
    const token = fcmToken ? fcmToken : '1111';
    fetch(urlprofile, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        device_id: '1234',
        device_token: token,
        device_type: 'android',
        Authorization: JSON.parse(userAccesstoken),
      },
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        if (responseData.code === '200') {
          dispatch({
            type: CHAT_LIST_SUCCESS,
            payload: responseData.data,
          });
          return Promise.resolve(responseData.data);
        } else {
          dispatch({
            type: CHAT_LIST_ERROR,
            payload: responseData,
          });
          return Promise.reject(responseData);
        }
      })
      .catch((error) => {
        dispatch({
          type: CHAT_LIST_ERROR,
          payload: error,
        });
      });
  };
};
