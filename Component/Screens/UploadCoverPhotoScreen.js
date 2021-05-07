/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
console.disableYellowBox = true;

import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
  Platform
} from 'react-native';
import resp from 'rn-responsive-font';

import AppHeader from '../Component/AppHeader';
import AppImageSlider from '../Component/AppImageSlider';
import {closeIcon, imagePlaceholder} from '../Component/Images';
import ImageSelectDialog from '../Component/ImageSelectDialog';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';
import {BASE_URL} from '../Component/ApiClient';
const MAX_IMAGE_SIZE = 5;
const screenWidth = Dimensions.get('screen').width;

class UploadCoverPhotoScreen extends Component {
  constructor(props) {
    super(props);
    this.DeleteCoverPhoto = this.DeleteCoverPhoto.bind(this);
    this.state = {
      userId: '',
      userAccessToken: '',
      imageList: [],
      UploadedImage: [],
      showImageSelectDialog: false,
      selectedImageIndex: -1,
      isInnerImageSelect: false,
      isProductEdit: false,
      spinner: false,
      fcmtoken: '',
      imageID: [],
      newImageArr: [],
      coverImage: [require('../images/placeholder-image-2.png')],
    };
  }
  showLoading() {
    this.setState({spinner: true});
  }

  hideLoading() {
    this.setState({spinner: false});
  }
  componentDidMount() {
    AsyncStorage.getItem('@fcmtoken').then((token) => {
      if (token) {
        this.setState({fcmtoken: JSON.parse(token)});
      }
    });
    AsyncStorage.getItem('@user_id').then((userId) => {
      if (userId) {
        this.setState({userId: userId});
      }
    });
    AsyncStorage.getItem('@access_token').then((accessToken) => {
      if (accessToken) {
        this.setState({userAccessToken: accessToken});
        this.ProfileViewCall();
      }
    });
    AsyncStorage.getItem('@user_name').then((userName) => {
      if (userName) {
        this.setState({userName: JSON.parse(userName)});
      }
    });
  }

  DeleteCoverPhoto = (data, itemIMg) => {
    this.showLoading();
    var DeleteStoriiL = `${BASE_URL}api-user/update-image`;
    fetch(DeleteStoriiL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        device_id: '1234',
        device_token: this.state.fcmtoken,
        device_type: Platform.OS,
        Authorization: JSON.parse(this.state.userAccessToken),
      },
      body: JSON.stringify({
        user_id: this.state.userId,
        upload: [],
        type: 0,
        action: 0,
        imgid: data,
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        this.hideLoading();
        if (responseData.code == '200') {
          let itemCover = this.state.UploadedImage;
          let filteredData = itemCover.filter((item) => item != itemIMg.image);
          this.setState({UploadedImage: filteredData});
          let filteredItem = this.state.imageID;
          let filteredImageID = filteredItem.filter(
            (items) => items.image != itemIMg.image,
          );
          this.setState({imageID: filteredImageID});
        } else {
        }
      })
      .catch((error) => {
        this.hideLoading();
      })
      .done();
  };

  EditMode(response) {
    if (!this.state.isInnerImageSelect) {
      let newImageArray = [];
      newImageArray.push(response);
      this.state.UploadedImage = response;
      if (this.state.UploadedImage.length == 0) {
        this.setState({selectedImageIndex: 0});
      } else {
        this.setState({selectedImageIndex: this.state.selectedImageIndex + 1});
      }
    } else {
      this.state.UploadedImage[this.state.selectedImageIndex].push(response);
    }
    this.setState({isInnerImageSelect: false, showImageSelectDialog: false});
  }

