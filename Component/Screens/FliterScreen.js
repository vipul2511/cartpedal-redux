import React, {Component} from 'react'

console.disableYellowBox = true

import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  ScrollView
} from 'react-native'
import resp from 'rn-responsive-font'
import CustomMenuIcon from './CustomMenuIcon'
import Toast from 'react-native-simple-toast'
import DatePicker from 'react-native-datepicker'
import AsyncStorage from '@react-native-community/async-storage'
import moment from 'moment'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import SeeMore from 'react-native-see-more-inline'
import Spinner from 'react-native-loading-spinner-overlay'


var radio_props = [
  {label: 'Order Placed', value: 1 },
  {label: 'Order Received', value: 2 }
];

class FliterScreen extends Component {
  constructor (props) {
    super(props)
  
      this.AddFavourite = this.AddFavourite.bind(this),
      this.FilerDataCall = this.FilerDataCall.bind(this),
      this.AskForStautsCall = this.AskForStautsCall.bind(this);
      this.state = {
        Start_Date: '',
        End_Date: '',
        userId: '',
        NoData: 'dfg',
        block_id: '',
        avatar: '',
        about: '',
        oderId: '',
        fcmToken:'',
        CartListProduct: '',
        typeValue:1,
        userAccessToken: '',
        spinner: '',
        favourite: '',
        redIcon: require('../images/Heart_icon.png'),
        whiteIcon: require('../images/dislike.png'),
        pickedImage: require('../images/default_user.png'),
        data: [
          {
            ImagePerson: require('../images/RiyaJainImage.png'),
            personName: 'Rahul Jain',
            Description: ' Description is the pattern of narrative',
            message_icon: require('../images/message_icon.png'),
            heart_icon: require('../images/Heart_icon.png'),
            View_all: 'View All',
            menuButtom: require('../images/more.png'),
            productImage: require('../images/ProductImage.png'),
            ItemName: 'Western Wear',
            ItemPrice: '500',
            productImage2: require('../images/ProductImage2.png'),
            ItemName2: 'Foot Wear',
            ItemPrice2: '300',
            productImage3: require('../images/ProductImages3.png'),
            ItemName3: 'Accessories ',
            ItemPrice3: '500',
            productImage4: require('../images/productImage6.png'),
            ItemName4: 'Ethnic Wear ',
            ItemPrice4: '300',
            productImage5: require('../images/productImage6.png'),
            ItemName4: 'Ethnic Wear ',
            ItemPrice4: '300',
            Cart_itemName: 'Cart Item',
            Cart_ItemValue: '12',
            Cart_itemName2: 'Cart Value',
            Cart_ItemValue2: '20',
            placeOder_button: 'Place Oder',
          },
          {
            ImagePerson: require('../images/productImage4.png'),
            personName: 'Gaurav Jain',
            Description: ' Description is the pattern of narrative',
            message_icon: require('../images/message_icon.png'),
            heart_icon: require('../images/Heart_icon.png'),
            View_all: 'View All',
            menuButtom: require('../images/more.png'),
            productImage: require('../images/productImage4.png'),
            ItemName: 'Western Wear',
            ItemPrice: '120',
            productImage2: require('../images/productImage5.png'),
            ItemName2: 'Foot Wear',
            ItemPrice2: '216',
            productImage3: require('../images/productImage5.png'),
            ItemName3: 'Accessories ',
            ItemPrice3: '246',
            productImage4: require('../images/productImage6.png'),
            ItemName4: 'Ethnic Wear ',
            ItemPrice4: '296',
            productImage5: require('../images/productImage6.png'),
            ItemName4: 'Ethnic Wear ',
            ItemPrice4: '300',
            Cart_itemName: 'Cart Item',
            Cart_ItemValue: '12',
            Cart_itemName2: 'Cart Value',
            Cart_ItemValue2: '20',
            placeOder_button: 'Place Oder',
          },
        ],
      }
  }
  ListEmpty = () => {
    return (
      <View style={styles.container}>
        <Text
          style={{color:'#000',
            margin: resp(170),
          }}>
          {this.state.NoData ? 'No Record' : null}{' '}
        </Text>
      </View>
    )
  }
  showLoading () {
    this.setState({spinner: true})
  }

