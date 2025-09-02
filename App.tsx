
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { I18nManager, StyleSheet, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import HomeTab from './src/screens/HomeTab';
import DrugStoreTab from './src/screens/DrugStoreTab';
import Icon from '@react-native-vector-icons/material-design-icons';
const Tab = createBottomTabNavigator();
import BootSplash from "react-native-bootsplash";
import { useEffect, useState } from 'react';
import { useNetInfo } from "@react-native-community/netinfo";
import CameraTab from './src/screens/CameraTab';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';


// function onMessageReceived(message: any) {
//   console.log("message", message)
//   notifee.displayNotification(JSON.parse(message.data.notifee));
// }

// async function onMessageReceivedAsync(message: any) {
//   console.log("message", message)
//   notifee.displayNotification(JSON.parse(message.data.notifee));
// }

// messaging().onMessage(onMessageReceived);
// messaging().setBackgroundMessageHandler(onMessageReceivedAsync);

I18nManager.forceRTL(true);
I18nManager.allowRTL(true);
function App() {
  const isDarkMode = useColorScheme() === 'dark';
  useEffect(() => {
    BootSplash.hide({ fade: true })
    onAppBootstrap()

  }, [])

  const [channelId, setChannelId] = useState("")

  useEffect(() => {

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log("Foreground message received:", remoteMessage);
      const data = remoteMessage.notification
      notifee.displayNotification({
        title: data?.title, body: data?.body, android: {
          channelId,
          // pressAction is needed if you want the notification to open the app when pressed
          pressAction: {
            id: 'default',
          },
        },
      });
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      const data = remoteMessage.notification
      notifee.displayNotification({
        title: data?.title, body: data?.body, android: {
          channelId,
          // pressAction is needed if you want the notification to open the app when pressed
          pressAction: {
            id: 'default',
          },
        },
      });
    });

    return unsubscribe;
  }, [channelId]);


  async function onAppBootstrap() {
    // Register the device with FCM
    await messaging().registerDeviceForRemoteMessages();

    // Get the token
    const token = await messaging().getToken();
    console.log("token:", token)

    await notifee.requestPermission()

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });
    setChannelId(channelId)

    // Save the token
    // await postToApi('/users/1234/tokens', { token });
  }

  const netinfo = useNetInfo();

  useEffect(() => {
    console.log(netinfo)
  }, [netinfo])


  const linking = {
    prefixes: [
      "app12://"
    ],
    config: {
      screens: {
        DrugStoresTab: 'DrugStores',
        DrugStoreDetailScreen: 'DrugStore/:id',
      },
    },
  };



  return (

    <NavigationContainer linking={linking}>

      <Tab.Navigator>
        <Tab.Screen name="HomeTab"
          component={HomeTab}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (<Icon name="home" size={size} color={color} />)
          }}
        />
        <Tab.Screen name="CameraTab" component={CameraTab}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (<Icon name="camera" size={size} color={color} />)
          }} />
        <Tab.Screen name="DrugStoresTab" component={DrugStoreTab}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (<Icon name="heart" size={size} color={color} />)
          }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btn: {
    backgroundColor: '#ccc',
    padding: 10
  },
});

export default App;
