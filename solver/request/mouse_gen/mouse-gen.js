const initalMotionData = (url) => {
    let motionData = {}
    motionData["st"] = Date.now()
    motionData["md"] = [ 
        [29, 33, randomTimeIncrease(motionData["st"], 3000, 5000)]
    ]
    motionData["md-mp"] = 0
    motionData["mu"] = [
        [29, 33, randomTimeIncrease(motionData["md"][0][2], 100, 150)]
    ]
    motionData["mu-mp"] = 0
    motionData["v"] = 1
    let topLevel = {}
    topLevel["inv"] = false
    topLevel["st"] = randomTimeIncrease(motionData["st"], 50, 80)
    topLevel["sc"] = {
        "availWidth": 2560,
        "availHeight": 1040,
        "width": 2560,
        "height": 1080,
        "colorDepth": 24,
        "pixelDepth": 24,
        "availLeft": 0,
        "availTop": 0
    }
    topLevel["nv"] = {
        "vendorSub": "",
        "productSub": "20030107",
        "vendor": "Google Inc.",
        "maxTouchPoints": 0,
        "userActivation": {},
        "doNotTrack": null,
        "geolocation": {},
        "connection": {},
        "webkitTemporaryStorage": {},
        "webkitPersistentStorage": {},
        "hardwareConcurrency": 20,
        "cookieEnabled": true,
        "appCodeName": "Mozilla",
        "appName": "Netscape",
        "appVersion": "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
        "platform": "Win32",
        "product": "Gecko",
        "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
        "language": "en-US",
        "languages": [
          "en-US",
          "en"
        ],
        "onLine": true,
        "webdriver": false,
        "serial": {},
        "scheduling": {},
        "xr": {},
        "mediaCapabilities": {},
        "permissions": {},
        "locks": {},
        "usb": {},
        "mediaSession": {},
        "clipboard": {},
        "credentials": {},
        "keyboard": {},
        "mediaDevices": {},
        "storage": {},
        "serviceWorker": {},
        "wakeLock": {},
        "deviceMemory": 8,
        "hid": {},
        "presentation": {},
        "userAgentData": {},
        "bluetooth": {},
        "managed": {},
        "plugins": [
          "internal-pdf-viewer",
          "mhjfbmdgcfjbbpaeojofohoefgiehjai",
          "internal-nacl-plugin"
        ]
    }
    topLevel["dr"] = ""
    topLevel["exec"] = false
    topLevel["wn"] = [
        [1127, 937, 1, topLevel["st"]]
    ]
    topLevel["wn-mp"] = 0
    topLevel["xy"] = [
        [0, 1282, 1, topLevel["st"] + 1]
    ]
    topLevel["xy-mp"] = 0
    motionData["topLevel"] = topLevel
    motionData["session"] = []
    motionData["widgetList"] = ["063e605era4o"]
    motionData["widgetId"] = "063e605era4o"
    motionData["href"] = url
    motionData["prev"] = {
        "escaped": false,
        "passed": false,
        "expiredChallenge": false,
        "expiredResponse": false
    }

    return motionData
}

const randomTimeIncrease = (t, min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return t + Math.floor(Math.random() * (max - min + 1) + min)
}

export {initalMotionData}