import imghash from "imghash";
import puppeteer from "puppeteer-extra";
import Stealth from "puppeteer-extra-plugin-stealth";
import got from "got";
import EventEmitter from "events";
import { read } from '../cache/firebase/index.js'

const storeAnswerEmitter = new EventEmitter();
const solveEmitter = new EventEmitter();

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
    let imageCount = 0;
    console.log("Classifying for " + prompt)
    body.tasklist.forEach(async (t) => {
        const hash = await getHashFromURL(t.datapoint_uri);
        const cacheClassification = await read(hash)
        if (cacheClassification !== undefined && cacheClassification === prompt) {
            storeAnswerEmitter.emit("storeAnswer", hash, cacheClassification);
        }
        imageCount++;
        solveEmitter.emit("solve", imageCount, prompt);
    });
}

const solve = async(page, classifications) => {
    const frames = await page.frames();
    const frame = findFrame(frames, 'hcaptcha-challenge');
    let elements = await frame.$$('div.task-image > div.image-wrapper > div.image')
    let num = 1
    for (const element of elements) {
        const attr = await frame.evaluate(el => el.getAttribute("style"), element);
        const url = attr.split('url(')[1].split('\"')[1]
        const hash = await getHashFromURL(url)
        const res = classifications[hash]
        if (res !== undefined) {
            console.log("Cell " + num + " with hash: " + hash + ", is being clicked.")
            await element.click()
        }
        num++
    }
}

const main = async() => {
    let classifications = {}
    puppeteer.use(Stealth());
    const browser = await puppeteer.launch({
        headless: false,
        args: [`--window-size=450,650`]
    });
    const page = await browser.newPage();
    storeAnswerEmitter.on("storeAnswer", async(hash, classification) => {
        classifications[hash] = classification
    });
    solveEmitter.on("solve", async(imageCount) => {
        if (imageCount == 18) {
            await solve(page, classifications)
        }
    })
    page.on("response", async (e) => {
        if (e.url().includes("getcaptcha")) {
            const body = await e.json();
            await classify(body);
        }
    });
    await page.goto("https://hcaptcha.com",{
        waitUntil: 'networkidle0',
    });
    findCaptcha(page);
    openCaptcha(page);
}

main()