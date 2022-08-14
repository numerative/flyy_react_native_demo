import { Button, Text, View, StyleSheet } from "react-native";
import React, {useEffect} from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Flyy from 'react-native-flyy';
import messaging from '@react-native-firebase/messaging';

const Stack = createNativeStackNavigator();

messaging().setBackgroundMessageHandler(async remoteMessage => {
  if (
    remoteMessage != null &&
    remoteMessage.data != null &&
    remoteMessage.data.notification_source != null &&
    remoteMessage.data.notification_source === 'flyy_sdk'
  ) {
    Flyy.handleNotification(JSON.stringify(remoteMessage.data));
  }
});

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

const MyStack = () => {
  useEffect(()=>{
    Flyy.setPackageName('com.example.flyyxintegration');
    Flyy.initSDK('35299df860c15c0449c8', Flyy.STAGE);
    Flyy.setUser('react_user_02');
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (
        remoteMessage != null &&
        remoteMessage.data != null &&
        remoteMessage.data.notification_source != null &&
        remoteMessage.data.notification_source === 'flyy_sdk'
      ) {
        Flyy.handleNotification(JSON.stringify(remoteMessage.data));
      }
    });
    return unsubscribe;
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home' }}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ title: 'Cart' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MyStack;

const HomeScreen = ({ navigation }) => {
  return (
    <
      View
      style={styles.container}>
      <Button
        title="Offers"
        style={styles.button}
        onPress={() => {
          Flyy.openOffersScreen();
        }}
      />
      <View
        style={styles.space} />
      <Button
        title="Open Cart"
        onPress={() => {
          navigation.navigate('Cart');
        }}
      />
    </View>
  );
}

const CartScreen = ({ navigation }) => {
  return (
  <View
    style={styles.container}>
    <Button
      title="Checkout"
      onPress={() => {
        Flyy.sendEvent('purchase', 'true');
       }}
    />
  </View>
  );
}

const styles = StyleSheet.create({
  space: {
    height: 16
  },
  button: {
    color: 'deepskyblue',
  },
  container: {
    alignItems: 'center',
    margin: 24,
    justifyContent: 'center',
    flex: 1
  }
});