  hideLoading () {
    this.setState({spinner: false})
  }
  AddFavourite (block_id) {
    this.showLoading()
    let id = this.state.userId
    let formData = new FormData()

    formData.append('user_id', id)
    formData.append('block_id', block_id)
    formData.append('type', 1)
    console.log('form data==' + JSON.stringify(formData))

    // var CartList = this.state.baseUrl + 'api-product/cart-list'
    var fav = 'http://www.cartpedal.com/frontend/web/api-user/block-fav-user'
    console.log('Add product Url:' + fav)
    fetch(fav, {
      method: 'Post',
      headers: new Headers({
        'Content-Type': 'multipart/form-data',
        device_id: '1111',
        device_token: this.state.fcmToken,
        device_type: 'android',
        // Authorization: 'Bearer' + this.state.access_token,
        Authorization: JSON.parse(this.state.userAccessToken),
      }),
      body: formData,
    })
      .then(response => response.json())
      .then(responseData => {
        this.hideLoading()
        if (responseData.code == '200') {
          //  this.props.navigation.navigate('StoryViewScreen')
          //  Toast.show(responseData.message)
          // this.RecentShareCall();
          this.FilerDataCall();
        
        } else {
          // alert(responseData.data);
          // alert(responseData.data.password)
         
        }
        console.log('response object:', responseData)
        console.log('User user ID==', JSON.stringify(responseData))
      })
      .catch(error => {
        this.hideLoading()
        console.error(error)
      })
      .done()
  }

  async componentDidMount () {
    AsyncStorage.getItem('@fcmtoken').then((token) => {
      console.log("Edit user id token=" +token);
      if (token) {
        this.setState({ fcmToken: token });
      }
    });
    AsyncStorage.getItem('@user_id').then(userId => {
      if (userId) {
        this.setState({userId: userId})
        console.log('Edit user id Dhasbord ====' + this.state.userId)
      }
    })
    AsyncStorage.getItem('@access_token').then(accessToken => {
      if (accessToken) {
        this.setState({userAccessToken: accessToken})
        console.log('Edit access token ====' + accessToken)
        //this.RecentUpdateCall();
        
      }
    })
  }

  
  CheckTextInput = () => {
    console.log('startDate=====',this.state.Start_Date)
    console.log('end Date=====',this.state.End_Date)
    console.log('orderID=====',this.state.oderId)
    console.log('type=====',this.state.typeValue)
    if(this.state.Start_Date!==''&& this.state.End_Date!=='')
    {
      console.log('if statement exucute')
      this.FilerDataCall()
     
      this.showLoading()
    }
    else if(this.state.oderId!=='' ){

      console.log('if else statement exucute')
       this.FilerDataCall()
       this.showLoading()
      
    }
    else{
      console.log('else statement exucute')
      alert('Please Enter Search Date or OrderID ')
          
          
    }
  }
 
