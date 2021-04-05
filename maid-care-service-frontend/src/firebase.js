import firebase from 'firebase/app'
import 'firebase/storage'

var firebaseConfig = {
  apiKey: "AIzaSyBgMrWO5KQ0E7g-6zrOOcWcZVVTO7l50h4",
  authDomain: "maidcare-da56d.firebaseapp.com",
  projectId: "maidcare-da56d",
  storageBucket: "maidcare-da56d.appspot.com",
  messagingSenderId: "554706491871",
  appId: "1:554706491871:web:510cbeb0756c4341a84c6a",
  measurementId: "G-XWF2TRLZCR"
};

if(!firebase.apps.length){
  //init firebase if not connected
  firebase.initializeApp(firebaseConfig);
  console.log('init')
}

var storage = firebase.storage();

export default storage;