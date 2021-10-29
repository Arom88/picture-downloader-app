import firebase from 'firebase/app'
import { initializeApp } from 'firebase/app'
import {getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import {upload} from  './upload.js'

const firebaseConfig = {
    apiKey: "AIzaSyDl-4DvItBa6tnRPwqEEhFxoCVAfdmtnEI",
    authDomain: "pictures-download.firebaseapp.com",
    projectId: "pictures-download",
    storageBucket: "pictures-download.appspot.com",
    messagingSenderId: "603486202762",
    appId: "1:603486202762:web:1410ece2bf923033507673"
  }
  
  // Initialize Firebase

  const app = initializeApp(firebaseConfig)

  const storage = getStorage(app)



upload('#file', {
    multi: true,
    accept: ['.png', '.jpg', '.jpeg', '.gif'],
    onUpload(files, blocks) {
        files.forEach((file, index) => {
            const storageRef = ref(storage, `images/${file.name}`)
            const task = uploadBytesResumable(storageRef, file)

            task.on('state_changed',snapshot => {
                const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
               const block = blocks[index].querySelector('.preview-info-progress')
                block.textContent = percentage
                block.style.width = percentage
            }, error => {
                console.log(error)
            }, () => {
                getDownloadURL(task.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL)
                })
            })
        })
    }
})