  ProfileViewCall = () => {
    this.showLoading();
    var urlprofile =
      `${BASE_URL}api-user/view-profile?user_id=` + this.state.userId;
    fetch(urlprofile, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        device_id: '1234',
        device_token: this.state.fcmtoken,
        device_type: Platform.OS,
        Authorization: JSON.parse(this.state.userAccessToken),
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.code == '200') {
          if (
            responseData.data.covers !== undefined &&
            responseData.data.covers.length > 0
          ) {
            let imageArr = this.state.UploadedImage;
            responseData.data.covers.map((item) => {
              imageArr.push(item.image);
              console.log('images', item.image);
            });
            this.setState({UploadedImage: imageArr});
            this.setState({imageID: responseData.data.covers});
          } else {
            this.setState({UploadedImage: []});
          }
          Toast.show(responseData.message);
          this.hideLoading();
        } else {
          this.hideLoading();
        }
      })
      .catch((error) => {
        this.hideLoading();
      })
      .done();
  };

  uploadProfilePic = () => {
    this.showLoading();
    var EditProfileUrl = `${BASE_URL}api-user/upload-image`;
    fetch(EditProfileUrl, {
      method: 'Post',
      headers: {
        'Content-Type': 'application/json',
        device_id: '1111',
        device_token: this.state.fcmtoken,
        device_type: Platform.OS,
        Authorization: JSON.parse(this.state.userAccessToken),
      },
      body: JSON.stringify({
        user_id: this.state.userId,
        type: 0,
        upload: this.state.newImageArr,
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        this.hideLoading();
        if (responseData.code == '200') {
          Toast.show(responseData.message);
          this.props.navigation.navigate('ProfileScreen');
        } else {
        }
      })
      .catch((error) => {
        this.hideLoading();
      })
      .done();
  };

  onImagePick(response) {
    if (!this.state.isInnerImageSelect) {
      let newImageArray = [];
      newImageArray.push(response);
      this.state.UploadedImage.push(response.path);
      let newImage = this.state.newImageArr;
      let objImage = {
        path: response.path,
        type: response.mime,
        data: response.data,
        fileName: response.modificationDate,
      };
      newImage.push(objImage);
      this.setState({newImageArr: newImage});
      this.state.imageList.push(response);
      let obj = {
        image: response.path,
      };
      this.state.imageID.push(obj);
      if (this.state.UploadedImage.length == 0) {
        this.setState({selectedImageIndex: 0});
      } else {
        this.setState({selectedImageIndex: this.state.selectedImageIndex + 1});
      }
    } else {
      this.state.UploadedImage[this.state.selectedImageIndex].push(response);
    }
    this.setState({isInnerImageSelect: false, showImageSelectDialog: false});
  }

  openImagePickerOption() {
    this.setState({
      showImageSelectDialog: !this.state.showImageSelectDialog,
      isInnerImageSelect: false,
    });
    this.imageSelectDialog.openGalleryCoverPhoto();
  }

  openCamara() {
    this.setState({
      showImageSelectDialog: !this.state.showImageSelectDialog,
      isInnerImageSelect: false,
    });
    this.imageSelectDialog.openCameraCoverPhoto();
  }

  onImageSelect(index) {
    this.setState({selectedImageIndex: index});
  }

  onInnerImageSelect() {
    this.setState({
      showImageSelectDialog: !this.state.showImageSelectDialog,
      isInnerImageSelect: true,
    });
    this.innerImageSelectDialog.showMenu();
  }

  removeInnerImage(index) {
    if (this.state.UploadedImage[this.state.selectedImageIndex].length == 1) {
      this.removeImageFromList(this.state.selectedImageIndex);
    } else {
      this.state.UploadedImageist[this.state.selectedImageIndex].splice(
        index,
        1,
      );
    }
    this.setState({UploadedImage: this.state.UploadedImage});
  }

  removeImageFromList(item, index) {
    if (item.imgid) {
      this.DeleteCoverPhoto(item.imgid, item);
    } else {
      this.state.UploadedImage.splice(index, 1);
      this.state.imageID.splice(index, 1);
      this.setState({selectedImageIndex: this.state.selectedImageIndex - 1});
    }
  }

  renderImageList(item, index) {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => this.onImageSelect(index)}
        style={[
          styles.imageListContainView,
          index == MAX_IMAGE_SIZE - 1 && {marginEnd: 10},
        ]}>
        <Image style={styles.imageView} source={{uri: item.image}} />
        <TouchableOpacity
          onPress={() => {
            this.removeImageFromList(item, index);
          }}
          style={[
            styles.imageOptionIcon,
            {position: 'absolute', top: 5, end: 5},
          ]}>
          <Image style={styles.imageOptionIcon} source={closeIcon} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  rendorImageSlider(item) {
    return (
      <View style={styles.imageSliderBig}>
        <View style={{flex: 1}}>
          <Image style={{flex: 1}} source={{uri: item}} />
        </View>
      </View>
    );
  }

  onEditProduct() {}

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Spinner
          visible={this.state.spinner}
          color="#F01738"
          textStyle={styles.spinnerTextStyle}
        />
        <StatusBar barStyle="dark-content" backgroundColor={'#fff'} />
        <AppHeader />
        <View style={[styles.container]}>
          <View style={{flex: 1}}>
            {this.state.UploadedImage.length !== 0 ? (
              <AppImageSlider
                sliderImages={this.state.UploadedImage}
                rendorImages={(item, index) => this.rendorImageSlider(item)}
              />
            ) : (
              <View style={{flex: 1}}>
                <Image
                  source={imagePlaceholder}
                  style={[styles.imagePlaceholder]}
                />
              </View>
            )}
          </View>

          <View style={[styles.imageSliderSmall]}>
            <ScrollView horizontal={true}>
              <FlatList
                horizontal={true}
                data={this.state.imageID}
                numColumns={1}
                renderItem={({item, index, separators}) =>
                  this.renderImageList(item, index)
                }
              />
              <ImageSelectDialog
                ref={(ref) => (this.innerImageSelectDialog = ref)}
                style={{position: 'absolute', end: 10}}
                onImagePick={(response) => {
                  this.onImagePick(response);
                }}
              />
            </ScrollView>
          </View>
          <View style={styles.TabBox}>
            <View style={styles.tabStyle}>
              <TouchableOpacity
                style={styles.tabButtonStyle}
                onPress={() => this.openImagePickerOption()}>
                <ImageSelectDialog
                  ref={(ref) => (this.imageSelectDialog = ref)}
                  style={{position: 'absolute', end: 10}}
                  onImagePick={(response) => {
                    this.onImagePick(response);
                  }}
                />
                <View style={styles.uploadContainer}>
                  <Image
                    source={require('../images/Image_icon.png')}
                    style={styles.StyleSettingTab}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tabButtonStyle}
                onPress={() => this.openCamara()}>
                <ImageSelectDialog
                  ref={(ref) => (this.imageSelectDialog = ref)}
                  style={{position: 'absolute', end: 10}}
                  onImagePick={(response) => {
                    this.onImagePick(response);
                  }}
                />
                <View style={styles.uploadContainer}>
                  <Image
                    source={require('../images/camara_icon.png')}
                    style={styles.StyleSettingTab}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tabButtonStyle}
                onPress={() => {
                  this.uploadProfilePic();
                }}>
                <View style={styles.uploadContainer}>
                  <Image
                    source={require('../images/upload_icon.png')}
                    style={styles.styleChartTab}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    width: '100%',
    height: 50,
    padding: 10,
    flexDirection: 'row',
  },
  spinnerTextStyle: {
    color: '#F01738',
  },
  headerLogo: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 20,
  },
  backIcon: {
    height: 35,
    width: 35,
    resizeMode: 'contain',
  },
  imageSliderBig: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageSliderSmall: {
    // justifyContent: 'center',
    // marginTop:1,
    // minHeight: (screenWidth / 4)
  },
  imagePlaceholder: {
    width: screenWidth,
    height: 500,
    backgroundColor: '#fff',
    resizeMode: 'cover',
  },
  addImageButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth / 4 - 10,
    height: screenWidth / 4 - 10,
    backgroundColor: 'pink',
    marginStart: 5,
    alignSelf: 'center',
    borderRadius: 5,
  },
  addImageButtonText: {
    width: (screenWidth / 4 - 10) / 3,
    height: (screenWidth / 4 - 10) / 3,
    textAlign: 'center',
  },
  imageListContainView: {
    borderRadius: 5,
    marginStart: 10,
    marginTop: 30,
  },
  imageView: {
    borderRadius: 5,
    width: resp(130),
    height: resp(70),
    backgroundColor: '#fff',
  },
  tabButtonStyle: {
    flex: 0.33,
    width: resp(30),
    height: resp(50),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  uploadContainer: {
    width: resp(50),
    height: resp(50),
    borderRadius: resp(40),
    backgroundColor: '#e9e9e9',
  },
  StyleSettingTab: {
    marginTop: 9,
    width: 30,
    height: 30,
    color: '#000',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  styleChartTab: {
    marginTop: 1,
    width: 50,
    height: 50,
    marginLeft: 2,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomInactiveTextStyle: {
    color: '#887F82',
    fontSize: resp(10),
    marginTop: 3,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  UploadImagesContainer: {
    flex: 0.25,
    position: 'absolute',
    bottom: 100,
  },
  storyItemBox: {
    marginBottom: -12,
    height: resp(90),
    backgroundColor: 'white',
    flexDirection: 'row',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    elevation: 2,
  },
  columnView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImageViewStyle: {
    margin: resp(2),
    width: resp(130),
    height: resp(90),
    borderWidth: 2,
  },
  CloseIconStyle: {
    marginTop: resp(10),
    marginRight: resp(15),
    position: 'absolute',
    top: 0,
    right: -5,
    width: 16,
    height: 16,
    borderRadius: resp(20),
    backgroundColor: '#9da1a3',
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
    color: 'red',
    marginTop: 10,
  },
  placeholder: {
    borderWidth: 1,

    backgroundColor: '#fff',
    width: '95%',
    height: 250,
  },
  button: {
    width: '80%',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  innerImageView: {
    borderRadius: 5,
    width: screenWidth / 4,
    height: screenWidth / 4,
    backgroundColor: '#fff',
  },
  imageOptionIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  editIcon: {
    height: 60,
    width: 60,
    resizeMode: 'contain',
  },
  submitIcon: {
    height: 55,
    width: 55,
    resizeMode: 'contain',
  },
  TabBox: {
    flex: 0.3,
  },
  tabStyle: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 60,
    elevation: 20,
    shadowColor: 'grey',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    bottom: 0,
  },
});

export default UploadCoverPhotoScreen;
