/* eslint-disable no-alert */
import React, {Component} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import Menu, {MenuItem} from 'react-native-material-menu';

export default class ImageSelectDialog extends Component {
  constructor(props) {
    super();
    this.state = {};
  }

  showMenu = () => {
    this._menu.show();
  };
  hideMenu = () => {
    this._menu.hide();
  };

  componentWillUnmount() {}

  openCamera() {
    this.hideMenu();
    ImagePicker.openCamera({
      cropping: true,
      includeBase64: true,
    })
      .then((image) => {
        this.onImagePick(image);
        console.log('picimage===', image);
      })
      .catch((error) => {
        alert('eror', error);
      });
  }

  openCameraCoverPhoto() {
    this.hideMenu();
    ImagePicker.openCamera({
      width: 420,
      height: 220,
      cropping: true,
      includeBase64: true,
    }).then((image) => {
      this.onImagePick(image);
      console.log('picimage===', image);
    });
  }

  openGalleryCoverPhoto() {
    this.hideMenu();
    ImagePicker.openPicker({
      width: 420,
      height: 220,
      cropping: true,
      includeBase64: true,
    })
      .then((image) => {
        this.onImagePick(image);
      })
      .catch((error) => {});
  }

  openGallery() {
    this.hideMenu();
    ImagePicker.openPicker({
      cropping: true,
      includeBase64: true,
    })
      .then((image) => {
        this.onImagePick(image);
        console.log('pickimage==', image);
      })
      .catch((error) => {});
  }

  onImagePick(response) {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      const source = {uri: response.uri};
      this.props.onImagePick(response);
      this.setState({
        avatarSource: source,
      });
    }
  }

  render() {
    return (
      <Menu ref={(ref) => (this._menu = ref)}>
        <MenuItem
          onPress={() => {
            this.openCamera();
          }}>
          {'Camera'}
        </MenuItem>
        <MenuItem
          onPress={() => {
            this.openGallery();
          }}>
          {'Gallery'}
        </MenuItem>
        <MenuItem
          onPress={() => {
            this.hideMenu();
            this.props.navigation.navigate('ProductListScreen', {
              screenPer: 'ImageHome',
            });
          }}>
          {'Product Master'}
        </MenuItem>
      </Menu>
    );
  }
}
