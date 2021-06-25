import fs from 'fs'
import util from 'util'

const readdir = util.promisify(fs.readdir);

const main = async() => {
    let json = {'cache': {}}

    try {
        if (fs.existsSync('cache.json')) {
            let rawdata = fs.readFileSync('cache.json')
            json = JSON.parse(rawdata);
        } else {
            let data = JSON.stringify(json, null, 2);
            fs.writeFileSync('cache.json', data);
        }
    } catch(err) {
        console.log(err)
    }

    let classifications;
    classifications = await readdir("./images");

    for (let classification of classifications) {
        let names = await readdir("./images/" + classification);
        for (let name of names) {
            let hashStr = name.split('.')[0]
            json.cache[hashStr] = {
                'classification': classification
            }
        }
    }

    let jsonData = JSON.stringify(json, null, 2);
    fs.writeFileSync('cache.json', jsonData);
}   

main()
