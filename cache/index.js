import axios from 'axios'
const API_KEY = "5040QzhDuKdOV1LXzdSy8qMmC3KOq55dKITZil0g"
const FIREBASE_URL = "https://hcaptcha-cache-48856-default-rtdb.firebaseio.com"

const read = async(hashValue) => {
    try {
        const response = await axios.get(`${FIREBASE_URL}/cache/${hashValue}.json?auth=${API_KEY}`)
        //console.log("cache : " + response.data.classification);
        return response.data.classification
    } catch (error) {
        //console.log(`No classification for ${hashValue} exists in cache. Sending to model.`)
        return undefined
    }
}

const getMethod = async(hashValue) => {
    try {
        const response = await axios.get(`${FIREBASE_URL}/cache/${hashValue}.json?auth=${API_KEY}`)
        return response.data.method
    } catch (error) {
        return undefined
    }
}

const write = async(hashValue, classification, method) => {
    await axios.put(`${FIREBASE_URL}/cache/${hashValue}.json?auth=${API_KEY}`, {
        'classification': classification,
        'method': method
    }).catch(error => {
        console.error(error)
    })
}

export {read, write, getMethod}