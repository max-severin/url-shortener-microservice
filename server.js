require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const validUrl = require('valid-url');
const shortId = require('shortid');

const app = express();
const port = 3000;

//

mongoose.connect(
  process.env.MONGO_URI, 
  { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
  }
);

mongoose.connection.on(
  'error', 
  console.error.bind(console, 'connection error:')
);

mongoose.connection.once('open', () => {
	console.log('MongoDB database connection established successfully');
});

const { Schema } = mongoose;

const urlSchema = new Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true },
});

const urlModel = mongoose.model('URL', urlSchema);

//

app.use(cors());

app.use('/public', express.static(`${__dirname}/public`));

app.use(bodyParser.urlencoded({extended: false}));

//

app.get('/', (req, res) => res.sendFile(`${__dirname}/view/index.html`));

app.get('/api/shorturl/:shortUrl?', async (req, res) => {
  try {
    const currentUrl = await urlModel.findOne({
      shortUrl: req.params.shortUrl
    });

    if (currentUrl) {
      res.redirect(currentUrl.originalUrl);
    } else {
      res.status(404).json({
        error: "URL Not Found" 
      });
    }
  } catch(error) {
    res.status(500).json({
      message: "Server Error",
      error,
    });
  }
});

app.post('/api/shorturl', async (req, res) => {
  const url = req.body.url.trim();

  if (!validUrl.isWebUri(url)) {
    res.json({
      error: "invalid url" 
    });
  } else {    
    try {
      const existedOne = await urlModel.findOne({
        originalUrl: url
      });

      if (existedOne) {       
        res.json({ 
          original_url: existedOne.originalUrl,
          short_url: existedOne.shortUrl,
        });
      } else {
        const shortUrl = shortId.generate();

        const newOne = new urlModel({
          originalUrl: url,
          shortUrl: shortUrl,
        });

        await newOne.save();

        res.json({ 
          original_url: newOne.originalUrl,
          short_url: newOne.shortUrl,
        });
      }

    } catch(error) {
      res.status(500).json({
        error,
        message: "Server Error",
      });
    }      
  }  
});

//

app.listen(port, () => console.log(`Node is listening on port ${port}...`));