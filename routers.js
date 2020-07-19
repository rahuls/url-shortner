import express from 'express';
import 'dotenv/config.js';

const app = express();
const router = express.Router();
 
router.get('/', (req, res) => {
    //You need to redirect to the static site here

  return res.send('GET HTTP method');
});
router.get('/:surl', (req, res) => {
    //Request for original url
    console.log(req.originalUrl);

  return res.send('GET with short URL');
});
router.post('/', (req, res) => {
    // Take the parameter and generate a short url
    let surl = req.body.surl;
    console.log(surl);
  return res.send('Received a POST HTTP method');
});
router.get('*',(req,res) => {
    return res.send('Invalid URL');
})
export default router;