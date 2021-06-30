require('dotenv').config()
const PORT = process.env.PORT || '8080'
const PORT_SSL = process.env.PORT_SSL || '443'
const express = require('express')
const multer = require('multer')
const cors = require('cors')
const AWS = require('aws-sdk');
const fs = require('fs');

const upload = multer({
  dest: 'uploads/',
  fileFilter: function(req, file, cb) {
    if (file.mimetype !== 'application/zip') {
      cb(null, false)
    } else {
      cb(null, true)
    }
  }
})

const AWSCredentials = {
    accessKey: process.env.ACCESS_KEY,
    secret: process.env.SECRET,
    bucketName: process.env.BUCKET_NAME
}

const s3 = new AWS.S3({
    accessKeyId: AWSCredentials.accessKey,
    secretAccessKey: AWSCredentials.secret
})

function uploadToS3 (fileName, fileContent) {
  return new Promise((resolve, reject) => {
    // Setting up S3 upload parameters
    const params = {
      Bucket: AWSCredentials.bucketName,
      Key: fileName,
      Body: fileContent
    }

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
      if (err) {
        return reject( err )
      }
      resolve(data)
    })
  })
}

const app = express()
app.use(cors())

function Form() {
  return `
    <form method="POST" action="/upload" enctype="multipart/form-data">
      <input type="file" name="samplepack" accept=".zip" />
      <input type="submit" />
    </form>
  `
}

app.get('/', (req, res) => {
  res.send('Try <a href="https://apps.makeymakey.com/sampler/">the sampler app</a>')
})

app.get('/form', (req, res) => {
  res.send(Form())
})

app.post('/upload', upload.single('samplepack'), (req, res) => {
  // Read content from the file
  if (!req.file) {
    res.json({ error: "Not a valid file" })
    return
  }
  const fileContent = fs.readFileSync(req.file.path)
  const fileName = `${req.file.filename}.zip`
  uploadToS3(fileName, fileContent)
    .then((data) => {
      console.log(`File uploaded successfully. ${data.Location}`)
      fs.unlinkSync(req.file.path)
      res.json({
        message: "File uploaded successfully.",
        data: req.file.filename
      })
    })
    .catch((e) => {
      console.log('error', e)
      res.json({ error: "Unexpected error", data: e })
    })
})

app.listen(PORT, (e) => {
  console.log(`Listening to localhost:${PORT}`)
})
app.listen(PORT_SSL, (e) => {
  console.log(`Listening to localhost:${PORT_SSL}`)
})
