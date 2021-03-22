/* eslint-disable no-restricted-globals */
// Web-Push
// Public base64 to Uint
function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const pushServerPublicKey = process.env.REACT_APP_PUBLIC_VAPID_KEY;
const covertedPushServerKey = urlBase64ToUint8Array(pushServerPublicKey);
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
    applicationServerKey: covertedPushServerKey, // VAPID
  });
};

// post subscription  to the push server.
const postSubscription = async (subscription) => {
  const response = await fetch(`/api/notification/subscribe`, {
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
const getUserSubscription = async () => {
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
