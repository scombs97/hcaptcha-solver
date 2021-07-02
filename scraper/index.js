import imghash from "imghash";
import puppeteer from "puppeteer-extra";
import Stealth from "puppeteer-extra-plugin-stealth";
import { createCursor } from "ghost-cursor";
import fs from 'fs'
import got from "got";
import EventEmitter from "events";
import { read, write } from '../cache/index.js'

const findCaptcha = async (page) => {
  await page.waitForSelector(".h-captcha");
  await page.focus(".h-captcha");
};

const findFrame = (frames, frameName) => {
  return frames.find(frame => frame.url().includes(frameName));
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const openCaptcha = async (page) => {
  const frames = await page.frames();
  const frame = findFrame(frames, 'hcaptcha-checkbox');
  await frame.click('#checkbox')
};

const downloadRawImage = async (imageURL) => {
  const { body } = await got(imageURL, {
    responseType: `buffer`,
  });
  return body;
};

const saveImage = (imageBuffer, hash) => {
  fs.writeFileSync(
    process.cwd() + "/images/unclassified/" + hash + ".jpg",
    imageBuffer,
    (err) => {
      if (err) {
        console.log(err);
        return;
      }
    }
  );
};

const main = async () => {
  puppeteer.use(Stealth());
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const doneEmitter = new EventEmitter();
  doneEmitter.on("downloadedImage", async (e) => {
    if (e == 18) {
      await browser.close();
    }
  });
  page.on("response", async (e) => {
    if (e.url().includes("getcaptcha")) {
      const body = await e.json();
      let imageCount = 0;
      body.tasklist.forEach(async (t) => {
        const buffer = await downloadRawImage(t.datapoint_uri);
        const hash = await imghash.hash(buffer);
        const cacheClassification = await read(hash)
        if (cacheClassification === undefined) {
          saveImage(buffer, hash) 
        }
        imageCount++;
        doneEmitter.emit("downloadedImage", imageCount);
      });
    }
  });
  await page.goto("https://accounts.hcaptcha.com/demo?sitekey=f0554631-1818-4941-97ce-26b7496cd196",{
    waitUntil: 'networkidle0',
  });
  await findCaptcha(page);
  await openCaptcha(page);
};
main();