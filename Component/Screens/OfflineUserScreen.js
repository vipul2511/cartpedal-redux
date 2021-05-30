import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const OfflineUserScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.parent}>
      <Text>You Are Offline </Text>
      <Text onPress={() => navigation.navigate('ChatScreen')}>
        Move To Chat Section
      </Text>
    </View>
  );
};

export default OfflineUserScreen;

const styles = StyleSheet.create({
  parent: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
