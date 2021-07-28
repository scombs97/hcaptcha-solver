import axios from 'axios'

const classify = async(url) => {
    try {
        const response = await axios.post(`http://127.0.0.1:5000/inference`, {
            'url': url
        })
        //console.log("inference : " + response.data);
        return response.data
    } catch (error) {
        console.log(`Something went wrong. Check if the inference is online.`)
        return undefined
    }
}

export {classify}