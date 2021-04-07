import { action, makeObservable, observable, when } from 'mobx';

import firebase from 'firebase/app';
import storage from '../firebase.js';

var storageRef = storage.ref();

class MultiImageStore {
  path_list = {};
  isUploading = false;

  constructor() {
    makeObservable(this, {
      path_list: observable,
      isUploading: observable,
      upload: action,
      delete: action,
    });
  }

  // upload action
  async upload(file) {
    var uploadTask = storageRef.child('images/' + file.name).put(file);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
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
            this.isUploading = true;
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
      async () => {
        // Upload completed successfully, now we can get the download URL
        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
        this.isUploading = false;
        this.path_list[file.name] = downloadURL;
      }
    );
  }

  async delete(filename) {
    var imgRef = storageRef.child(`images/${filename}`);

    imgRef
      .delete()
      .then(() => {
        delete this.path_list[filename];
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

// store for uploading only 1 image at a time

class SingleImageStore {
  path = null;
  filename = null;
  isUploading = false;

  constructor() {
    makeObservable(this, {
      path: observable,
      isUploading: observable,
      upload: action,
      delete: action,
    });
  }

  // upload action
  upload(file) {
    var uploadTask = storageRef.child('images/' + file.name).put(file);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
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
            this.isUploading = true;
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
      async () => {
        // Upload completed successfully, now we can get the download URL
        const oldName = this.filename;
        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();

        //change URL and filename to new img
        this.isUploading = false;
        this.path = downloadURL;
        this.filename = file.name;

        //delete old img from firebase
        if (oldName) {
          console.log('deleteing', oldName);
          this.delete(oldName);
        }
      }
    );
  }

  delete(filename) {
    var imgRef = storageRef.child(`images/${filename}`);

    imgRef
      .delete()
      .then(() => {
        console.log('deleted');
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

export { MultiImageStore, SingleImageStore };
