import axios from 'axios'

const read = async(hashValue) => {
    try {
        const response = await axios.get(`https://hcaptcha-cache-48856-default-rtdb.firebaseio.com/cache/${hashValue}.json`)
        //console.log(hashValue + ", " + response.data.classification);
        return response.data.classification
    } catch (error) {
        //console.log(`No classification for ${hashValue} exists in cache. Sending to model.`)
        return undefined
    }
}

const write = async(hashValue, classification) => {
    await axios.put(`https://hcaptcha-cache-48856-default-rtdb.firebaseio.com/cache/${hashValue}.json`, {
        'classification': classification
    }).catch(error => {
        console.error(error)
    })
}

export {read, write}