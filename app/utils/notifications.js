import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// ask for notification permissions (called once on app load)
export async function requestLocalNotificationPermission() {
  if (!Device.isDevice) {
    alert('Must use a physical device for notifications.');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Permission not granted for local notifications.');
    return;
  }

  return true;
}

export async function scheduleLaundryReminder(minutesUntilEnd) {
  // const reminderBeforeEndInSeconds = 59 * 60; // 59 minutes for testing 
  const reminderBeforeEndInSeconds = 5 * 60; // 5 minutes, for actual usage 
  const triggerSeconds = minutesUntilEnd * 60 - reminderBeforeEndInSeconds;
  const secondsFromNow = Math.max(triggerSeconds, 5); // ensure at least 5s

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Laundry Almost Done',
      body: 'Your laundry will be ready in 5 minutes!',
      sound: true,
    },
    trigger: {
      seconds: secondsFromNow,
    },
  });

  return notificationId;
}

// for testing, used by the "send test notification" button below "Confirm & Start"
export async function sendTestNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Test Notification',
      body: 'This is a test!',
    },
    trigger: {
      seconds: 5,
    },
  });
}

