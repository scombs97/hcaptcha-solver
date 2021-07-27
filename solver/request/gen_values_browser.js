import puppeteer from 'puppeteer-extra'
import Stealth from 'puppeteer-extra-plugin-stealth'
import qs from 'querystring'

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

const gen = async(url) => {
    return new Promise(async (resolve, reject) => {
        puppeteer.use(Stealth());
        //const browser = await puppeteer.launch({headless: false, args: [`--window-size=${300},${700}`]});
        const browser = await puppeteer.launch()
        const page = await browser.newPage()

        page.on("request", async(e) => {
            if (e.url().includes("getcaptcha")) {
                let vals = {}
                let res = JSON.parse(qs.parse(await e.postData()))
                vals.v = 
                //res["c"] = JSON.parse(res["c"])
                //delete res["motionData"]
                resolve(vals)
                await browser.close();
            }
        })
        
        await page.goto(url, {
            waitUntil: 'networkidle0',
        });
        await findCaptcha(page)
        await openCaptcha(page)
    })
}

export {gen}