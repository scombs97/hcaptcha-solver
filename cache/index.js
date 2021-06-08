import firebase from 'firebase';
import fs from 'fs'
import merge from 'deepmerge'

let testHash = '3f1808bf78f03c78'

const firebaseConfig = {
    apiKey: "AIzaSyALM_BLdSq3RZeR2ehf8jlCY9-4cZZj0Z0",
    authDomain: "hcaptcha-cache.firebaseapp.com",
    databaseURL: "https://hcaptcha-cache.firebaseio.com",
    projectId: "hcaptcha-cache",
    storageBucket: "hcaptcha-cache.appspot.com",
    messagingSenderId: "767355413845",
    appId: "1:767355413845:web:3ce25516f445a9fd5a7bdc"
};

const classify = (hashValue) => {
    const ref = firebase.database().ref('cache/' + hashValue);
    ref.once('value', (data) => {
        if (data.exists()){
            console.log(data.val())
            ref.off()
        } else {
            console.log("Image has not been classified.")
            ref.off()
        }
    });
}

const main = () => {
    firebase.initializeApp(firebaseConfig);

    const database = firebase.database()
    database.useEmulator("localhost", 9000)

    let cacheJSON
    const ref = firebase.database().ref('cache/');
    ref.once('value', (data) => {
        if (data.exists()){
            cacheJSON = data.val();
        } else {
            console.log("No cache child found.")
        }
    });

    let rawdata = fs.readFileSync('../scraper/cache.json')
    let json = JSON.parse(rawdata);

    let combinedJSON = merge(cacheJSON, json)

    database.ref('cache').set(combinedJSON)

    classify(testHash);
}

main()