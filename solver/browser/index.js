import puppeteer from "puppeteer-extra";
import Stealth from "puppeteer-extra-plugin-stealth";
import ghostCursor from 'ghost-cursor'
import imghash from "imghash";
import got from "got";
import { read } from '../../cache/index.js'
import { classify } from "../../inference/index.js";

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
    let temp = tasklist
    const firstScreenCells = temp.splice(0,9)
    const secondScreenCells = temp

    const firstScreenPromises = firstScreenCells.map(async(t, index) => {
        let classification = ""
        const buffer = await downloadRawImage(t.datapoint_uri);
        const hash = await imghash.hash(buffer);
        const cacheClassification = await read(hash)
        if (cacheClassification === undefined) {
            classification = await classify(t.datapoint_uri)
            t.classification = classification
            t.method = "inference"
        } else {
            classification = cacheClassification
            t.classification = classification
            t.method = "cache"
        }
        return t
    })

    await Promise.all(firstScreenPromises).then(async(cells) => {
        const frames = await page.frames()
        const frame = findFrame(frames, 'hcaptcha-challenge')
        const elements = await frame.$$('div.task-image')
        
        const clickCells = new Promise(async(resolve, reject) => {
            for (let i = 0; i < cells.length; i++) {
                if (cells[i].classification === question) {
                    await cursor.click(elements[i])
                }
                if (i === cells.length-1) {
                    resolve()
                }
            }
        })

        await clickCells
        const button = await frame.$('div.button-submit')
        await cursor.click(button)
    })
    .then(async() => {
        const secondScreenPromises = secondScreenCells.map(async(t, index) => {
            let classification = ""
            const buffer = await downloadRawImage(t.datapoint_uri);
            const hash = await imghash.hash(buffer);
            const cacheClassification = await read(hash)
            if (cacheClassification === undefined) {
                classification = await classify(t.datapoint_uri)
                t.classification = classification
                t.method = "inference"
            } else {
                classification = cacheClassification
                t.classification = classification
                t.method = "cache"
            }
            return t
        })
    
        await Promise.all(secondScreenPromises).then(async(cells) => {
            const frames = await page.frames()
            const frame = findFrame(frames, 'hcaptcha-challenge')
            const elements = await frame.$$('div.task-image')
            
            const clickCells = new Promise(async(resolve, reject) => {
                for (let i = 0; i < cells.length; i++) {
                    if (cells[i].classification === question) {
                        await cursor.click(elements[i])
                    }
                    if (i === cells.length-1) {
                        resolve()
                    }
                }
            })
    
            await clickCells
            const button = await frame.$('div.button-submit')
            await cursor.click(button)
        })
    })
}

const downloadRawImage = async (imageURL) => {
    const { body } = await got(imageURL, {
      responseType: `buffer`,
    });
    return body;
};

const main = async(url) => {
    puppeteer.use(Stealth());
    //const browser = await puppeteer.launch({headless: false, args: [`--window-size=${300},${700}`]});
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const cursor = ghostCursor.createCursor(page, await ghostCursor.getRandomPagePoint(page), true)
    await ghostCursor.installMouseHelper(page)

    page.on("response", async(e) => {
        if (e.url().includes("getcaptcha")) {
            const body = await e.json();
            const str = body.requester_question.en.split(' ')
            const question = str[str.length-1]
            const tasklist = body.tasklist
            await solve(page, cursor, question, tasklist)
        } else if (e.url().includes("checkcaptcha")) {
            try {
                const body = await e.json();
                if (body.pass) {
                    const id = body.generated_pass_UUID
                    browser.close()
                    console.log(id)
                    return id
                }
            } catch(e) {
                //Do nothing.
            }
        }
    })

    await page.goto(url, {
        waitUntil: 'networkidle0',
    });
    await findCaptcha(page);
    await openCaptcha(page, cursor);
}

const id = await main("https://hcaptcha.com/")