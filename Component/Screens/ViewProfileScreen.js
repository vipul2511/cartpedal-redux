import React, {Component} from 'react'
console.disableYellowBox = true

import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'
import resp from 'rn-responsive-font'
import {SliderBox} from 'react-native-image-slider-box'


class ViewProfileScreen extends Component{
    constructor (props) {
        super(props)
        this.state = {
            images: 
            this.props.route.params.images,
              height:500
        }
        console.log(this.props.route.params.images);
    }
    componentDidMount(){
      if(this.props.route.params){
        if(this.props.route.params.profileScren=='1'){
          this.setState({height:200})
        }
      }
    }
    render () {
        return (
          <SafeAreaView style={styles.container}>
          <TouchableOpacity style={styles.CloseButtonContainerStyles}
          onPress={() => {
            this.props.navigation.goBack()
          }}>
          <Image
                source={require('../images/red_close_icon.png')}
                style={styles.CloseButtonViewStyles}
              />
          </TouchableOpacity>
            <View style={styles.ImageContainer}>
             <SliderBox
                images={this.state.images}
                style={[styles.sliderImageStyle,{width:'99%',height: resp(this.state.height),}]}></SliderBox>
                </View>
          </SafeAreaView>
        )
      }
}

const styles=StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
      },
      CloseButtonContainerStyles: {
          marginTop:resp(30),
          marginRight:resp(50),
        flex: 0.1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        backgroundColor: '#fff',
        
      },
      CloseButtonViewStyles:{
        marginRight:resp(20),
            width:resp(36.1),
            height:resp(36.1),
      },
      ImageContainer:{
          flex:0.75
      },
      sliderImageStyle: {
          marginTop:resp(100),
          alignContent:'center',
          alignItems:'center',
          alignSelf:'center',
       
      },
})
export default ViewProfileScreen;