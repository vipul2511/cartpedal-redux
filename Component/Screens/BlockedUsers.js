import AsyncStorage from '@react-native-community/async-storage';
import {
  Body,
  Button,
  Left,
  List,
  ListItem,
  Right,
  Thumbnail,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
  SafeAreaView,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import resp from 'rn-responsive-font';
import {BASE_URL} from '../Component/ApiClient';

const BlockedUsers = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [fcmToken, setFcmToken] = useState('');
  const [userId, setUserId] = useState('');
  const [userAccessToken, setUserAccessToken] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('@fcmtoken').then((token) => {
      if (token) {
        setFcmToken(JSON.parse(token));
      }
    });
    AsyncStorage.getItem('@user_id').then((uid) => {
      if (uid) {
        setUserId(uid);
      }
    });
    AsyncStorage.getItem('@access_token').then((accessToken) => {
      if (accessToken) {
        setUserAccessToken(accessToken);
        // fetchContacts();
      }
    });
  }, []);

  const unblock = (block_id) => {
    setLoading(true);
    let formData = new FormData();

    formData.append('user_id', userId);
    formData.append('block_id', block_id);
    formData.append('type', 0);

    var fav = `${BASE_URL}api-user/block-fav-user`;
    fetch(fav, {
      method: 'Post',
      headers: new Headers({
        'Content-Type': 'multipart/form-data',
        device_id: '1111',
        device_token: fcmToken,
        device_type: Platform.OS,
        Authorization: JSON.parse(userAccessToken),
      }),
      body: formData,
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.code == '200') {
          // eslint-disable-next-line no-alert
          alert('User is unblocked');
        } else {
        }
      })
      .catch((error) => {})
      .finally(() => setLoading(false))
      .done();
  };

  const fetchContacts = () => {
    setLoading(true);
    console.log({
      'Content-Type': 'application/json',
      device_id: '1234',
      device_token: fcmToken,
      device_type: Platform.OS,
      Authorization: JSON.parse(userAccessToken),
    });
    console.log(`${BASE_URL}api-user/block-user?user_id=${userId}`);
    fetch(`${BASE_URL}api-user/block-user?user_id=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        device_id: '1234',
        device_token: fcmToken,
        device_type: Platform.OS,
        Authorization: JSON.parse(userAccessToken),
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        if (responseData.code === 200) {
          console.log(JSON.stringify(responseData.data));
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Spinner
        visible={loading}
        color="#F01738"
        textStyle={styles.spinnerTextStyle}
      />
      <View style={styles.container}>
        <View style={styles.headerView}>
          <View style={styles.BackButtonContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require('../images/back_blck_icon.png')}
                style={styles.backButtonStyle}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.TitleContainer}>
            <TouchableOpacity
              style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.TitleStyle}>Blocked Users</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.SearchContainer} />
        </View>
        <List style={{flex: 1}}>
          <ListItem avatar>
            <Left>
              <Thumbnail
                source={{
                  uri:
                    'https://c.ndtvimg.com/2020-07/m7opt04g_ms-dhoni-afp_625x300_06_July_20.jpg',
                }}
              />
            </Left>
            <Body style={{height: 72, justifyContent: 'center'}}>
              <Text>Gaurav Jain</Text>
              <Text note>+91 9399729705</Text>
            </Body>
            <Right style={{height: 72, justifyContent: 'center'}}>
              <Button
                onPress={() => unblock(170)}
                danger
                style={{paddingHorizontal: '8%', borderRadius: 8}}>
                <Text style={{color: 'white'}}>UNBLOCK</Text>
              </Button>
            </Right>
          </ListItem>
          <ListItem avatar>
            <Left>
              <Thumbnail
                source={{
                  uri:
                    'https://c.ndtvimg.com/2020-07/m7opt04g_ms-dhoni-afp_625x300_06_July_20.jpg',
                }}
              />
            </Left>
            <Body style={{height: 72, justifyContent: 'center'}}>
              <Text>Gaurav Jain</Text>
              <Text note>+91 9399729705</Text>
            </Body>
            <Right style={{height: 72, justifyContent: 'center'}}>
              <Button danger style={{paddingHorizontal: '8%', borderRadius: 8}}>
                <Text style={{color: 'white'}}>UNBLOCK</Text>
              </Button>
            </Right>
          </ListItem>
          <ListItem avatar>
            <Left>
              <Thumbnail
                source={{
                  uri:
                    'https://c.ndtvimg.com/2020-07/m7opt04g_ms-dhoni-afp_625x300_06_July_20.jpg',
                }}
              />
            </Left>
            <Body style={{height: 72, justifyContent: 'center'}}>
              <Text>Gaurav Jain</Text>
              <Text note>+91 9399729705</Text>
            </Body>
            <Right style={{height: 72, justifyContent: 'center'}}>
              <Button danger style={{paddingHorizontal: '8%', borderRadius: 8}}>
                <Text style={{color: 'white'}}>UNBLOCK</Text>
              </Button>
            </Right>
          </ListItem>
          <ListItem avatar>
            <Left>
              <Thumbnail
                source={{
                  uri:
                    'https://c.ndtvimg.com/2020-07/m7opt04g_ms-dhoni-afp_625x300_06_July_20.jpg',
                }}
              />
            </Left>
            <Body style={{height: 72, justifyContent: 'center'}}>
              <Text>Gaurav Jain</Text>
              <Text note>+91 9399729705</Text>
            </Body>
            <Right style={{height: 72, justifyContent: 'center'}}>
              <Button danger style={{paddingHorizontal: '8%', borderRadius: 8}}>
                <Text style={{color: 'white'}}>UNBLOCK</Text>
              </Button>
            </Right>
          </ListItem>
        </List>
      </View>
    </SafeAreaView>
  );
};

export default BlockedUsers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spinnerTextStyle: {
    color: '#F01738',
  },
  headerView: {
    flex: 0.1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 5,
  },
  BackButtonContainer: {
    flex: 0.2,
    marginLeft: 10,
    backgroundColor: 'white',
  },
  SearchContainer: {
    flex: 0.2,
    backgroundColor: '#fff',
  },
  backButtonStyle: {
    margin: 10,
    height: 20,
    width: 20,
  },
  TitleContainer: {
    flexDirection: 'row',
    flex: 0.6,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  TitleStyle: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: resp(20),
    textAlign: 'center',
  },
  ImageContainer: {
    height: resp(100),
    color: '#fff',
    flexDirection: 'row',
  },
  Profile2Container: {
    height: resp(70),
    color: '#fff',
    flexDirection: 'row',
  },
  PersonNameStyle: {
    marginTop: resp(10),

    // height: resp(20),
    color: '#000',
    fontSize: resp(15),
    fontWeight: 'bold',
  },
  ProfileDescription: {
    marginRight: resp(-2),
    width: resp(260),
    height: resp(70),
    color: '#7F7F7F',
    fontSize: resp(12),
  },
  Profile2ImageViewStyle: {
    margin: resp(20),
    width: resp(42),
    height: resp(42),
    borderRadius: resp(10),
    borderWidth: 2,
    borderColor: '#F01738',
  },
});
