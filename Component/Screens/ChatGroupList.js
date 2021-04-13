import React from 'react';
import { Dimensions, FlatList, Image, SafeAreaView,Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View,SectionList } from 'react-native';
import AppConst from '../Component/AppConst';
import AppImageSlider from '../Component/AppImageSlider';
import { moreIcon, searchIcon,contactIcon,tickIcon,untickIcon,submitIcon } from '../Component/Images';
import AppHeader from '../Component/AppHeader';
import Menu, { MenuItem } from 'react-native-material-menu';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast'
import resp from 'rn-responsive-font'
import Spinner from 'react-native-loading-spinner-overlay';

const screenWidth = Dimensions.get('screen').width;


export default class AddGroupMember extends React.Component {
    constructor(props) {
        super(props);
        this.ContactListall=this.ContactListall.bind(this),
        this.state = {
            isAllContactSelect: true,
            userAccessToken:'',
            userId:'',
            currentUserMobile:'',
            contactList:'',
            isAllPublicGrpSelect:true,
            selectAll:'',
            boxname:false,
            nameBox:'',
            data:[],
            AllContact:'',
            selectednumber:[],
            phoneNumber:'',
            ServercontactList:[],
            numberArr:[],
            product_id:'',
            appContacts:'',
            fcmtoken:'',
            nameArrState:[],
            nameDisplayBox:'',
            nameAppcontacts:'',
            showSearch:true,
            masterlist:'',
            Name:'',
            isEditModalVisible:false,
            groupData:[],
            screenName:'',
            groupID:'',
            newImageArr:''
            
        }

        let param = this.props.route.params;
        if(param && param.images)
        {
            this.state.imageList = param.images;
        }    
     }
     showLoading() {
      this.setState({ spinner: true });
    }
  
