import { Button, Text, View, StyleSheet } from "react-native";
import React, { useEffect } from "react";
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
  useEffect(() => {
    //TODO Config 1: Paste Package name from "Settings > Connect SDK" in Dashboard.
    Flyy.setPackageName('');
    //TODO Config 2: Paste Partner Id from "Settings > SDK Keys" in Dashboard.
    Flyy.initSDK('', Flyy.STAGE);
    Flyy.setUser('test_user_1');
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
          //TODO Step 1: Navigate to Offers Page
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
          //TODO Step 2: Send purchase Event
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