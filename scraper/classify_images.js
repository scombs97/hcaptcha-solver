import fs from 'fs'
import csv from 'csv-parser'

const main = () => {

    fs.createReadStream('hcap-classification-2k.csv')
    .pipe(csv())
    .on('data', (row) => {
        let fileName = row.image_url.split('https://hcap-dataset.s3.us-east-2.amazonaws.com/')[1]
        let oldPath = './images/unclassified/' + fileName
        let newPath = './images/' + row.label + '/' + fileName

        fs.rename(oldPath, newPath, function (err) {
            if (err) return
            console.log('Successfully renamed - AKA moved!')
        })
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });
}

main()