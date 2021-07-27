const ACCESS_KEY_ID = "AKIA2G5FSAQXXKVLTGEI"
const SECRET_ACCESS_KEY = "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"
const BUCKET_NAME = "hcap-classification-storage"

const save = async(taskList) => {
    console.log("Saving")
}

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

export {save}