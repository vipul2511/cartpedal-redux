/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
import React from 'react';
import {
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AppConst from '../Component/AppConst';
import AppImageSlider from '../Component/AppImageSlider';
import resp from 'rn-responsive-font';
import AsyncStorage from '@react-native-community/async-storage';
import {Picker} from 'native-base';
import Toast from 'react-native-simple-toast';
import ImagePicker from 'react-native-image-crop-picker';
import {BASE_URL} from '../Component/ApiClient';

const screenWidth = Dimensions.get('screen').width;

export default class ProductMasterUpdate extends React.Component {
  constructor(props) {
    super(props);
    (this.ProductCategoryCall = this.ProductCategoryCall.bind(this)),
      (this.ProductUnitCall = this.ProductUnitCall.bind(this)),
      (this.AddProductCall = this.AddProductCall.bind(this));
    this.state = {
      userId: '',
      Category: '',
      access_token: '',
      Name: '',
      price: '',
      Unit: '',
      isProfileModalVisible: false,
      bunch: '',
      isModalVisible: false,
      Details_1: '',
      Details_2: '',
      imageList: [],
      Description: '',
      productId: '',
      peopleCount: '',
      product_item: '',
      sharedPeople: '',
      showPicker: false,
      newImageArr: [],
      peoplecontact: '',
      fcmtoken: '',
      language: '',
      baseUrl: `${BASE_URL}`,
      CategoryList: [],
      ProductUnit: [],
      selected1: 'key1',
      languages: [],
      results: {
        items: [],
      },
    };
    let param = this.props.route.params;
    if (param && param.images) {
      this.state.imageList = param.images;
      this.state.product_item = param.product_item;
    }
  }
  componentDidMount() {
    AsyncStorage.getItem('@fcmtoken').then((token) => {
      if (token) {
        this.setState({fcmtoken: JSON.parse(token)});
        let countPeople = this.props.route.params.peopleListCount;
        this.setState({peopleCount: countPeople});
        let sharedPeople = this.props.route.params.sharedContactsName;
        this.setState({sharedPeople: sharedPeople});
        let peopleCOntact = this.props.route.params.peopleContact;
        let peopleSingle = peopleCOntact.join(',');
        this.setState({peoplecontact: peopleSingle});
      }
    });

    AsyncStorage.getItem('@user_id').then((userId) => {
      if (userId) {
        this.setState({userId: userId});
        this.setState({
          productId: this.props.route.params.product_item.product_id,
        });
        let item = this.props.route.params.product_item;
        this.setState({
          Category: item.category,
          Name: item.name,
          price: item.price.toString(),
          Unit: item.unit,
          bunch: item.bunch,
          Details_1: item.detailone,
          Details_2: item.detailtwo,
          Description: item.description,
        });
      }
    });

    AsyncStorage.getItem('@access_token').then((access_token) => {
      if (access_token) {
        this.setState({access_token: access_token});
        this.ProductCategoryCall();
        this.ProductUnitCall();
      }
    });
  }

  removeShareUser = (contactNumber) => {
    let formData = new FormData();
    formData.append('user_id', this.state.userId);
    formData.append('product_id', this.state.productId);
    formData.append('contact', contactNumber);
    var EditProfileUrl = `${BASE_URL}api-product/remove-share-user`;
    fetch(EditProfileUrl, {
      method: 'Post',
      headers: new Headers({
        'Content-Type': 'multipart/form-data',
        device_id: '1111',
        device_token: this.state.fcmtoken,
        device_type: 'android',
        Authorization: JSON.parse(this.state.access_token),
      }),
      body: formData,
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.code == '200') {
          let item = this.state.sharedPeople;
          let filterData = item.filter(
            (items) => items.mobile !== contactNumber,
          );
          this.setState({sharedPeople: filterData});
          this.setState({peopleCount: 0});
        } else {
        }
      })
      .catch((error) => {})
      .done();
  };

  showLoading() {
    this.setState({loading: true});
  }

  closeProfileModal = () => {
    this.setState({isProfileModalVisible: false});
  };

  hideLoading() {
    this.setState({loading: false});
  }

  CheckTextInput = () => {
    if (this.state.Category === '') {
      alert('Please Enter Category ');
    } else if (this.state.Name === '') {
      alert('Please Enter Name');
    } else if (this.state.Price === ' ') {
      alert('Please Enter Price');
    } else if (this.state.Description === '') {
      alert('Please Enter Description');
    } else {
      this.showLoading();
      this.AddProductCall();
    }
  };

  ProductCategoryCall() {
    let formData = new FormData();
    var urlProduct = `${BASE_URL}api-product/product-category-list`;
    fetch(urlProduct, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        device_id: '1234',
        device_token: this.state.fcmtoken,
        device_type: 'android',
        Authorization: JSON.parse(this.state.access_token),
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.code == '200') {
          this.setState({CategoryList: responseData.data});
        } else {
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .done();
  }

  openImageGallery() {
    this.setState({isProfileModalVisible: !this.state.isProfileModalVisible});
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then((image) => {
      let newImage = this.state.newImageArr;
      let imagePervious = this.state.imageList;
      let objImage = {
        path: image.path,
        type: image.mime,
        data: image.data,
        fileName: image.modificationDate,
      };
      let newObj = {
        file_url: image.path,
      };
      newImage.push(objImage);
      imagePervious.unshift(newObj);
      this.setState({imageList: imagePervious});
      this.setState({newImageArr: newImage});
    });
  }

  ProductUnitCall() {
    var urlProductUnit = `${BASE_URL}api-product/product-unit`;
    fetch(urlProductUnit, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        device_id: '1234',
        device_token: this.state.fcmtoken,
        device_type: 'android',
        Authorization: JSON.parse(this.state.access_token),
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.code == '200') {
          this.setState({ProductUnit: responseData.data});
        } else {
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .done();
  }

  AddProductCall() {
    fetch(`${BASE_URL}api-product/edit-product`, {
      method: 'Post',
      headers: {
        'Content-Type': 'application/json',
        device_id: '1234',
        device_token: this.state.fcmtoken,
        device_type: 'android',
        Authorization: JSON.parse(this.state.access_token),
      },
      body: JSON.stringify({
        user_id: this.state.userId,
        product_id: this.state.productId,
        name: this.state.Name,
        upload: this.state.newImageArr,
        imageids: '',
        category: this.state.Category,
        unit: this.state.Unit,
        price: this.state.price,
        description: this.state.Description,
        bunch: this.state.bunch,
        detailone: this.state.Details_1,
        detailtwo: this.state.Details_2,
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        this.hideLoading();
        if (responseData.code == '200') {
          Toast.show(responseData.message);
          this.props.navigation.navigate('ProductListScreen');
        } else {
        }
      })
      .catch((error) => {
        this.hideLoading();
      })
      .done();
  }

  deleteProduct = () => {
    this.showLoading();
    var urlProductUnit = `${BASE_URL}api-product/delete-product?user_id=${this.state.userId}&product_id=${this.state.productId}`;
    fetch(urlProductUnit, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        device_id: '1234',
        device_token: this.state.fcmtoken,
        device_type: 'android',
        Authorization: JSON.parse(this.state.access_token),
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        this.hideLoading();
        if (responseData.code == '200') {
          Toast.show(responseData.message);
          this.props.navigation.goBack();
        } else {
          this.hideLoading();
        }
      })
      .catch((error) => {
        this.hideLoading();
      })
      .done();
  };

  async SaveProductListData(responseData) {
    await AsyncStorage.setItem('@name', responseData.data.name.toString());
    await AsyncStorage.setItem(
      '@category',
      responseData.data.category.toString(),
    );
    await AsyncStorage.setItem('@unit', responseData.data.unit.toString());
    await AsyncStorage.setItem('@price', responseData.data.price.toString());
    await AsyncStorage.setItem(
      '@description',
      responseData.data.description.toString(),
    );
    await AsyncStorage.setItem('@bunch', responseData.data.bunch.toString());
    await AsyncStorage.setItem(
      '@detailone',
      responseData.data.detailone.toString(),
    );
    await AsyncStorage.setItem(
      '@detailtwo',
      responseData.data.detailtwo.toString(),
    );
  }

  openCamara() {
    this.setState({isProfileModalVisible: !this.state.isProfileModalVisible});
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      let newImage = this.state.newImageArr;
      let objImage = {
        path: image.path,
        type: image.mime,
        data: image.data,
        fileName: image.modificationDate,
      };
      newImage.push(objImage);
      this.setState({newImageArr: newImage});
    });
  }

  openDeleteModal() {
    this.setState({isModalVisible: !this.state.isModalVisible});
  }

  AddMoreShare = () => {
    let formData = new FormData();
    formData.append('user_id', this.state.userId);
    formData.append('product_id', this.state.productId);
    formData.append('contacts', contactNumber);
    var EditProfileUrl = `${BASE_URL}api-product/edit-product-share`;
    fetch(EditProfileUrl, {
      method: 'Post',
      headers: new Headers({
        'Content-Type': 'multipart/form-data',
        device_id: '1111',
        device_token: this.state.fcmtoken,
        device_type: 'android',
        Authorization: JSON.parse(this.state.access_token),
      }),
      body: formData,
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.code == '200') {
          let item = this.state.sharedPeople;
          let filterData = item.filter(
            (items) => items.mobile !== contactNumber,
          );
          this.setState({sharedPeople: filterData});
        } else {
          console.log(responseData.data);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .done();
  };

  closeModal() {
    this.setState({isModalVisible: false});
  }

  renderInnerImageList(item, index, separators) {
    return (
      <TouchableOpacity activeOpacity={1} style={{flex: 1}}>
        <Image style={styles.imageView} source={{uri: item.file_url}} />
      </TouchableOpacity>
    );
  }

  _handleMultiInput = (name) => {
    return (text) => {
      this.setState({[name]: text});
    };
  };

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={'#fff'} />
        <View style={[styles.container, {backgroundColor: '#fff'}]}>
        <TouchableOpacity
            style={styles.editImageBox}
            onPress={() => this.props.navigation.goBack()}>
            <Image
              style={styles.editImage}
              source={require('../images/back_blck_icon.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editImageBox1}
            onPress={() => {
              this.setState({isProfileModalVisible: true});
            }}>
            <Image
              style={styles.editImage1}
              source={require('../images/edit_product.png')}
            />
          </TouchableOpacity>
          <AppImageSlider
            sliderImages={this.state.imageList}
            rendorImages={(item, index) =>
              this.renderInnerImageList(item, index)
            }
          />
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.isModalVisible}
          onRequestClose={() => this.closeModal()}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={{alignSelf: 'flex-end'}}
                onPress={() => {
                  this.closeModal();
                }}>
                <Image
                  source={require('../images/modal_close.png')}
                  style={styles.CloseButtonStyle}
                />
              </TouchableOpacity>

              <View style={styles.DeleteContainer}>
                <Image
                  source={require('../images/modal_delete.png')}
                  style={styles.DeleteButtonStyle}
                />
                <Text style={styles.DeleteStutsStyle}>Delete Product</Text>
              </View>
              <Text style={styles.DeleteStutsDiscraptionStyle}>
                Are you sure you want to remove this Product?
              </Text>

              <View style={styles.ButtonContainer}>
                <View style={styles.EmptyButtonCOntainer}></View>
                <TouchableOpacity
                  style={styles.YesButtonContainer}
                  onPress={this.deleteProduct}>
                  <Text style={styles.YesTextStyle}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.NoButtonContainer}
                  onPress={() => this.setState({isModalVisible: false})}>
                  <Text style={styles.NoTextStyle}>NO</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.container2}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              <TouchableOpacity
                onPress={() => {
                  this.CheckTextInput();
                }}>
                <Text
                  style={[
                    styles.saveCancelButton,
                    {borderBottomColor: 'green', color: 'green'},
                  ]}>
                  Update
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.openDeleteModal();
                }}>
                <Text
                  style={[
                    styles.saveCancelButton,
                    {borderBottomColor: 'red', color: 'red', marginStart: 20},
                  ]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputTextView}>
              <Picker
                selectedValue={this.state.Category}
                style={{height: 50, width: screenWidth - 55}}
                onValueChange={(itemValue, itemIndex) => {
                  if (itemValue != '0') {
                    this.setState({Category: itemValue});
                    this.setState({showPicker: true});
                  } else alert('Please select correct category');
                }}>
                {this.state.CategoryList.map((item, index) => {
                  return (
                    <Picker.Item
                      label={item.title}
                      value={item.id}
                      key={index}
                    />
                  );
                })}
              </Picker>
            </View>
            <TextInput
              style={styles.input1TextView}
              placeholder={AppConst.inputPH_enter_name}
              value={this.state.Name}
              onChangeText={this._handleMultiInput('Name')}
              editable={true}
            />
            <TextInput
              style={styles.inputTextView}
              placeholder={AppConst.inputPH_price}
              value={this.state.price}
              keyboardType={'numeric'}
              onChangeText={this._handleMultiInput('price')}
              editable={true}
            />
            <View style={styles.inputTextView}>
              <Picker
                selectedValue={this.state.Unit}
                style={{height: 50, width: screenWidth - 55}}
                onValueChange={(itemValue, itemIndex) => {
                  if (itemValue != '0') {
                    this.setState({Unit: itemValue});
                  } else {
                    alert('Please select correct unit');
                  }
                }}>
                {this.state.ProductUnit.map((item, index) => {
                  return (
                    <Picker.Item
                      label={item.title}
                      value={item.id}
                      key={index}
                    />
                  );
                })}
              </Picker>
            </View>
            <TextInput
              style={styles.inputTextView}
              placeholder={AppConst.inputPH_bunch}
              value={this.state.bunch}
              onChangeText={this._handleMultiInput('bunch')}
              editable={true}
            />
            <TextInput
              style={styles.inputTextView}
              placeholder={AppConst.inputPH_detail}
              value={this.state.Details_1}
              maxLength={50}
              onChangeText={this._handleMultiInput('Details_1')}
              editable={true}
            />
            <TextInput
              style={styles.inputTextView}
              placeholder={'Details 2'}
              multiline={true}
              numberOfLines={4}
              maxLength={50}
              onChangeText={this._handleMultiInput('Details_2')}
              value={this.state.Details_2}
              editable={true}
            />
            <Text style={styles.DescriptionStyle}>Description </Text>
            <TextInput
              style={styles.DescriptionInputTextView}
              placeholder={'(Maximum 150 characters)'}
              value={this.state.Description}
              onChangeText={this._handleMultiInput('Description')}
              editable={true}
            />
          </ScrollView>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.isProfileModalVisible}
          onRequestClose={() => this.closeProfileModal()}>
          <View style={styles.centeredView}>
            <View style={styles.ProfilemodalViewStyle}>
              <TouchableOpacity
                style={{alignSelf: 'flex-end'}}
                onPress={() => {
                  this.closeProfileModal();
                }}>
                <Image
                  source={require('../images/modal_close.png')}
                  style={styles.CloseButtonStyle}
                />
              </TouchableOpacity>
              <Text style={styles.TitleProfileModalStyle}>Choice Option</Text>
              <TouchableOpacity
                onPress={() => {
                  this.openImageGallery();
                }}>
                <Text style={styles.OptionsProfileModalStyle}> Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.openCamara();
                }}>
                <Text style={styles.Options2ProfileModalStyle}> Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.Options2ProfileModalStyle}>Edit Image</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  },
  TitleProfileModalStyle: {
    alignContent: 'flex-start',
    fontWeight: 'bold',
    color: '#000',

    width: resp(207),
    fontSize: resp(16),
  },
  OptionsProfileModalStyle: {
    alignContent: 'flex-start',
    marginTop: resp(30),
    color: '#000',

    width: resp(207),
    fontSize: resp(16),
  },
  Options2ProfileModalStyle: {
    alignContent: 'flex-start',
    marginTop: resp(5),
    color: '#000',

    width: resp(207),
    fontSize: resp(16),
  },
  DescriptionStyle: {
    marginTop: resp(20),
    fontSize: resp(16),
    color: '#2B2B2B',
  },
  ShareTextStyle: {
    color: '#2B2B2B',
    marginLeft: resp(5),
    width: 'auto',
  },
  saveCancelButton: {
    fontSize: 17,
    borderBottomWidth: 1,
  },
  backIcon: {
    height: 35,
    width: 35,
    resizeMode: 'contain',
  },
  editImageBox: {
    top: 10,
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 150,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  editImage: {
    width: 20,
    height: 20,
  },
  editImageBox1: {
    top: 10,
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 150,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 60,
    zIndex: 1,
  },
  editImage1: {
    width: 40,
    height: 40,
  },
  imageView: {
    borderRadius: 5,
    width: screenWidth,
    height: screenWidth,
  },
  DescriptionStyle: {
    marginTop: resp(20),
    fontSize: resp(16),
    color: '#2B2B2B',
  },
  DescriptionStyle2: {
    width: resp(335),
    marginTop: resp(5),
    fontSize: resp(13),
    color: '#000000',
  },
  inputTextView: {
    fontSize: 17,
    color: 'black',
    borderBottomColor: '#e3e3e3',
    borderBottomWidth: 1,
    marginTop: 5,
  },
  ProfilemodalViewStyle: {
    width: 300,
    height: 200,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  DescriptionInputTextView: {
    fontSize: 17,
    color: 'black',
    borderBottomColor: '#e3e3e3',
    borderBottomWidth: 1,
    marginTop: 5,
    marginBottom: resp(25),
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    width: 300,
    height: 250,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  CloseButtonStyle: {
    marginRight: resp(20),
    alignSelf: 'flex-end',
  },
  DeleteContainer: {
    marginTop: resp(10),
    margin: resp(20),
    flexDirection: 'row',
  },
  DeleteButtonStyle: {
    alignSelf: 'flex-start',
  },
  DeleteStutsStyle: {
    fontWeight: 'bold',
    fontSize: resp(20),
    marginLeft: resp(10),
    marginBottom: 10,
    color: '#2B2B2B',
  },
  DeleteStutsDiscraptionStyle: {
    marginLeft: resp(55),
    marginTop: resp(-20),
    color: '#7F7F7F',
    width: resp(207),
    fontSize: resp(14),
  },
  ButtonContainer: {
    height: resp(50),
    marginTop: resp(20),
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  EmptyButtonCOntainer: {
    flex: 0.2,
  },
  YesButtonContainer: {
    flex: 0.4,
    marginHorizontal: resp(10),
    marginLeft: resp(-10),
    width: resp(95),
    height: resp(40),
    backgroundColor: '#06BE7E',
    borderRadius: resp(40),
  },
  NoButtonContainer: {
    flex: 0.4,
    marginRight: resp(20),
    width: resp(95),
    height: resp(40),
    backgroundColor: '#3C404333',
    borderRadius: resp(40),
  },
  YesTextStyle: {
    marginTop: resp(10),
    alignSelf: 'center',
    fontSize: resp(15),
    color: '#FFFFFF',
  },
  NoTextStyle: {
    marginTop: resp(10),
    alignSelf: 'center',
    fontSize: resp(15),
    color: '#7F7F7F',
  },
  input1TextView: {
    fontSize: 17,
    borderBottomColor: '#e3e3e3',
    borderBottomWidth: 1,
    marginTop: 1,
    color: 'black',
  },
  container2: {
    flex: 1,
    backgroundColor: 'white',
    borderTopStartRadius: 50,
    borderTopEndRadius: 50,
    marginTop: -50,
    paddingTop: 30,
    paddingStart: 30,
    paddingEnd: 30,
    height: resp(-50),
  },
  openButtonContainer: {
    marginTop: resp(10),
    flexDirection: 'row',
    width: resp(92),
    height: resp(24),
    borderColor: '#06BE7E',
    borderWidth: resp(2),
    borderRadius: resp(20),
    backgroundColor: '#e6f7f2',
  },
  AddIconStyle: {
    margin: resp(5),
    // position:'absolute',
    justifyContent: 'flex-end',
  },
  openButtonStyle: {
    color: '#06BE7E',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: resp(0),
  },
  ShareContainer: {
    flexDirection: 'row',
    marginTop: resp(10),
    width: '100%',
    height: '100%',
  },
  MoreTextStyle: {
    fontWeight: 'bold',
    marginLeft: resp(10),
    fontSize: resp(16),
    color: '#06BE7E',
  },

  ShareButtonContainer: {
    marginTop: resp(10),
    marginHorizontal: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: resp(105),
    height: resp(26),
    borderColor: '#DDDDDD',
    borderWidth: resp(2),
    borderRadius: resp(20),
    backgroundColor: '#7F7F7F1A',
  },
});
