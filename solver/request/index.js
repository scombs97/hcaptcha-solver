import {gen} from './gen_values_browser.js'
import {initalMotionData} from "./mouse_gen/mouse-gen.js"
import axios from 'axios'

const main = async(url) => {
    let vals = await gen(url)
    vals["motionData"] = initalMotionData("https://www.hcaptcha.com/")
    console.log(vals)
    const response = await axios.post("https://hcaptcha.com/getcaptcha?s=00000000-0000-0000-0000-000000000000", vals)
    console.log(response)
}

main("https://www.hcaptcha.com/")