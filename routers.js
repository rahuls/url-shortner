import express from 'express';
import 'dotenv/config.js';
import randomstring from 'randomstring'; //generating a random string
import sqlite3 from  'sqlite3'; 
const router = express.Router();

//This function to used to set the protocol of URL, if the given URL doesn't has a protocol
function setHttp(link){
  if (link.search(/^http[s]?\:\/\//) == -1) {
      link = 'http://' + link;
  }
  return link;
}

//Connecting to database
let db=new sqlite3.Database('./urls.db',(err) => {
     if(err){
        console.log('Error connecting to DB');
     }
     console.log('Connected to database');
});

router.get('/', (req, res) => {
    //Redirect to the app if user tries to open the endpoint
    return res.status(301).redirect('https://rahuls.github.io/app');
});


router.get('/:surl', (req, res) => {
    //This handles the request for the original URL

    //Get the path and remove the '/'
    let path=req.originalUrl;
    path=path.slice(1);
    
    //Check in urls table if there is a URL associated with path
    let sql = 'SELECT lurl FROM urls WHERE surl = ?';
    db.get(sql,[path],(err,row) => {
      if(err){
        return console.error(err.message);
      }
      if(row){ //If there is a URL, then redirect to it.
        return res.status(301).redirect(setHttp(row.lurl));
      }else{ //Show error if there is no URL.
        return res.status(400).json("The short url doesn't exists in our system.");
      }
    });
});


router.post('/', (req, res) => {
    //Get the long URL entered by user
    let lurl = req.body.lurl;
    let surl='';

    //Check if the lurl already exists in DB. If yes return the surl found in db
    //if not create a new one
    let sql = 'SELECT surl FROM urls WHERE lurl = ?';
    db.get(sql,[lurl],(err,row) => {
      if(err){
        console.log(err.message);
      }
      if(row){ 
          return res.json({"surl": row.surl});
      }else{//create a new short url.
            surl = randomstring.generate({
            length: 6,
            charset: 'alphabetic'
            });
            
            
            sql = `INSERT INTO urls(surl,lurl) VALUES('${surl},${lurl}');`
            db.run(sql)

            console.log(`${surl} Insert succesful`);
            
            return res.json({"surl": surl});
      }
    });
});

router.get('*',(req,res) => {
    //If user tries to reach an unknown path 
    return res.send('Invalid URL');
})

export default router;