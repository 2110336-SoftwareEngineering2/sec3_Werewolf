/* eslint-disable no-restricted-globals */
const pushServerPublicKey = '';

// check if push notification supported
const isPushNotificationSupported = () => 'serviceWorker' in navigator && 'PushManager' in window;

// ask user for permission to push notification
const askUserPremission = async () => {
  return await Notification.requestPermission(); // return default, denied, we need this >> granted
};

// create the notification subscription
const createNotificationSubscription = async () => {
  // wait for service worker installation to be ready
  const serviceWorker = await navigator.serviceWorker.ready;
  // subscribe and return the subscription
  return await serviceWorker.pushManager.subscribe({
    userVisibleOnly: true, // indicate that push subsciption will only be used for msg whose effect is made visible for user
    applicationServerKey: pushServerPublicKey, // VAPID
  });
};

// post subscription  to the push server.
const postSubscription = async (subscription) => {
  // TODO: change to app backend server
  // demo push server for testing
  const response = await fetch(`https://push-notification-demo-server.herokuapp.com/subscription`, {
    credentials: 'omit',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'sec-fetch-mode': 'cors',
    },
    body: JSON.stringify(subscription),
    method: 'POST',
    mode: 'cors',
  });
  return await response.json();
};

// return subscription of the user if present
const getUserSubscription = () => {
  return navigator.serviceWorker.ready
    .then((serviceWorker) => {
      serviceWorker.pushManager.getSubscription();
    })
    .then((subscription) => {
      return subscription;
    });
};

export {
  askUserPremission,
  createNotificationSubscription,
  postSubscription,
  isPushNotificationSupported,
  getUserSubscription,
};
