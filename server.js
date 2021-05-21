require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

//

mongoose.connect(
  process.env.MONGO_URI, 
  { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
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
  shortUrl: { type: String, required: true }
});

const URL = mongoose.model('URL', urlSchema);

//

app.use(cors());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

app.use('/public', express.static(`${__dirname}/public`));

//

app.get('/', (req, res) => res.sendFile(`${__dirname}/view/index.html`));

//

app.listen(port, () => console.log(`Node is listening on port ${port}...`));