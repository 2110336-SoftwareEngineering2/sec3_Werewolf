import firebase from 'firebase/app';
import storage from '../firebase/firebase.js';

var storageRef = storage.ref();

const uploader = async (file) => {
  
  // Upload file and metadata to the object 'images/mountains.jpg'
  var uploadTask = storageRef.child('images/' + file.name).put(file);

  // Listen for state changes, errors, and completion of the upload.
  const URL = await uploadTask.on(
    firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    },
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;

        // ...

        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    async() => {
      // Upload completed successfully, now we can get the download URL
      const downloadURL = await uploadTask.snapshot.ref.getDownloadURL()
      console.log('download URL', downloadURL)
      return downloadURL
    }
  )
  console.log(URL)
  return URL
};

export { uploader };