  FilerDataCall () {
  
    let formData = new FormData()
   
    formData.append('user_id', this.state.userId)
    formData.append('type', this.state.typeValue)
    formData.append('sdate', this.state.Start_Date),
      formData.append('edate', this.state.End_Date),
      formData.append('order_id', this.state.oderId)
    console.log('form data==' + JSON.stringify(formData))

    // var CartList = this.state.baseUrl + 'api-product/cart-list'
    var FilterURL =
      'http://www.cartpedal.com/frontend/web/api-product/cart-list'
    console.log('Filter  Url:' + FilterURL)
    fetch(FilterURL, {
      method: 'Post',
      headers: new Headers({
        'Content-Type': 'multipart/form-data',
        device_id: '1111',
        device_token: this.state.fcmToken,
        device_type: 'android',
        Authorization: JSON.parse(this.state.userAccessToken),
        // Authorization: 'Bearer xriPJWJGsQT-dUgP4qH11EMM357_kEaan7zJ4Vty'
      }),
      body: formData,
    })
      .then(response => response.json())
      .then(responseData => {
        this.hideLoading()
        if (responseData.code == '200') {
          //  this.props.navigation.navigate('StoryViewScreen')
          //  Toast.show(responseData.message);
            this.setState({Start_Date:''});
            this.setState({End_Date:''});
          if (responseData.data !== undefined && responseData.data.length > 0) {
            console.log('if executed')
            console.log('Filter Data', responseData.data)
            this.setState({CartListProduct: responseData.data})
            this.setState({block_id: responseData.data[0].id})
            console.log('fevtert========', responseData.data[0].favourite)
            this.setState({favourite: responseData.data[0].favourite})
           
            // this.SaveUserName(responseData)

            if (responseData.data[0].avatar == null) {
              this.setState({avatar: ''})
            } else {
              this.setState({avatar: responseData.data[0].avatar})
            }
          } else {
            console.log('else executed')
          
            this.setState({CartListProduct: ''})
            this.setState({NoData: true})
          }

          console.log('total lenght', responseData.data.length)
          this.setState({totalDataLength: responseData.data.length})

          // this.SaveProductListData(responseData)
        } else {
          this.setState({Start_Date:''});
          this.setState({End_Date:''});
          console.log(responseData.message)
         
          console.log(responseData.message)
        }

        console.log('response object:', responseData)
        console.log('User user ID==', JSON.stringify(responseData))
      })
      .catch(error => {
        this.hideLoading()
        console.error(error)
      })
      .done()
  }
  AskForStautsCall(blockID,orderID,type) {
    let formData = new FormData()
      
      formData.append('user_id', this.state.userId)
      formData.append('type', type)
      formData.append('order_id', orderID)
      formData.append('block_id', blockID)
  
  
      console.log('form data for ask==' + JSON.stringify(formData))
     // var CartList = this.state.baseUrl + 'api-product/cart-list'
      var AskForStautsURL = "http://www.cartpedal.com/frontend/web/api-product/order-status"
      console.log(' AskForStautsURL :' + AskForStautsURL)
      fetch(AskForStautsURL, {
        method: 'Post',
        headers: new Headers({
          'Content-Type': 'multipart/form-data',
          device_id: '1111',
          device_token:this.state.fcmToken,
          device_type: 'android',
          Authorization: JSON.parse(this.state.userAccessToken),  
          // Authorization: 'Bearer xriPJWJGsQT-dUgP4qH11EMM357_kEaan7zJ4Vty'
  
        }),
        body: formData,
      })
  
        .then(response => response.json())
        .then(responseData => {
          this.hideLoading();
          if (responseData.code == '200') {
             //  this.props.navigation.navigate('StoryViewScreen')
             //   Toast.show(responseData.message);
               this.setState({OderRecevieProduct:responseData.data});
             // console.log("value",responseData.data[0].id);
              // this.setState({block_id:responseData.data[0].id});
              // console.log('fevtert========',responseData.data[0].favourite);
              // this.setState({favourite:responseData.data[0].favourite})
          //   if(responseData.data[0].avatar==null){
          //     this.setState({avatar:''})
          //   }else{
          //     this.setState({avatar:responseData.data[0].avatar});
          //   }
          //  // this.SaveProductListData(responseData)
          //  this.addQuantity(responseData.data);
          } else {
            // alert(responseData.data);
            // alert(responseData.data.password)
            this.setState({ NoData: true });
          }
  
          console.log('response object ask for:', responseData)
           console.log('User user ID==', JSON.stringify(responseData))
          //  console.log('response ID:', responseData.data[0].id)
          // console.log('access_token ', this.state.access_token)
          //   console.log('User Phone Number==' + formData.phone_number)
        })
        .catch(error => {
         this.hideLoading();
          console.error(error)
        })
  
        .done()
  
  }

  async SaveUserName (responseData) {
    await AsyncStorage.setItem(
      '@user_profileName',
      JSON.stringify(responseData.data[0].username),
    )
    console.log(
      'userNameCartPalace==',
      JSON.stringify(responseData.data[0].username),
    )
  }

