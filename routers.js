import express from 'express';
import 'dotenv/config.js';
import randomstring from 'randomstring'; //generating a random string
import sqlite3 from  'sqlite3'; 
const router = express.Router();

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
    //Redirect to the app if user tries to reach the endpoint
    return res.status(301).redirect('https://rahuls.github.io/app');
});


router.get('/:surl', (req, res) => {
    //Get the long URL for the short URL
    let path=req.originalUrl;
    path=path.slice(1);
    
    let sql = 'select lurl from urls where surl = ?';
    db.get(sql,[path],(err,row) => {
      if(err){
        return console.error(err.message);
      }
      if(row){
        return res.status(301).redirect(setHttp(row.lurl));
      }else{
        return res.status(400).json("The short url doesn't exists in our system.");
      }
    });
});


router.post('/', (req, res) => {
    console.log(req.body);
    let lurl = req.body.lurl;
    let surl='';
    let sql = 'select surl from urls where lurl = ?';
    db.get(sql,[lurl],(err,row) => {
      if(err){
        console.log(err.message);
      }
      if(row){
          return res.json({surl: row.surl});
      }else{
            let key = randomstring.generate({
            length: 6,
            charset: 'alphabetic'
              });
        
            sql = "INSERT INTO urls(surl,lurl) VALUES('"+key+"','"+lurl+"')";
            surl=key;
            console.log(surl);
            
            db.run(sql)
            console.log('Insert succesful');
            
            return res.json({surl: surl});
      }
    });
});

router.get('*',(req,res) => {
    //If user tries to reach an unknown path 
    return res.send('Invalid URL');
})

export default router;