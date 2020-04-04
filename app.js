const express = require('express');
const path = require('path');
const fs = require('fs');
const vision = require('@google-cloud/vision');

const app = express();
const directoryPath = path.join(__dirname, 'assets/items');

let object = [];

//Bring in file/files to scan
fs.readdir(directoryPath, function (err, files) {
  if (err){
    return console.log('Unable to scan directory: ' + err);
  }

  files.forEach(function (file) {
    getImageInfo('./assets/items/' + file);
  })
})

//Scan image for text
async function getImageInfo(file) {

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: 'APIKey.json'
  });

  // Performs label detection on the image file
  const [result] = await client.textDetection(file);
  const detections = result.textAnnotations;

  addImageInfo(file, detections[0].description);
  
  console.log('Weapon Info for ' + file + ' processed');
}

//Save text to file/database
function addImageInfo(file, info) {
  object.push({
    file: file,
    info: info
  })
  fs.readFileSync('weaponList.json');
  fs.writeFileSync('weaponList.json', JSON.stringify(object, null, 4));
}

app.set("view engine", "ejs");

app.get('/', (req,res) => {
    res.render('index', {data: object});
});

const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log('Server running'));