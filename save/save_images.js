import AWS from 'aws-sdk'
import imghash from "imghash";
import got from "got";

const ACCESS_KEY_ID = "AKIA2G5FSAQXXKVLTGEI"
const SECRET_ACCESS_KEY = "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"
const BUCKET_NAME = "hcap-classification-storage"

const s3 = new AWS.S3({
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY
});

const save = async(taskList) => {
    console.log(`${getTime()}Uploading images to S3 bucket.`)
    const promises = taskList.map(async(t) => {
        const buffer = await downloadRawImage(t.datapoint_uri)
        const hash = await imghash.hash(buffer)

        const params = {
            Bucket: BUCKET_NAME,
            Key: `unclassified/${hash}.jpg`,
            Body: buffer
        }

        s3.upload(params, function(err, data) {
            if (err) {
                throw err;
            }
            //console.log(`File uploaded successfully. ${data.Location}`);
        })
    })

    await Promise.all(promises).then(() => {
        console.log(`${getTime()}Images successfully uploaded.`)
    })
}

const downloadRawImage = async (imageURL) => {
    const { body } = await got(imageURL, {
      responseType: `buffer`,
    })
    return body
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