import puppeteer from "puppeteer-extra";
import Stealth from "puppeteer-extra-plugin-stealth";
import ghostCursor from 'ghost-cursor'
import imghash from "imghash";
import got from "got";
import { read, write } from '../../cache/index.js'
import { classify } from "../../inference/index.js";
import { save } from "../../save/save_images.js"

function getTime() {
    var d = new Date();
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());
    var time = "[" + h + ":" + m + ":" + s + "] ";
    return time;
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

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

const classifyTasks = async(tasklist) => {
    console.log(`${getTime()}Classifying images...`)
    let newTaskList = tasklist
    const promises = newTaskList.map(async(t) => {
        const buffer = await downloadRawImage(t.datapoint_uri);
        const hash = await imghash.hash(buffer);
        t.hash = hash
        const cacheClassification = await read(hash)
        if (cacheClassification === undefined) {
            t.classification = await classify(t.datapoint_uri)
            t.method = "inference"
        } else {
            t.classification = cacheClassification
            t.method = "cache"
        }
        return t
    })

    await Promise.all(promises)
    console.log(`${getTime()}Finished classifying images.`)
    return newTaskList
}

const solve = async(page, cursor, question, tasklist) => {
    let temp = tasklist
    const firstScreenCells = temp.splice(0,9)
    const secondScreenCells = temp

    const frames = await page.frames()
    const frame = findFrame(frames, 'hcaptcha-challenge')
    const elements = await frame.$$('div.task-image')

    console.log(`${getTime()}Solving captcha for ${question}...`)
    const clickCellsOnFirstScreen = new Promise(async(resolve) => {
        for (let i = 0; i < firstScreenCells.length; i++) {
            if (firstScreenCells[i].classification === question) {
                await cursor.click(elements[i])
            }
            if (i === firstScreenCells.length-1) {
                resolve()
            }
        }
    })

    clickCellsOnFirstScreen.then(async() => {
        const button = await frame.$('div.button-submit')
        await cursor.click(button)

        const clickCellsOnSecondScreen = new Promise(async(resolve, reject) => {
            const frames = await page.frames()
            const frame = findFrame(frames, 'hcaptcha-challenge')
            const elements = await frame.$$('div.task-image')

            for (let i = 0; i < secondScreenCells.length; i++) {
                if (secondScreenCells[i].classification === question) {
                    await cursor.click(elements[i])
                }
                if (i === secondScreenCells.length-1) {
                    resolve()
                }
            }
        })

        await clickCellsOnSecondScreen.then(async() => {
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
    console.log(`${getTime()}Solving hCaptcha for ${url}`)
    puppeteer.use(Stealth());
    const browser = await puppeteer.launch({headless: false, args: [`--window-size=${300},${700}`]});
    //const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const cursor = ghostCursor.createCursor(page, await ghostCursor.getRandomPagePoint(page), true)
    await ghostCursor.installMouseHelper(page)

    page.on("response", async(e) => {
        if (e.url().includes("getcaptcha")) {
            const body = await e.json();
            const str = body.requester_question.en.split(' ')
            const question = str[str.length-1]
            const solvedTasks = await classifyTasks(body.tasklist)

            const solvePromise = new Promise(() => {
                solve(page, cursor, question, solvedTasks)
            })
            const savePromise = new Promise(() => {
                save(solvedTasks)
            })

            Promise.all([solvePromise, savePromise])
        } else if (e.url().includes("checkcaptcha")) {
            try {
                const body = await e.json();
                if (body.pass) {
                    console.log(`${getTime()}Successfully solved captcha.`)

                   /*const saveToCachePromises = finalTaskList.map(async(t) => {
                        console.log(`${t.hash} : ${t.method} : ${t.classification}`)
                        if (t.method === "inference" && t.classification === finalQuestion) {
                            console.log(`Saving ${t.hash} to cache as ${t.classification}`)
                            write(t.hash)
                        }
                    })
                    await Promise.all(saveToCachePromises).then(() => {
                        const id = body.generated_pass_UUID
                        browser.close()
                        console.log(id)
                        return id
                    })*/

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