    hideLoading() {
      this.setState({ spinner: false });
    }
     componentDidMount(){
        this.showLoading();
      console.log('props of screen',JSON.stringify(this.props))
      if(this.props.route.params && this.props.route.params.screenName){
        this.setState({screenName:this.props.route.params.screenName});
        this.setState({groupID:this.props.route.params.groupid})
      }
      AsyncStorage.getItem('@fcmtoken').then(token => {
        if (token) {
          this.setState({fcmtoken: JSON.parse(token)})
          console.log('device fcm token ====' + this.state.fcmtoken);
        }
      });
      AsyncStorage.getItem('@groupData').then((groupData)=>{
        if(groupData){
            let groupItem=this.state.groupData;
            if(groupItem!==undefined&&groupItem.length>1){
            groupItem.concat(JSON.parse(groupData));
            this.setState({groupData:groupItem})
            console.log(' state groupData',this.state.groupData)
            }else{
              groupItem=JSON.parse(groupData)
              this.setState({groupData:groupItem})
              console.log(' push groupData',this.state.groupData)
            }
        }
      })
      AsyncStorage.getItem('@product_id').then((id)=>{
        if(id){
        this.setState({product_id:id});
        }
      });
       AsyncStorage.getItem('@current_usermobile').then((mobile)=>{
       if(mobile){
         this.setState({currentUserMobile:JSON.parse(mobile)});
         console.log('mobile number ',this.state.currentUserMobile);
       }
       });
       AsyncStorage.getItem('@Phonecontacts').then((phone)=>{
        if(phone){
          let phoneID=JSON.parse(phone)
          this.setState({phoneNumber:phoneID});
          console.log('phone',phoneID);
        }
      })
      AsyncStorage.getItem('@user_id').then((userId) => {
        if (userId) {
          this.setState({ userId: userId });
          console.log(" Edit user id ====" + this.state.userId);
          // this.ProductListCall()
        }
      });
      AsyncStorage.getItem('@access_token').then((accessToken) => {
        if (accessToken) {
          this.setState({ userAccessToken: accessToken });
          console.log("Edit access token ====" + this.state.userAccessToken);
         this.ContactListall();
        //  this.sendContactToServer();
        }
      });
      setTimeout(() => {
        this.hideLoading()
      }, 3000);
     }
     sendContactToServer=(contact)=>{
      //  let item="8290054410,+919772129947,9828544044,+919079947710"
      let formData = new FormData()
  
      formData.append('user_id', this.state.userId);
      formData.append('type', 1);
      formData.append('contacts',this.state.phoneNumber);
      console.log('form data==' + JSON.stringify(formData))
  
      // var CartList = this.state.baseUrl + 'api-product/cart-list'
      var EditProfileUrl = "http://www.cartpedal.com/frontend/web/api-product/contact-list"
      console.log('Add product Url:' + EditProfileUrl)
      fetch(EditProfileUrl, {
        method: 'Post',
        headers:{
          'Content-Type': 'application/json',
          device_id: '1234',
          device_token: this.state.fcmtoken,
          device_type: 'android',
          Authorization:JSON.parse(this.state.userAccessToken),
        },
        body:JSON.stringify({
          user_id:this.state.userId,type:0,lfor:1,contacts:this.state.phoneNumber
        }),
      })
        .then(response => response.json())
        .then(responseData => {
          //   this.hideLoading();
          if (responseData.code == '200') {
            Toast.show(responseData.message);
           let serverContacts= Object.values(responseData.data.contact);
            this.setState({ ServercontactList: serverContacts});
            console.log(serverContacts);
          } else {
            console.log(responseData.data);
          }
          console.log('contact list server object:', JSON.stringify(responseData))
        })
        .catch(error => {
          //  this.hideLoading();
          console.error(error)
        })
        .done()
     }
     ContactListall() {
      let formData = new FormData()
  
      formData.append('user_id', this.state.userId);
      formData.append('type', 0);
      formData.append('contacts', this.state.currentUserMobile);
      console.log('form data==' + JSON.stringify(formData))
  
      // var CartList = this.state.baseUrl + 'api-product/cart-list'
      var EditProfileUrl = "http://www.cartpedal.com/frontend/web/api-product/contact-list"
      console.log('Add product Url:' + EditProfileUrl)
      fetch(EditProfileUrl, {
        method: 'Post',
        headers: {
          'Content-Type': 'application/json',
          device_id: '1234',
          device_token: this.state.fcmtoken,
          device_type: 'android',
          Authorization:JSON.parse(this.state.userAccessToken),
        },
        body:JSON.stringify({
          user_id:this.state.userId,type:0,lfor:1,contacts:this.state.phoneNumber
        }),
      })
        .then(response => response.json())
        .then(responseData => {
          //   this.hideLoading();
          if (responseData.code == '200') {
          //  Toast.show(responseData.message);
            this.setState({ contactList: responseData.data.appcontact });
            this.setState({masterlist:responseData.data.appcontact})
            let cartPadleContact=[]
            let nameofCartPadle=[]
            responseData.data.appcontact.map((item)=>{
            cartPadleContact.push(item.mobile);
            nameofCartPadle.push(item.name);
            })
            console.log('cart padle',cartPadleContact);
            this.setState({appContacts:cartPadleContact});
            this.setState({nameAppcontacts:nameofCartPadle});
          } else {
            console.log(responseData.data);
          }
  
          //console.log('Edit profile response object:', responseData)
          console.log('contact list response object:', JSON.stringify(responseData))
          // console.log('access_token ', this.state.access_token)
          //   console.log('User Phone Number==' + formData.phone_number)
        })
        .catch(error => {
          //  this.hideLoading();
          console.error(error)
        })
        .done()
    }
    boxname=(items,newItem)=>{
         console.log('items inisDE box name',items);
      if(typeof items.name =='string'){
        console.log('working',newItem)
      let nameArr=this.state.numberArr;
      let nameArray=this.state.nameArrState;
      if(this.state.numberArr.includes(newItem)){
        this.setState({numberArr:nameArr.filter(value=>value!==newItem)})
      }else{
        nameArr.push(newItem);
        this.setState({numberArr:nameArr});
      }
      if(this.state.nameArrState.includes(items)){
        this.setState({ nameArrState: nameArray.filter(item => item !== items)},()=>{
          let nameDisplay=this.state.nameArrState.join(',');
          this.setState({nameDisplayBox:nameDisplay});
        })
      }else{
        nameArray.push(items.name);
        this.setState({nameArrState:nameArray},()=>{
          let nameDisplay=this.state.nameArrState.join(',');
          this.setState({nameDisplayBox:nameDisplay});
        });  
      }
      let nameSingle=this.state.numberArr.join(',');
      this.setState({nameBox:nameSingle});
      }else{
        console.log('else executing');
        let nameArr=this.state.numberArr;
        let nameArray=this.state.nameArrState;
        if(this.state.numberArr.includes(newItem)){
          this.setState({numberArr:nameArr.filter(value=>value!==newItem)},()=>{
            this.numberUpdate()
          })
        }else{
          nameArr.push(newItem);
          this.setState({numberArr:nameArr},()=>{
            this.numberUpdate()
          });
        }
        if(this.state.nameArrState.includes(items)){
            console.log('items of include array',items);
          this.setState({ nameArrState: nameArray.filter(item => item !== items)},()=>{
           this.nameUpdate()
          })
        }else{
          nameArray.push(items);
          this.setState({nameArrState:nameArray},()=>{
            this.nameUpdate()
          });
        }
        // console.log('name arr else',nameArr);
        // console.log('number box',this.state.nameBox)
      }
    }
    numberUpdate=()=>{
        let nameSingle=this.state.numberArr.join(',');
        console.log('number arr',this.state.nameArrState)
        this.setState({nameBox:nameSingle});
    }
    nameUpdate=()=>{
        let nameDisplay=this.state.nameArrState.join(',');
        this.setState({nameDisplayBox:nameDisplay});
    }
    selection=(items)=>{
      console.log('selection value ',items);
      if(this.state.data.length>0){
        if(items.id&&items.name){
      this.setState({boxname:true},()=>{
        this.boxname(items.name,items.id);
      });
    }else{
      this.setState({boxname:true},()=>{
        this.boxname(items,items);
      });
    }
    }else{
      this.setState({boxname:false});
    }
    }
  selectItem = (value) => {
    console.log('value item from contact',value);
    let list = this.state.data;
    // this.setState({boxname:true});
    if(value.id){
    if (list != null) {
        if (this.state.data.includes(value.id)) {
          console.log('data mobile incude',value.id)
            this.setState({ data: list.filter(item => item !== value.id) }, () => {
              this.selection(value);
              // this.tickIcon(value);
              });
        } else{
          console.log('data mobile part',value.mobile)
            list.push(value.id)
            this.setState({ data: list }, () => {
              this.selection(value);
              this.tickIcon(value);
            });
        }
    }else{
     console.log('else')
    } 
  }else{
    if (this.state.data.includes(value)) {
      console.log('data value',value)
        this.setState({ data: list.filter(item => item !== value) }, () => {
          this.selection(value);
          // this.tickIcon(value);
          });
    } else{
      console.log('data part',value)
        list.push(value)
        this.setState({ data: list }, () => {
          this.selection(value);
          // this.tickIcon(value);
        });
    }
  }
  
}
    tickIcon=(items)=>{
        console.log('state data',this.state.data)
      let arra=this.state.data;
      // console.log('arra',arra);
      // console.log('items',items);
      let found=arra.some(item => item === items);
      // console.log('found',found);
      if(found){
      return(
        <View>
                <Image source={tickIcon} style={styles.tickIcon} />
        </View>
      )
      }else{
       return( <View>
            <Image source={untickIcon} style={styles.tickIcon} />
        </View>
       )
      }
    }
    listItem=()=>{
      let commentArr=[];
      commentArr.push(displayText);
      setNewArray(commentArr);
    }
    rendorContactItem(item, index, separators)
    {
      // console.log('conatct',item);
     return(
         <View style={{marginBottom:10}}>
        <View style={[styles.upperRowStyle]}>
            <Image source={contactIcon} style={styles.grouptIcon} />
            <TouchableOpacity style={{flex:1}}>
                <Text style={styles.rowTitle}>
                    {item}
                </Text>
                <Text style={styles.rowDetail}>
                    I just want to be appriciate
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={()=>{this.selectItem(item)}}        
            >
             {this.tickIcon(item)}
            </TouchableOpacity>
        </View>
           
        </View>
         )
    }
    rendorContactList(item, index, separators)
    {
      // console.log('conatcts',JSON.stringify(item));
     return(
         <View style={{marginBottom:10}}>
        <View style={[styles.upperRowStyle]}>
            <Image source={item.image?{uri:item.image}:contactIcon} style={styles.grouptIcon} />
            {item.name?(<TouchableOpacity style={{flex:1}}>
                <Text style={styles.rowTitle}>
                    {item.name}
                </Text>
                <Text style={styles.rowDetail}>
                  {item.mobile}
                </Text>
            </TouchableOpacity>):( <TouchableOpacity style={{flex:1}}>
                <Text style={styles.rowTitle}>
                    {item}
                </Text>
                <Text style={styles.rowDetail}>
                    I just want to be appriciate
                </Text>
            </TouchableOpacity>)}
            {item.name?(<TouchableOpacity
                onPress={()=>{this.selectItem(item)}}        
            >
             {this.tickIcon(item.id)}
            </TouchableOpacity>):(<TouchableOpacity
                onPress={()=>{this.selectItem(item)}}        
            >
             {this.tickIcon(item)}
            </TouchableOpacity>)}
            {/* <TouchableOpacity
                onPress={()=>{this.selection(item)}}        
            >
                {(item.id!==this.state.clickeduser_id)?
                <Image source={untickIcon} style={styles.tickIcon} />
                :<Image source={tickIcon} style={styles.tickIcon} />}
            </TouchableOpacity> */}
        </View>
           
        </View>
         )
    }
 
