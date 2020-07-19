import express from 'express';
import 'dotenv/config.js';

const app = express();
const router = express.Router();
 
app.get('/', (req, res) => {
    //You need to redirect to the static site here
  return res.send('Received a GET HTTP method');
});
 
app.post('/', (req, res) => {
    // Take the parameter and generate a short url
    let surl = req.body.surl;
    console.log(surl);
  return res.send('Received a POST HTTP method');
});
 
app.listen(3000, () =>
  console.log(`Example app listening on port 3000!`),
);


