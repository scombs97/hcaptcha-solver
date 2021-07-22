import puppeteer from "puppeteer-extra";
import Stealth from "puppeteer-extra-plugin-stealth";
import ghostCursor from 'ghost-cursor'
import imghash from "imghash";
import got from "got";
import { read } from '../cache/index.js'

const findCaptcha = async (page) => {
    await page.waitForSelector(".h-captcha");
    await page.focus(".h-captcha");
};

const openCaptcha = async (page, cursor) => {
    const frames = await page.frames();
    const frame = findFrame(frames, 'hcaptcha-checkbox');
    const checkbox = await frame.$('#checkbox')
    cursor.click(checkbox)
};

const findFrame = (frames, frameName) => {
    return frames.find(frame => frame.url().includes(frameName));
};

const solve = async(page, cursor, question, tasklist) => {
    items = tasklist
    const frames = await page.frames()
    const frame = findFrame(frames, 'hcaptcha-challenge')
    items.forEach(async (t) => {
        const buffer = await downloadRawImage(t.datapoint_uri);
        const hash = await imghash.hash(buffer);
        const cacheClassification = await read(hash)
        if (cacheClassification === undefined) {
            const inferenceClassification = await classify(t.datapoint_uri)
        } else {
            t.classification = cacheClassification
        }
    })

    console.log(frame)
}

const downloadRawImage = async (imageURL) => {
    const { body } = await got(imageURL, {
      responseType: `buffer`,
    });
    return body;
};

const main = async() => {
    puppeteer.use(Stealth());
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    const cursor = ghostCursor.createCursor(page, await ghostCursor.getRandomPagePoint(page), true)
    await ghostCursor.installMouseHelper(page)

    page.on("response", async(e) => {
        if (e.url().includes("getcaptcha")) {
            const body = await e.json();
            const question = body.requester_question.en.split('Please click each image containing an ')[1]
            const tasklist = body.tasklist
            await solve(page, cursor, question, tasklist)
        }
    })

    await page.goto("https://hcaptcha.com/",{
        waitUntil: 'networkidle0',
    });
    await findCaptcha(page);
    await openCaptcha(page, cursor);
}

main()