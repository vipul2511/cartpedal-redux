import firebase from 'react-native-firebase';

export const displayLocalNotification = async (notification) => {
  const {title, body, sound} = notification;
  const notification22 = new firebase.notifications.Notification()
    .setNotificationId('notificationId')
    .setTitle(title)
    .setBody(body)
    .setSound(sound)
    // .android.setSmallIcon('ic_mir_notification')
    .android.setColor('#DA463C')
    .android.setPriority(firebase.notifications.Android.Priority.Max)
    .android.setChannelId('test-channel')
    .setData(notification.data ? notification.data : notification);

  await firebase.notifications().displayNotification(notification22);
};