  render () {
    return (
      <SafeAreaView style={styles.container}>
          <ScrollView>
        <Spinner
          visible={this.state.spinner}
          color='#F01738'
          // textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        <View style={styles.headerView}>
          <View style={styles.BackButtonContainer}></View>
          <View style={styles.TitleContainer}>
            {/* <Image
                            source={require('../images/logo_cart_paddle.png')}
                            style={styles.LogoIconStyle}
                        /> */}
            <TouchableOpacity
              style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.TitleStyle}>Filter</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.CrossContainer}
            onPress={() => this.props.navigation.goBack()}>
            <Image
              source={require('../images/cross_iocn.png')}
              style={styles.CrossIconStyle}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.hairline} />
        
        <View style={styles.SearchContainer}>
          <View style={styles.CalendarContainer}>
            <View style={styles.StartDateContainer}>
              {/* <Text style={styles.StartDateTextStyle}>Start Date</Text>
                            <Image
                                source={require('../images/calendar_icon.png')}
                                style={styles.CalnderIconStyle}
                            /> */}

              <DatePicker
                style={{
                  width: 150,
                  marginLeft: resp(30),
                  backgroundColor: '#00000008',
                }}
                date={this.state.Start_Date}
                mode='date'
                placeholder='Start Date'
                format='DD/MM/YYYY'
                confirmBtnText='Confirm'
                cancelBtnText='Cancel'
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0,
                  },
                  dateInput: {
                    marginLeft: 36,
                  },
                  // ... You can check the source to find the other keys.
                }}
                onDateChange={date => {
                  this.setState({Start_Date: date})
                }}
              />
            </View>
            <View style={styles.EndDateContainer}>
              {/* <Text style={styles.StartDateTextStyle}>End Date</Text>
              <Image
                source={require('../images/calendar_icon.png')}
                style={styles.CalnderIconStyle}
              /> */}
              <DatePicker
                style={{
                  width: 150,
                  marginLeft: resp(30),
                  backgroundColor: '#00000008',
                }}
                date={this.state.End_Date}
                mode='date'
                placeholder='End Date'
                format='DD/MM/YYYY'
                confirmBtnText='Confirm'
                cancelBtnText='Cancel'
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    right: 10,
                    marginLeft: 0,
                  },
                  dateInput: {
                    marginLeft: 36,
                  },
                  // ... You can check the source to find the other keys.
                }}
                onDateChange={date => {
                  this.setState({End_Date: date})
                }}
              />
            </View>
          </View>
          <Text style={styles.OrTextStyle}>Or</Text>

          <View style={styles.inputViewStyle}>
            <View style={{flexDirection: 'row', marginLeft: 10}}></View>

            <TextInput
              placeholder='Enter your order id'
              placeholderTextColor='#BEBEBE'
              underlineColorAndroid='transparent'
              style={styles.input}
              onChangeText={oderId => this.setState({oderId})}
            />
          </View>
          <View style={styles.RadioButtonStyle}>
           <RadioForm
            formHorizontal={true}
             animation={true}
            radio_props={radio_props}
           initial={0}
           labelStyle={{marginRight: 15 }}
            selectedButtonColor={'#F01738'}
           buttonSize={10}
            buttonColor={'#F01738'}
           
            onPress={(value) => {this.setState({typeValue:value})}}
         />
         </View>
          <TouchableOpacity
            style={styles.loginButtonStyle}
            activeOpacity={0.2}
            onPress={() => {
              this.CheckTextInput()
            }}>
            <Text style={styles.buttonWhiteTextStyle}>SEARCH</Text>
          </TouchableOpacity>
         
        </View>
     

        <View style={styles.MainContentBox}>
          <FlatList
            style={{flex: 0.85}}
            data={this.state.CartListProduct}
            // renderItem={({ item }) => <ParsonProfile item={item} />}
            keyExtractor={item => item.personName}
            renderItem={({item}) =>{
              if(item.products.length>0){
            return (
              <View style={styles.itemBox}>
                <View style={styles.box}>
                  <View style={styles.ProfileImageContainer}>
                    <TouchableOpacity>
                      <Image
                        source={
                          item.avatar == null
                            ? this.state.pickedImage
                            : {uri: item.avatar}
                        }
                        style={styles.ProfileImageViewStyle}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.ProfileInfoContainer}>
                    <Text style={styles.PersonNameStyle}>{item.name}</Text>
                    {/* <Text style={styles.ProfileDescription}>{item.Description}</Text> */}
                    <View style={{marginLeft: 0,marginTop:5, width: 350}}>
                      {item.about ? (
                        <SeeMore
                          numberOfLines={1}
                          linkColor='red'
                          seeMoreText='read more'
                          seeLessText='read less'>
                          {item.about}
                        </SeeMore>
                      ) : null}
                    </View>
                  </View>
                  <View style={styles.ListMenuContainer}>
                    <TouchableOpacity style={styles.messageButtonContainer} onPress={() => {
            console.log('id of user',item.id);
            this.props.navigation.navigate('ChatDetailScreen',{userid:item.id, username:item.name,useravatar:item.avatar, groupexit:false,groupId:0})
                      }} >
                                <Image
                          source={require('../images/message_icon.png')}
                          style={styles.messageButtonStyle}></Image>
                                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={()=>{this.AddFavourite(item.id)}}
                      style={styles.messageButtonContainer}>
                      <Image
                        source={
                          item.favourite == 1
                            ? this.state.redIcon
                            : this.state.whiteIcon
                        }
                        style={[
                          styles.heartButtonStyle,
                          {
                            width: item.favourite == 1 ? resp(11) : resp(18),
                            height: item.favourite == 1 ? resp(9) : resp(18),
                            marginTop: item.favourite == 1 ? resp(4) : resp(0),
                          },
                        ]}></Image>
                    </TouchableOpacity>
                   {this.state.typeValue==1? (<TouchableOpacity onPress={() => {
                     console.log('userData=====',item.name)
                    this.props.navigation.navigate('OderPlacedViewScreen',{ id: item.id, name: item.name })
                  }}>
                      <View style={styles.ViewButtonContainer}>
                        <Text style={styles.viewButtonStyle}>View all</Text>
                      </View>
                    </TouchableOpacity>):( <TouchableOpacity onPress={() => {
                    //  console.log('userData=====',item.name)
                    // this.props.navigation.navigate('OderPlacedViewScreen',{ id: item.id, name: item.name })
                  }}>
                      <View style={styles.ViewButtonContainer}>
                        <Text style={styles.viewButtonStyle}>View all</Text>
                      </View>
                    </TouchableOpacity>)}

                    <CustomMenuIcon
                      //Menu Text
                      menutext='Menu'
                      //Menu View Style
                      menustyle={{
                        marginRight: 5,
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                      }}
                      //Menu Text Style
                      textStyle={{
                        color: 'white',
                      }}
                      //Click functions for the menu items
                      option1Click={() => {
                        Toast.show('CLicked Shared Link', Toast.LONG)
                      }}
                      option2Click={() => {
                        Toast.show('CLicked Forward Link', Toast.LONG)
                      }}
                    />
                  </View>
                </View>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  <View style={styles.columnView}>
                    <View style={styles.ImageContainer}>
                      <Image
                        source={{uri: item.products[0].image}}
                        style={{width: 120, height: 133}}></Image>
                      <Text style={styles.itemNameStyle}>
                        {item.products[0].name}
                      </Text>
                      <Text style={styles.itemPriceStyle}>
                        {'\u20B9'}
                        {item.products[0].price}
                      </Text>
                    </View>
                  </View>
                </ScrollView>
                <View style={styles.ItemCountContainer}>
                  <View style={styles.CartValueContainer}>
                    <View style={styles.CartItemContainer}>
                      <Text style={styles.CartItemTextStyle}>Cart Item</Text>
                      <Text style={styles.CartValueTextStyle}>
                        {item.cartitem}
                      </Text>
                    </View>
                    <View style={styles.CartItemContainer}>
                      <Text style={styles.CartItemTextStyle}>Cart Value</Text>
                      <Text style={styles.CartValueTextStyle}>
                        {item.cartvalue}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.PlacedHolderButtonContainer}>
                   {this.state.typeValue==1? (<TouchableOpacity
                      style={styles.PlacedButtonStyle}
                      onPress={() => {
                        let type=0
                        this.AskForStautsCall(item.id,item.orderid,type)
                    }}
                      >
                      <Text style={styles.PlaceHolderTextStyle}>
                        Ask for Status
                      </Text>
                    </TouchableOpacity>):(<TouchableOpacity
                      style={styles.PlacedButtonStyle}
                      onPress={() => {
                        let type=1;
                        this.AskForStautsCall(item.id,item.orderid,type)
                    }}
                      >
                      <Text style={styles.PlaceHolderTextStyle}>
                        Accepted
                      </Text>
                    </TouchableOpacity>)}
                  </View>
                </View>

                <View style={styles.hairline} />
              </View>
            )}
                    }
                  }
            ListEmptyComponent={this.ListEmpty}
          />
        </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  headerView: {
   height:60,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  BackButtonContainer: {
    flex: 0.2,
    marginLeft: 10,
    backgroundColor: 'white',
  },
  TitleContainer: {
    flexDirection: 'row',
    flex: 0.6,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  RadioButtonStyle:{
   marginTop:resp(15),
   marginHorizontal:resp(30),
   marginBottom:resp(-10),
    alignContent:'center',
    alignSelf:'center',
  },
  LogoIconStyle: {
    margin: 5,
    height: 30,
    width: 30,
  },
  TitleStyle: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: resp(20),
    textAlign: 'center',
  },
  CrossContainer: {
    flex: 0.2,
    backgroundColor: '#fff',
  },
  PlaceHolderTextStyle: {
    marginTop: resp(10),
    alignSelf: 'center',

    height: resp(18),
    fontWeight: 'bold',
    fontSize: 15,
    color: '#2B2B2B',
  },
  CrossIconStyle: {
    margin: 5,
    marginRight: 20,
    height: 25,
    width: 25,
    alignSelf: 'flex-end',
  },
  hairline: {
    backgroundColor: '#C8C7CC80',
    height: 5,
    width: '100%',
  },
  SearchContainer: {
    flex: 0.4,
   
    flexDirection: 'column',
  },
  spinnerTextStyle: {
    color: '#F01738',
  },
  CalendarContainer: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: resp(20),

    marginLeft: resp(-50),
    height: resp(40),
  },
  StartDateContainer: {
    flexDirection: 'row',
    width: resp(120),

    marginHorizontal: resp(60),
    backgroundColor: '#fff',
  },
  EndDateContainer: {
    flexDirection: 'row',
    width: resp(140),
    backgroundColor: '#fff',
  },
  PlacedButtonStyle: {
    alignSelf: 'flex-end',
    height: resp(40),
    width: resp(130),
    marginTop: resp(25),
    backgroundColor: '#FFCF33',
  },
  StartDateTextStyle: {
    marginTop: resp(8),
    fontSize: resp(13),
    width: resp(70),
    marginLeft: resp(15),
    color: '#7F7F7F',
  },
  CalnderIconStyle: {
    marginLeft: 25,
    marginBottom: 10,
    height: 20,
    width: 23,
    alignSelf: 'flex-end',
  },
  OrTextStyle: {
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    fontSize: resp(16),
    marginTop: resp(5),
    color: '#2B2B2B',
  },
  inputViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000008',
    width: '85%',
    marginTop: resp(5),
    alignContent: 'center',
    alignSelf: 'center',
  },
  PlacedHolderButtonContainer: {
    marginBottom: resp(20),
    margin: resp(5),
    width: resp(150),
    height: resp(65),
    flex: 0.5,

    flexDirection: 'column',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 2,
      width: 5,
    },
    elevation: 0,
  },
  input: {
    color: '#000',
    width: resp(339),
    height: 40,
    fontSize: resp(14),
    alignSelf: 'flex-start',
  },
  loginButtonStyle: {
    marginTop: resp(20),
    width: resp(339),
    height: resp(42),
    padding: 10,
    backgroundColor: '#F01738',
    borderRadius: 40,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  buttonWhiteTextStyle: {
    textAlign: 'center',
    fontSize: resp(14),
    color: 'white',
    alignContent: 'center',
  },
  MainContentBox: {
    flex: 0.6,
    
  },
  itemBox: {
    height: resp(350),
    backgroundColor: 'white',
    flexDirection: 'column',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 1,
      width: 5,
    },
    elevation: 0,
  },
  box: {

    marginTop: resp(5),
    width: resp(415),
    height: resp(75),
   
    flexDirection: 'row',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 2,
      width: 5,
    },
    elevation: 0,
  },
  ProfileImageContainer: {
    margin: resp(10),
    flexDirection: 'column',
    flex: 0.2,
    width: resp(70),
    height: resp(70),
  },
  ProfileImageViewStyle: {
    marginTop: resp(-8),
    margin: resp(10),
    width: resp(50),
    height: resp(50),
    borderRadius: resp(8),
  },
  ProfileInfoContainer: {
    margin: resp(),
    marginTop: resp(5),
    flexDirection: 'column',
   
    flex: 0.7,
    width: resp(70),
    height: resp(70),
  },
  PersonNameStyle: {
    width: resp(80),
    height: resp(20),
    color: '#000',
    fontWeight: 'bold',
  },
  ProfileDescription: {
    marginRight: resp(-2),
    width: resp(260),
    height: resp(50),
    color: '#7F7F7F',
    fontSize: resp(12),
  },
  ListMenuContainer: {
    marginTop: resp(5),
    flexDirection: 'row',
    flex: 0.55,
    backgroundColor: 'white',
    width: resp(0),
    height: resp(20),
  },
  messageButtonContainer: {
    margin: resp(5),
    marginTop: resp(5),
    width: resp(18),
    height: resp(18),
    borderRadius: resp(50),
    backgroundColor: '#ebced7',
  },
  messageButtonStyle: {
    marginTop: resp(5),
    color: '#F01738',
    width: resp(7),
    height: resp(7),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartButtonStyle: {
    borderColor: '#F01738',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ViewButtonContainer: {
    width: resp(60),
    height: resp(24),
    backgroundColor: '#fff',
  },
  viewButtonStyle: {
    color: '#000',
    marginRight: -20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: resp(4),
  },
  columnView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImageContainer: {
    flexDirection: 'column',
    width: resp(100),
    marginTop: resp(10),
    height: resp(180),
    marginLeft: resp(20),
    borderRadius: resp(5),
  },
  itemNameStyle: {
    color: '#887F82',
    fontSize: resp(12),
    alignSelf: 'flex-start',
  },
  itemPriceStyle: {
    color: '#000',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    fontSize: resp(12),
    alignItems: 'center',
    height: 20,
  },
  ItemCountContainer: {
    marginTop: resp(0),
    width: resp(415),
    height: resp(75),
    flexDirection: 'row',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 2,
      width: 5,
    },
    elevation: 0,
  },
  CartValueContainer: {
    margin: resp(5),
    marginLeft: resp(10),
    width: resp(150),
    height: resp(70),
    flex: 0.5,
    flexDirection: 'column',

    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 2,
      width: 5,
    },
    elevation: 0,
  },
  CartItemContainer: {
    flex: 0.5,
    height: resp(22),
    width: resp(130),
    margin: resp(5),
    flexDirection: 'row',
  },
  CartItemTextStyle: {
    width: resp(80),
    height: resp(18),
    fontSize: 15,
    color: '#2B2B2B',
  },
  CartValueTextStyle: {
    marginLeft: resp(20),
    width: resp(20),
    height: resp(18),
    fontWeight: 'bold',
    fontSize: 15,
    color: '#2B2B2B',
  },
})
export default FliterScreen