     searchFilterFunction = (text) => {
      // Check if searched text is not blank
      console.log('name',text);
      if (text) {
        // Inserted text is not blank
        // Filter the masterDataSource
        // Update FilteredDataSource
        const newData = this.state.contactList.filter(
          function (item) {
            const itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({contactList:newData});
      //   setFilteredDataSource(newData);
      //   setSearch(text);
      } else {
        // Inserted text is blank
        // Update FilteredDataSource with masterDataSource
      //   setFilteredDataSource(masterDataSource);
      //   setSearch(text);
      this.setState({contactList:this.state.masterlist});
      
      }
    };
    uploadProfilePic = (member) => {
      this.showLoading()
      let image;
      if(this.state.newImageArr==''){
       image=[]
      }else{
        image=this.state.newImageArr;
      }
      console.log('upload profile pic',this.state.newImageArr);
      console.log(
        'raw data====',
        JSON.stringify({  user_id: this.state.userId,
            type: 4,
            upload:image,
            groupid:this.state.groupID,
            member:member,
           }),
      )
      var EditProfileUrl =
        'http://www.cartpedal.com/frontend/web/api-message/update-group'
      console.log('Add product Url:' + EditProfileUrl)
      fetch(EditProfileUrl, {
        method: 'Post',
        headers: {
          'Content-Type': 'application/json',
          device_id: '1111',
          device_token: this.state.fcmToken,
          device_type: 'android',
          Authorization: JSON.parse(this.state.userAccessToken),
        },
        body: JSON.stringify({
          user_id: this.state.userId,
          type: 4,
          groupid:this.state.groupID,
          member:member,
          upload:image
        }),
      })
        .then(response => response.json())
        .then(responseData => {
          if (responseData.code == '200') {
            Toast.show('Members are added successfully')
            this.props.navigation.navigate('ChatScreen');  
            console.log('id',responseData);
                this.hideLoading()
          } else {
            // console.log(responseData.data)
            alert(responseData.message);
            this.hideLoading()
            // alert(responseData.data.password)
          }
          //console.log('Edit profile response object:', responseData)
          console.log('upload profile pic object:', JSON.stringify(responseData))
          // console.log('access_token ', this.state.access_token)
          //   console.log('User Phone Number==' + formData.phone_number)
        })
        .catch(error => {
          this.hideLoading()
          console.error(error)
        })
        .done()
    }
    CheckTextInput=()=>{
     
        if(this.state.Name!==''){
        let itemGroup=this.state.groupData;
        console.log('item group',itemGroup);
        let obj={
            name:this.state.Name,
            mobile:this.state.nameBox
        }
        itemGroup.push(obj);
        console.log('object value',obj);
        AsyncStorage.setItem('@groupData',JSON.stringify(itemGroup)).then(succ=>{
            this.props.navigation.goBack();
        });
    }else{
        // this.setState({isEditModalVisible:false});
        alert('Please Enter Group Name');
    }

    }
    closeModalbox= () =>{
        this.setState({isEditModalVisible: false})
      }
      FlatListItemSeparator = () => {
      return (
        //Item Separator
        <View style={styles.listItemSeparatorStyle} />
      );
    };
    submitGrp=()=>{
        console.log('number array',this.state.numberArr.join(','));
        console.log('length',this.state.numberArr.length);
       let modifiedArr= this.state.numberArr.join(',');
       let newArr=this.state.numberArr;
       newArr.push(this.state.userId);
      let idsofContacts=newArr.join(',');
        // let idsofContacts=modifiedArr.join(',')
        console.log('id of group memeber',idsofContacts);
        if(this.state.screenName=='GroupProfile'){     
        if(this.state.numberArr.length>0){
        // this.setState({isEditModalVisible:true})
        this.uploadProfilePic(modifiedArr)
        }else{
          alert('Please select atleast 1 contacts to add in a group');
        }
    }else{
      if(this.state.numberArr.length>1){
      this.props.navigation.navigate('ProvideGroupName',{id:idsofContacts});
      }else{
        alert('Please select atleast 2 contacts to create a group');
      }
    }
    }
  render() {
  
    return (
      <SafeAreaView style={styles.mainContainer}>
         <Spinner
          visible={this.state.spinner}
          color='#F01738'
          textStyle={styles.spinnerTextStyle}
        />
      <StatusBar barStyle="dark-content" backgroundColor={'#fff'} />
        {/* <View style={[styles.container]}> */}
      {this.state.showSearch? (<View style={styles.headerView}>
          {/* <View > */}
            <TouchableOpacity style={styles.BackButtonContainer}
              onPress={() => this.props.navigation.goBack()}>
              <Image
                source={require('../images/back_blck_icon.png')}
                style={styles.backButtonStyle}
              />
            </TouchableOpacity>
          {/* </View> */}
          <View style={styles.TitleContainer}>
         <TouchableOpacity
              style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.TitleStyle}>Add Participants</Text>
            </TouchableOpacity>
          </View>
          {/* {rigthMenu} */}
          <TouchableOpacity style={styles.SearchContainer} onPress={()=>{this.submitGrp()}}
           >
            <Image
              source={require('../images/rightProfileIcons.png')}
              style={styles.SearchIconStyle}
            />
          </TouchableOpacity>
        </View>):(
          <View style={styles.inputViewStyle}>
           
             <TouchableOpacity style={{marginLeft:2}}
              onPress={() => {this.setState({showSearch:true})}}>
              <Image
                source={require('../images/back_blck_icon.png')}
                style={styles.backButtonStyle1}
              />
            </TouchableOpacity>
            <View style={{backgroundColor: '#00000008'}}>
                     <TextInput
                            placeholder="Search"
                            placeholderTextColor="#BEBEBE"
                            underlineColorAndroid="transparent"
                            style={styles.input}
                            onChangeText={(text)=>{this.searchFilterFunction(text)}}
                        />
                        </View>
                        </View>
        )}
        <View style={{backgroundColor:'white',paddingTop:50}}>
        {/* <TouchableOpacity onPress={()=>{
            AsyncStorage.removeItem('@groupData')
            console.log(this.state.nameBox)}}
            style={styles.selectAllBtn}
        >
            <Text style={{textAlign:'center',fontSize:16}}>Select All</Text>
        </TouchableOpacity> */}
        </View>
       
         
          <View style={{flex:1}}>
           
            <FlatList
                data={this.state.contactList}
                keyExtractor={item => item.StoryImage}
                renderItem={({item,index}) => (this.rendorContactList(item,index))}
            /> 
            
      </View> 
      <Modal
              animationType='slide'
              transparent={true}
              visible={this.state.isEditModalVisible}
              onRequestClose={() => {
                this.closeModalbox()
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TouchableOpacity
                    style={{alignSelf: 'flex-end'}}
                    onPress={() => {
                      this.closeModalbox()
                    }}>
                    <Image
                      source={require('../images/modal_close.png')}
                      style={styles.CloseButtonStyle}
                    />
                  </TouchableOpacity>

                  <View style={styles.inputView}>
                    <View style={{flexDirection: 'row', marginLeft: 15}}></View>

                    <TextInput
                      placeholder='Enter Group Name'
                      placeholderTextColor='#7F7F7F'
                      underlineColorAndroid='transparent'
                      multiline={true}
                     maxLength={25}
                      value={this.state.Name}
                      style={styles.input}
                      onChangeText={Name => this.setState({Name: Name})}
                    />
                  </View>
                  <View style={styles.ButtonContainer}>
                    {/* <View style={styles.EmptyButtonCOntainer}></View>  */}
                    <TouchableOpacity
                      style={styles.YesButtonContainer}
                      // isVisible={this.state.isEditModalVisible}
                      onPress={this.CheckTextInput}>
                      <Text style={styles.YesTextStyle}>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.NoButtonContainer}
                      //  isVisible={this.state.isEditModalVisible}
                      onPress={() =>
                        this.setState({isEditModalVisible: false})
                      }>
                      <Text style={styles.NoTextStyle}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
         { this.state.boxname==true?( <View  style={{backgroundColor:'white',marginTop:0,paddingTop:20,paddingBottom:60}}>
          <View style={{position:'absolute',height:60,width:'100%', bottom:0,backgroundColor:'#8a1008',justifyContent:'center'}}>
                    <Text style={{color:'white',marginStart:20,marginEnd:20}} numberOfLines={1} > {'>'} {this.state.nameDisplayBox} </Text>

            </View>
        </View>):null}
        
        {/* </View> */}
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
    // flex:0.2,
    // marginTop:20,
    backgroundColor:'#e3e3e3'
  },
    input: {
        color: 'black',
       
        padding: 10,
        textAlign: 'left',
      }, 

  inputViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#00000008',
    backgroundColor: '#fff',
    width: '100%',
    marginTop: resp(20),
   alignContent:'center',
   alignSelf:'center',
},
CloseButtonStyle: {
  
    alignSelf: 'flex-end',
  },
  header : {
    width : '100%',
    height : 50,
    padding:10,
    flexDirection :'row',
    justifyContent:'center'
  },
  listItemSeparatorStyle: {
    height: 0.5,
    width: '100%',
    backgroundColor: '#C8C8C8',
  },
  SearchContainer: {
    flex: 0.2,
    backgroundColor: '#fff',
  },
  inputView: {
    width: '90%',

    alignSelf: 'center',
    borderColor: '#7F7F7F',
    borderBottomWidth: 1,
  },
  ButtonContainer: {
    height: resp(50),
    marginTop: resp(20),
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  YesButtonContainer: {
    flex: 0.4,
    marginHorizontal: resp(10),
   
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 10,
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
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  SearchIconStyle: {
    margin: 5,
    marginRight: 20,
    height: 25,
    width: 25,
    alignSelf: 'flex-end',
  },
  headerView: {
    flex: 0.1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 20,
  },
  BackButtonContainer: {
    flex: 0.2,
    backgroundColor: 'white',
  },
  backButtonStyle1:{
    margin: 15,
    height: 20,
    width: 20,
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
  TitleContainer: {
    flexDirection: 'row',
    flex: 0.6,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon : {
      height : 35,
      width : 35,
      resizeMode:'contain',
   },

   imageView : {
    borderRadius : 5,
    width : screenWidth,
    height : screenWidth,
  },
  inputTextView : {
      fontSize:15,
      borderBottomColor : '#e3e3e3',
      borderBottomWidth : 1,
      marginTop: 10
  },
  searchMenuIcon:{
    height : 30,
    width : 30,
    resizeMode:'contain',
    marginEnd:5
  },
  moreMenuIcon: {
      height : 25,
      width : 30,
      resizeMode:'contain',
      // marginLeft:55,
      // position:'absolute'
  },
  selectAllBtn : {
    backgroundColor:'#e3e3e3',width:100,padding:5,borderRadius:30,alignSelf:'flex-end',marginEnd:20
  },
  contactIcon : {
    height:40,width:40,resizeMode:'contain',borderRadius:5
  },
  grouptIcon :{
    height:45,width:45,resizeMode:'contain',borderRadius:5

  },
  rowTitle :{
      fontSize:16,
      marginStart:10,
  },
  rowDetail :{
    fontSize:13,
    marginStart:10,
    color:'gray'
  },
  tickIcon :{
    height:25,width:30,resizeMode:'contain',borderRadius:5
  },
  upperRowStyle:{
    flexDirection:'row',alignItems:'center',paddingStart:20,paddingEnd:20
  },
  submitIcon: {
    height:55,width:55,resizeMode:'contain',
  }

});
