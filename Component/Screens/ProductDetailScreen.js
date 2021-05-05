import React from 'react';
import { Dimensions, FlatList, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AppConst from '../Component/AppConst';
import AppImageSlider from '../Component/AppImageSlider';
import Colors from '../Component/Colors';
import { backIconWhite,lessRoundBlackIcon,addRoundBlackIcon, } from '../Component/Images';
import Collapsible from 'react-native-collapsible';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage'
import resp from 'rn-responsive-font'
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {BASE_URL} from '../Component/ApiClient';
const screenWidth = Dimensions.get('screen').width;


export default class ProductDetailScreen extends React.Component {
    constructor(props) {
        super(props);
        // console.log('ProductDetails props ======',this.props.route.params.imageURL)
        this.AddCartProductCall = this.AddCartProductCall.bind(this),
      
     
        this.state = {
          baseUrl: `${BASE_URL}`,
          showFullImageView : false,
          viewMore : false,
          quantity:'',
          userNo:'',
          name:'',
          userName:'',
          currentQuantity:1,
          userAccessToken:'',
          price:'',
          totalPrice:'',
          product_id:'',
          userNameProduct:'',
          seller_id:'',
          fcmToken:'',
          imageList : [],
          itemOfProduct:'',
          nextId:'',
          myText:''
        }
        this.doubleClick = false;
        this.hidden = false;
    }
    onSwipe(gestureName, gestureState) {
      const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
      this.setState({gestureName: gestureName});
      switch (gestureName) {
        case SWIPE_UP:
          this.setState({backgroundColor: 'red'});
          break;
        case SWIPE_DOWN:
          this.setState({backgroundColor: 'green'});
          break;
        case SWIPE_LEFT:
          this.setState({backgroundColor: 'blue'});
          break;
        case SWIPE_RIGHT:
          this.setState({backgroundColor: 'yellow'});
          break;
      }
    }
     componentDidMount(){
      AsyncStorage.getItem('@fcmtoken').then((token) => {
        console.log("Edit user id token=" +token);
        if (token) {
          this.setState({ fcmToken: token });
         
        }
      });
      AsyncStorage.getItem('@access_token').then((accessToken) => {
        if (accessToken) {
          this.setState({ userAccessToken: accessToken });
          console.log("Edit access token ====" + accessToken);
          //this.RecentUpdateCall();
          // let imageURl=this.state.imageList;
          // // let nameId=this.props.route.params.name
          // // this.setState({userNameProduct:nameId})
          // let item=this.props.route.params.imageURL;
          // item.map((items,index)=>{
          //   imageURl.push(items.image)
          // });
          // this.setState({imageList:imageURl});
          // console.log('image URl',imageURl)
        }
      });
      AsyncStorage.getItem('@user_id').then((userId) => {
        // console.log("Product data",JSON.stringify(this.props.route.params.whole_data));
        // console.log('seller id',this.props.route.params.seller_id);
        // this.setState({itemOfProduct:this.props.route.params.whole_data});
        // // this.setState({name:this.props.route.params.whole_data.name});
        // //  this.setState({seller_id:this.props.route.params.seller_id});
        // this.setState({price:this.props.route.params.whole_data.price});
        if (userId) {
            this.setState({ userNo: userId });
            console.log(" id from login  user id ====" + userId);
        }else{
          console.log("else is executed");
        }
    });

    AsyncStorage.getItem('@user_name').then(userName => {
      if (userName) {
        this.setState({userName: JSON.parse(userName)})
        console.log('username   ====' + this.state.userName)
         this.addViewAPI();
      
      }
    });
     }
     lessTheQuantity=()=>{
       if(this.state.currentQuantity!=1){
         this.setState({currentQuantity:this.state.currentQuantity-1},()=>{
           let price_items=this.state.price*this.state.currentQuantity;
          let finalPrice= (Math.round(price_items * 100) / 100).toFixed(2);
           this.setState({totalPrice:finalPrice});
         });
       }
     }
     addTheQuantity=()=>{
       if(this.state.currentQuantity!=0){
         this.setState({currentQuantity:this.state.currentQuantity+1},()=>{
          let price_items=this.state.price*this.state.currentQuantity;
          let finalPrice= (Math.round(price_items * 100) / 100).toFixed(2);
           this.setState({totalPrice:finalPrice});
        });
       }
     }
     onSwipeUp(gestureState) {
     this.props.navigation.goBack()
    }
    onImageClick(item)
    {
      if (this.doubleClick) 
      {
        let imageArr=[];
        imageArr.push(item);
        
          this.props.navigation.navigate('ProductDetailImageFullView',{images:item})
      //  this.setState({showFullImageView : !this.state.showFullImageView})
      }
      else
      {
          this.doubleClick = true;
          setTimeout(() => {
            this.doubleClick = false;
        }, 800);
      }
    }

    renderInnerImageList(item, index, separators)
    {
     return(
       <TouchableOpacity style={{flex:1}} activeOpacity={1} onPress={ () =>this.onImageClick(item)}>
             <Image style={styles.imageView} source={{uri:item}}/>
        </TouchableOpacity>
      )
    }
    addViewAPI=()=>{
      let formData = new FormData()
    
      formData.append('user_id', this.state.userNo)
      // this.props.route.params.id
      formData.append('product_id',this.props.route.params.id)

      console.log('form data==' + JSON.stringify(formData))
    
      var AddCartProductUrl =`${BASE_URL}api-product/add-views`
    
      console.log('Add Card Url:' + AddCartProductUrl)
      fetch(AddCartProductUrl, {
        method: 'Post',
        headers: {
          'Content-Type': 'multipart/form-data',
          device_id: '1234',
          device_token: this.state.fcmToken,
          device_type: 'android',
          Authorization: JSON.parse(this.state.userAccessToken),
        },
        body: 
        formData,
      })
        .then(response => response.json())
        .then(responseData => {
          if (responseData.code == '200') {
            let nameId=responseData.data.name
            this.setState({userNameProduct:nameId,itemOfProduct:responseData.data,name:responseData.data.name,seller_id:responseData.data.seller_id,price:responseData.data.price})
            // this.setState({itemOfProduct:responseData.data});
            // this.setState({name:responseData.data.name});
            //  this.setState({seller_id:responseData.data.seller_id});
            // this.setState({price:responseData.data.price});
            let imageURl=[];
            let price_items=responseData.data.price*this.state.currentQuantity;
            let finalPrice= (Math.round(price_items * 100) / 100).toFixed(2);
             this.setState({totalPrice:finalPrice});
            if(responseData.data.image.length>0){
              let item=responseData.data.image;
              item.map((items,index)=>{
                imageURl.push(items.file_url)
              });
              this.setState({imageList:imageURl});
            }
            this.setState({nextId:responseData.data.prev})
        console.log(JSON.stringify(responseData));
    
          } else {
           
            console.log(responseData.message)
    
          }
    
           console.log('response object:', responseData)
          // console.log('User user ID==' + responseData.data.userid)
          // console.log('access_token ',responseData.data.access_token)
          // console.log('Profile ID===== ',responseData.data.id)
         
        })
        .catch(error => {
        //  this.hideLoading();
          console.error(error)
        })
    
        .done()
    }
    AddToCart(){
      this.AddCartProductCall();
     }
  
    AddCartProductCall() {
      let formData = new FormData()
    
      formData.append('user_id', this.state.userNo)
    
      formData.append('product_id',this.props.route.params.id)
      formData.append('quantity', this.state.currentQuantity)
      formData.append('price',  this.state.price)
      formData.append('seller_id',this.state.seller_id)

      console.log('form data==' + JSON.stringify(formData))
    
      var AddCartProductUrl =`${BASE_URL}api-product/add-cart`
    
      console.log('Add Card Url:' + AddCartProductUrl)
      fetch(AddCartProductUrl, {
        method: 'Post',
        headers: {
          'Content-Type': 'multipart/form-data',
          device_id: '1234',
          device_token: this.state.fcmToken,
          device_type: 'android',
          Authorization: JSON.parse(this.state.userAccessToken),
        },
        body: 
        formData,
      })
        .then(response => response.json())
        .then(responseData => {
        
          if (responseData.code == '200') {
          // Toast.show(responseData.message);
            // this.props.navigation.navigate('CartScreen');
            //this.setState({ProfileData:responseData.data})
            alert("Product is successfully added into the cart");
        console.log(JSON.stringify(responseData));
    
          } else {
           
            console.log(responseData.message)
    
          }
    
           console.log('response object:', responseData)
          // console.log('User user ID==' + responseData.data.userid)
          // console.log('access_token ',responseData.data.access_token)
          // console.log('Profile ID===== ',responseData.data.id)
         
        })
        .catch(error => {
        //  this.hideLoading();
          console.error(error)
        })
        .done()
    }
    singleProductPlaceOrder = () => {
      let formData = new FormData();
      formData.append('user_id', this.state.userNo);
      formData.append('seller_id', this.state.seller_id);
      formData.append('type',1)
      formData.append('product_id',this.props.route.params.id)
      formData.append('quantity', this.state.currentQuantity)
      formData.append('price',  this.state.price)
     
      console.log('form data==' + JSON.stringify(formData));  
  
      var PalceOderUrl =`${BASE_URL}api-product/place-order`
      // var PalceOderUrl = "https://www.cartpedal.com/frontend/web/api-product/place-order"
      console.log('placeOder:' + PalceOderUrl)
      fetch(PalceOderUrl, {
        method: 'Post',
        headers: new Headers({
          'Content-Type': 'multipart/form-data',
          device_id: '11111',
          device_token:this.state.fcmToken,
          device_type: 'android',
          // Authorization: 'Bearer' + this.state.access_token,  
          Authorization: JSON.parse(this.state.userAccessToken),
  
        }),
        body: formData,
      })
  
        .then(response => response.json())
        .then(responseData => {
          if (responseData.code == '200 ') {
            //  this.props.navigation.navigate('StoryViewScreen')
          //  Toast.show("Order is placed successfully");
           alert('Order is placed successfully');
            // this.props.navigation.navigate('DashBoardScreen');
            // this.setState({CartListProduct:responseData.data})
            // this.SaveProductListData(responseData)
            }
          // else if (responseData.code == '500') {
          //   //Toast.show(responseData.message)
          // }
  
          else {
            // alert(responseData.data);
            // alert(responseData.data.password)
  
          }
  
          console.log('response object:', responseData)
          console.log('User user ID==', JSON.stringify(responseData))
          // console.log('access_token ', this.state.access_token)
          //   console.log('User Phone Number==' + formData.phone_number)
        })
        .catch(error => {
          this.hideLoading();
          console.error(error)
        })
  
        .done()
  
    }
 
  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };
    return (
      <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={'#fff'} />
        <View style={[styles.container,{backgroundColor:'#e3e3e3'}]}>
        <GestureRecognizer
        onSwipe={(direction, state) => this.onSwipe(direction, state)}
        onSwipeUp={(state) => this.onSwipeUp(state)}
        config={config}
        style={{
          flex: 1,
          backgroundColor: this.state.backgroundColor
        }}
        >
        <AppImageSlider
            sliderImages={this.state.imageList}
            rendorImages={(item, index) => this.renderInnerImageList(item, index)}
        />
        </GestureRecognizer>
        </View>
        {(!this.state.showFullImageView)?
        <View style={{backgroundColor:'white',borderTopStartRadius:30,borderTopEndRadius:30,marginTop:-50}}>

          <View style={{height:7,width:50,backgroundColor:'#e3e3e3',alignSelf:'center',marginTop:10,marginBottom:20,borderRadius:4}}/>

          <View style={{flexDirection:'row',marginStart :30}}>
            <Text style={styles.detailTextStyle}>{AppConst.rupeeSym}{this.state.price},</Text>
            <Text style={styles.detailTextStyle}>Bunch Price {this.state.price} x {this.state.currentQuantity} = {AppConst.rupeeSym}{this.state.totalPrice}</Text>

          </View>
          <View style={{flexDirection:'row',marginStart :30,marginTop:10,marginBottom:10}}>
            <Text style={styles.detailTextStyle}>{this.state.name}</Text>

            <Text style={[styles.detailTextStyle,{marginStart:10}]}>Quantity</Text>
            <TouchableOpacity onPress={this.lessTheQuantity} >
                <Image style={styles.addLessIcon} source={lessRoundBlackIcon}/>
             </TouchableOpacity>
               <Text style={styles.detailTextStyle}>{this.state.currentQuantity}</Text>
             <TouchableOpacity onPress={this.addTheQuantity} >
                <Image style={styles.addLessIcon} source={addRoundBlackIcon} />
             </TouchableOpacity>


            <TouchableOpacity onPress={() => {this.setState({viewMore : !this.state.viewMore})}} >
                <Text style={[styles.detailTextStyle,{color:'#FFDF00',marginStart:10}]}>{this.state.viewMore? 'View less' : 'View more'}</Text>
             </TouchableOpacity>
          </View>


          <Collapsible collapsed={!this.state.viewMore}>
            <View style={{height: 50,backgroundColor:'#fff'}}>
        <Text style={{color:'black',marginLeft:30,marginTop:10}}>{this.state.itemOfProduct.description}</Text>
            </View>
          </Collapsible>          

          <View style={{flexDirection:'row',}}>
           
             <TouchableOpacity style={[styles.bottomButtonStyle,{backgroundColor:'white'}]}
              onPress={() => {
                this.AddToCart()}}>
                <Text style={styles.bottomButtonTextStyle}>{AppConst.btnTitleAddToCart}</Text>
             </TouchableOpacity>

             <TouchableOpacity style={[styles.bottomButtonStyle,{backgroundColor:Colors.themeRed}]} onPress={this.singleProductPlaceOrder}>
                <Text style={[styles.bottomButtonTextStyle,{color:'white'}]}>{AppConst.btnTitleBuyNow}</Text>
             </TouchableOpacity> 

          </View>  
       
        </View>:null}
        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{position: 'absolute',start : 20,top: 30,}}>
            <Image  source={require('../images/back_blck_icon.png')} style={styles.backIcon}/>
        </TouchableOpacity>
        <View style={{position: 'absolute',top: 30,start:100}}>
             <Text style={styles.TitleStyle}>{this.state.userNameProduct}</Text>
             </View>
             {/* <GestureRecognizer
        onSwipe={(direction, state) => this.onSwipe(direction, state)}
        onSwipeUp={(state) => this.onSwipeUp(state)}
        config={config}
        style={{
          flex: 1,
          backgroundColor: this.state.backgroundColor
        }}
        >
        <Text>{this.state.myText}</Text>
        <Text>onSwipe callback received gesture: {this.state.gestureName}</Text>
      </GestureRecognizer> */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer : {
    flex : 1,
    backgroundColor : '#fff'
  },
  container:{
    flex:1,
  },
  bottomButtonStyle: {
    flex: 1,
    height: 60,
    justifyContent:'center',
    elevation: 20
  },
  bottomButtonTextStyle: {
    fontSize : 15,
    fontWeight :'bold',
    textAlign :'center',
  },
  SearchContainer: {
    flex: 0.2,
   
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
    
    alignItems: 'center',
    justifyContent: 'center',
  },
  TitleStyle: {

    color:'#fff',
 
    fontSize:resp(20),
  },
  LogoIconStyle: {
    margin: 5,
    height: 30,
    width: 30,
  },
  detailTextStyle : {
    fontSize : 15,
    // fontWeight :'bold',
    textAlign :'center',

  },
  BackButtonContainer: {
    flex: 0.2,
    marginLeft: 10,
   
  },
  backButtonStyle: {
    margin: 10,
    height: 20,
    width: 20,
  },
  saveCancelButton: {
    fontSize:17,
    borderBottomWidth : 1,    
  },
  headerView: {
    flex: 0.1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    elevation: 20,
  },
  backIcon : {
      height : 20,
      width : 35,
      resizeMode:'contain',
   },
   addLessIcon : {
    height : 20,
    width : 20,
    marginStart:5,marginEnd:5,
    resizeMode:'contain',
   },
   imageView : {
    flex:1,
    borderRadius : 5,
    width : screenWidth,
    height : screenWidth,
  },
  inputTextView : {
      fontSize:17,
      borderBottomColor : '#e3e3e3',
      borderBottomWidth : 1,
      marginTop: 10
  }

});
