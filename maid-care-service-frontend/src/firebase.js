import firebase from 'firebase/app';
import 'firebase/storage';
import * as config from './firebase-config';

var firebaseConfig = config;

if (!firebase.apps.length) {
  //init firebase if not connected
  firebase.initializeApp(firebaseConfig);
  console.log('init');
}

var storage = firebase.storage();

export default storage;
