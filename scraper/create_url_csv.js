import { convertArrayToCSV } from 'convert-array-to-csv';
import converter from 'convert-array-to-csv';
import fs from 'fs';

const main = async() => {

    var dataObjects = new Array()

    fs.readdir('./images/unclassified/', function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            const data = {
                image_url: 'https://hcap-dataset.s3.us-east-2.amazonaws.com/' + file
            }
            dataObjects.push(data)
        });

        const csvFromArrayOfObjects = convertArrayToCSV(dataObjects);
        fs.writeFile('imageUrls.csv', csvFromArrayOfObjects, function (err) {
            if (err) return console.log(err);
            console.log('File created successfully');
        })
    });
}

main()
