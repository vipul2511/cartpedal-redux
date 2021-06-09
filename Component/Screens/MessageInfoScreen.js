/* eslint-disable react-native/no-inline-styles */
import {
  Body,
  Content,
  Icon,
  Left,
  List,
  ListItem,
  Thumbnail,
} from 'native-base';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import resp from 'rn-responsive-font';
import {useTheme} from '@react-navigation/native';

const ForUser = () => {
  return (
    <Content>
      <View
        style={{
          backgroundColor: 'white',
          marginHorizontal: 12,
          marginVertical: 12,
          borderWidth: 0.5,
          borderRadius: 4,
          borderColor: 'grey',
        }}>
        <ListItem icon>
          <Body
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            <Icon name="checkmark-done" style={{color: '#34B7F1'}} />
            <Text style={{paddingHorizontal: 12}}>Read</Text>
          </Body>
        </ListItem>
        <ListItem icon>
          <Body
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            <Icon name="checkmark-done" style={{color: 'grey'}} />
            <Text style={{paddingHorizontal: 12}}>Delivered</Text>
          </Body>
        </ListItem>
      </View>
    </Content>
  );
};

const ForGroup = () => {
  return (
    <Content>
      <View
        style={{
          backgroundColor: 'white',
          marginHorizontal: 12,
          marginVertical: 12,
          borderWidth: 0.5,
          borderRadius: 4,
          borderColor: 'grey',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: '2%',
            paddingVertical: 4,
            borderBottomWidth: 0.5,
            borderBottomColor: 'grey',
          }}>
          <Text style={{color: 'red', fontSize: 16}}>Read by</Text>
          <Icon name="checkmark-done" style={{color: '#34B7F1'}} />
        </View>
        <List>
          <ListItem avatar style={{height: 84}}>
            <Left>
              <Thumbnail
                source={{
                  uri:
                    'https://cdn.britannica.com/25/222725-050-170F622A/Indian-cricketer-Mahendra-Singh-Dhoni-2011.jpg',
                }}
              />
            </Left>
            <Body>
              <Text>Kumar Pratik</Text>
              <Text note>Today, 11:50 am</Text>
            </Body>
          </ListItem>
          <ListItem avatar style={{height: 84}}>
            <Left>
              <Thumbnail
                source={{
                  uri:
                    'https://cdn.britannica.com/25/222725-050-170F622A/Indian-cricketer-Mahendra-Singh-Dhoni-2011.jpg',
                }}
              />
            </Left>
            <Body>
              <Text>Kumar Pratik</Text>
              <Text note>Today, 11:50 am</Text>
            </Body>
          </ListItem>
          <ListItem avatar style={{height: 84}}>
            <Left>
              <Thumbnail
                source={{
                  uri:
                    'https://cdn.britannica.com/25/222725-050-170F622A/Indian-cricketer-Mahendra-Singh-Dhoni-2011.jpg',
                }}
              />
            </Left>
            <Body>
              <Text>Kumar Pratik</Text>
              <Text note>Today, 11:50 am</Text>
            </Body>
          </ListItem>
        </List>
        <View
          style={{
            paddingHorizontal: '4%',
            paddingVertical: 8,
          }}>
          <Text style={{color: 'grey', fontSize: 16}}>1 Remaining</Text>
        </View>
      </View>
      <View
        style={{
          backgroundColor: 'white',
          marginHorizontal: 12,
          marginVertical: 12,
          borderWidth: 0.5,
          borderRadius: 4,
          borderColor: 'grey',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: '2%',
            paddingVertical: 4,
            borderBottomWidth: 0.5,
            borderBottomColor: 'grey',
          }}>
          <Text style={{color: 'red', fontSize: 16}}>Delivered to</Text>
          <Icon name="checkmark-done" style={{color: 'grey'}} />
        </View>
        <List>
          <ListItem avatar style={{height: 84}}>
            <Left>
              <Thumbnail
                source={{
                  uri:
                    'https://cdn.britannica.com/25/222725-050-170F622A/Indian-cricketer-Mahendra-Singh-Dhoni-2011.jpg',
                }}
              />
            </Left>
            <Body>
              <Text>Kumar Pratik</Text>
              <Text note>Today, 11:50 am</Text>
            </Body>
          </ListItem>
          <ListItem avatar style={{height: 84}}>
            <Left>
              <Thumbnail
                source={{
                  uri:
                    'https://cdn.britannica.com/25/222725-050-170F622A/Indian-cricketer-Mahendra-Singh-Dhoni-2011.jpg',
                }}
              />
            </Left>
            <Body>
              <Text>Kumar Pratik</Text>
              <Text note>Today, 11:50 am</Text>
            </Body>
          </ListItem>
          <ListItem avatar style={{height: 84}}>
            <Left>
              <Thumbnail
                source={{
                  uri:
                    'https://cdn.britannica.com/25/222725-050-170F622A/Indian-cricketer-Mahendra-Singh-Dhoni-2011.jpg',
                }}
              />
            </Left>
            <Body>
              <Text>Kumar Pratik</Text>
              <Text note>Today, 11:50 am</Text>
            </Body>
          </ListItem>
        </List>
      </View>
    </Content>
  );
};

const MessageInfoScreen = ({navigation}) => {
  const theme = useTheme();
  // const role = 'user';
  const role = 'group';
  return (
    <SafeAreaView style={styles.container}>
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
          <Image
            source={require('../images/logo_cart_paddle.png')}
            style={styles.LogoIconStyle}
          />
          <TouchableOpacity
            style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text style={styles.TitleStyle}>Message Info</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.SearchContainer} />
      </View>
      <View style={{flex: 1, backgroundColor: theme.colors.background}}>
        {role === 'user' && <ForUser />}
        {role === 'group' && <ForGroup />}
      </View>
    </SafeAreaView>
  );
};

export default MessageInfoScreen;
const styles = StyleSheet.create({
  modal: {
    height: 256,
    width: '84%',
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 16,
  },
  modal2: {
    height: 236,
    width: '84%',
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  row: {
    backgroundColor: 'white',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '4%',
    paddingVertical: '5%',
    borderBottomColor: 'grey',
    borderBottomWidth: 0.25,
  },
  row1: {
    backgroundColor: 'white',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '8%',
    paddingVertical: '5%',
    borderBottomColor: 'grey',
    borderBottomWidth: 0.25,
  },
  Styleimage: {
    alignSelf: 'flex-start',
    marginTop: 2,
    width: 60,
    height: 60,
    padding: 15,
  },
  SearchContainer: {
    flex: 0.2,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F6F9FE',
  },
  headerView: {
    paddingVertical: '3.6%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 20,
    borderBottomColor: 'grey',
    borderBottomWidth: 0.3,
  },
  BackButtonContainer: {
    flex: 0.2,
    marginLeft: 10,
    backgroundColor: 'white',
  },
  backButtonStyle: {
    margin: 10,
    height: 20,
    width: 20,
  },
  LogoIconStyle: {
    margin: 5,
    height: 30,
    width: 30,
  },
  SearchIconStyle: {
    margin: 5,
    marginRight: 20,
    height: 25,
    width: 25,
    alignSelf: 'flex-end',
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
});
