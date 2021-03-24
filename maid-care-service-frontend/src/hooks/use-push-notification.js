import axios from 'axios';
import { useState, useEffect } from 'react';
import {
  askUserPremission,
  createNotificationSubscription,
  getUserSubscription,
  isPushNotificationSupported,
} from '../utils/push-notifications';

/**
 * return is push notification is supported by the browser
 */
const pushNotificationSupported = isPushNotificationSupported();

export const usePushNotification = () => {
  // indicate user permission
  const [userConsent, setUserConsent] = useState(Notification.permission);
  // to manage the use push notification subscription
  const [userSubscription, setUserSubscription] = useState(null);
  // to manage the push server subscription
  const [pushServerSubscriptionId, setPushServerSubscriptionId] = useState();
  // for errors
  const [error, setError] = useState(null);
  // for async action
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(false);
    const getExistingSubscription = async () => {
      const existingSubscription = await getUserSubscription();
      setUserSubscription(existingSubscription);
      setLoading(false);
    };
    getExistingSubscription();
  }, []);

  /**
   * ask user permission to use push notification feature
   */
  const toAskUserPermission = () => {
    setLoading(true);
    setError(false);
    askUserPremission().then((consent) => {
      setUserConsent(consent);
      if (consent !== 'granted') {
        setError({
          name: 'Consent Denied',
          message: 'You denied the consent to receive notification',
          code: 0,
        });
      }
      setLoading(false);
    });
  };

  /**
   * get subscription from push notification server
   */
  const subscribeToPushNotification = () => {
    setLoading(true);
    setError(false);
    createNotificationSubscription()
      .then((subscription) => {
        setUserSubscription(subscription);
      })
      .catch((err) => {
        console.error('create subscription', err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * send to backend to subscribe
   */
  const sendSubscriptionToPushServer = () => {
    setLoading(true);
    setError(false);
    axios
      .post('/api/notification/subscribe', userSubscription)
      .then((res) => {
        setPushServerSubscriptionId(res.data.id);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    toAskUserPermission,
    subscribeToPushNotification,
    sendSubscriptionToPushServer,
    pushServerSubscriptionId,
    userConsent,
    pushNotificationSupported,
    userSubscription,
    error,
    loading,
  };
};
