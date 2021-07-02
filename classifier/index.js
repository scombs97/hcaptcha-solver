import imghash from "imghash";
import puppeteer from "puppeteer-extra";
import Stealth from "puppeteer-extra-plugin-stealth";
import got from "got";
import EventEmitter from "events";
import { read, write } from '../cache/index.js'

const setKeyEmitter = new EventEmitter();
const storeAnswerEmitter = new EventEmitter();

const findCaptcha = async (page) => {
    await page.waitForSelector(".h-captcha");
    await page.focus(".h-captcha");
};

const findFrame = (frames, frameName) => {
    return frames.find(frame => frame.url().includes(frameName));
};

const openCaptcha = async (page) => {
    const frames = await page.frames();
    const frame = findFrame(frames, 'hcaptcha-checkbox');
    await frame.click('#checkbox')
};

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const downloadRawImage = async (imageURL) => {
    const { body } = await got(imageURL, {
      responseType: `buffer`,
    });
    return body;
};

const getHashFromURL = async(url) => {
    const buffer = await downloadRawImage(url);
    return await imghash.hash(buffer);
}

const classify = async(body) => {
    const prompt = body.requester_question.en.split('Please click each image containing a ')[1]
    body.tasklist.forEach(async (t) => {
        const hash = await getHashFromURL(t.datapoint_uri);
        console.log(t.datapoint_uri)
        const cacheClassification = await read(hash);
    });
}

const main = async(sitekey) => {
    let key = ""
    puppeteer.use(Stealth());
    const browser = await puppeteer.launch({
        headless: false,
        args: [`--window-size=450,650`]
    });
    const page = await browser.newPage();
    setKeyEmitter.on("setKey", async(e) => {
        key = e
    })
    page.on("response", async (e) => {
        if (e.url().includes("getcaptcha")) {
            const body = await e.json();
            setKeyEmitter.emit("setKey", body.key);
            await classify(body);
        }
    });
    page.on("request", async(e) =>{
        if (key !== "" && e.url().includes(key)) {
            const postData = await e.postData()
            if (postData !== undefined) {
                console.log(JSON.parse(postData).answers)
                await page.reload();
            }
        }
    })
    await page.goto(`https://accounts.hcaptcha.com/demo?sitekey=${sitekey}`, {
        waitUntil: 'networkidle0',
    });
    findCaptcha(page);
    openCaptcha(page);
}

main('00000000-0000-0000-0000-000000000000')