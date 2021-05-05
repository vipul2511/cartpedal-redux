import {
  CONVERSION_LIST_START,
  CONVERSION_LIST_SUCCESS,
  CONVERSION_LIST_ERROR,
} from './index.actions';
import AsyncStorage from '@react-native-community/async-storage';
import {API_URL} from '../../Config';
const fcmToken = AsyncStorage.getItem('@fcmtoken');

export const ConversationListAction = (userID, type, toid, userAccessToken) => {
  return (dispatch) => {
    dispatch({type: CONVERSION_LIST_START});
    let formData = new FormData();
    formData.append('user_id', userID);
    formData.append('toid', toid);
    formData.append('type', type);
    formData.append('msg_type', '0');
    const token = fcmToken ? fcmToken : '1111';
    fetch(`${API_URL}api-message/conversation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        device_id: '1234',
        device_token: token,
        device_type: 'android',
        Authorization: JSON.parse(userAccessToken),
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.code == '200') {
          dispatch({
            type: CONVERSION_LIST_SUCCESS,
            payload: responseData.data,
          });
          return Promise.resolve(responseData.data);
        } else {
          dispatch({
            type: CONVERSION_LIST_ERROR,
            payload: responseData,
          });
          return Promise.reject(responseData);
        }
      })
      .catch((error) => {
        dispatch({
          type: CONVERSION_LIST_ERROR,
          payload: error,
        });
      });
  };
};
