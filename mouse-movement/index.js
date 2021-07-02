const randomNumberInRange = (min, max) => {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}

const wait = async(ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const getChallengeMM = async(url) => {
    let mouse_movement = {}
    mouse_movement["st"] = Date.now()
    await wait(randomNumberInRange(10,20))
    mouse_movement["md"] = [
        [34, 35, Date.now()]
    ]
    mouse_movement["md-mp"] = 0
    await wait(randomNumberInRange(40,60))
    mouse_movement["mu"] = [
        [34, 35, Date.now()]
    ]
    mouse_movement["mu-mp"] = 0
    mouse_movement["v"] = 1
    mouse_movement["topLevel"] = {}
    let topLevel = mouse_movement["topLevel"]
    topLevel["inv"] = false
    topLevel["st"] = mouse_movement["md"][0][2] + 1
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
        "doNotTrack": "1",
        "geolocation": {},
        "connection": {},
        "webkitTemporaryStorage": {},
        "webkitPersistentStorage": {},
        "hardwareConcurrency": 20,
        "cookieEnabled": true,
        "appCodeName": "Mozilla",
        "appName": "Netscape",
        "appVersion": "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "platform": "Win32",
        "product": "Gecko",
        "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "language": "en-US",
        "languages": ["en-US","en"],
        "onLine": true,
        "webdriver": false,
        "serial": {},
        "scheduling": {},
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
        "xr": {},
        "userAgentData": {},
        "bluetooth": {},
        "managed": {},
        "plugins": ["internal-pdf-viewer", "mhjfbmdgcfjbbpaeojofohoefgiehjai","internal-nacl-plugin"]
    }
    topLevel["dr"] = ""
    topLevel["exec"] = false
    topLevel["wn"] = [
        [839, 937, 1, topLevel["st"] + 1]
    ]
    topLevel["wn-mp"] = 0
    topLevel["xy"] = [
        [0, 1955, 0.9801401869158879, topLevel["st"] + 1]
    ]
    topLevel["xy-mp"] = 0
    mouse_movement["session"] = []
    mouse_movement["widgetList"] = [0 + Math.random().toString(36).substr(2)]
    mouse_movement["widgetId"] = mouse_movement.widgetList[0]
    mouse_movement["href"] = url
    mouse_movement["prev"] = {
        "escaped": false,
        "passed": false,
        "expiredChallenge": false,
        "expiredResponse": false
    }
    return mouse_movement
}

getChallengeMM("https://www.hcaptcha.com/")