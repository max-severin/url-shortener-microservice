const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

//;

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