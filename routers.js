import express from 'express';
import 'dotenv/config.js';
import randomstring from 'randomstring';
import sqlite3 from  'sqlite3';
const app = express();
const router = express.Router();

async function insertDB(){
    let key= randomstring.generate({
        length: 6,
        charset: 'alphanumeric'
    })
}
 let db=new sqlite3.Database('./urls.db',(err) => {
     if(err){
        console.log('Error connecting to DB');
     }
     console.log('Connected to database');
 });


router.get('/', (req, res) => {
    //You need to redirect to the static site here

  return res.send('GET HTTP method');
});


router.get('/:surl', (req, res) => {
    //localhost:3000/YinGTg
    // /localhost:3000/LyefhE
    //Request for original url
    console.log(req.originalUrl);

  return res.send('GET with short URL');
});


router.post('/', (req, res) => {
    let lurl = req.body.lurl;
    // Take the parameter and generate a short url
    //creating is done over here
    let surl='';
    let sql = 'select surl, lurl from urls';
    db.all(sql, [], (err, rows) => {
        if (err) {
          throw err;
        }
        rows.forEach((row) => {
          if(row.lurl === lurl){
              surl=row.surl;
          }
        });

      });
    if(surl !== ''){
        //return the found url if not create it
        console.log('Found in db');

    }else{
        // let surl = randomstring.generate({
        //     length: 8,
        //     charset: 'alphabetic'
        //   });
        let key = randomstring.generate({
            length: 6,
            charset: 'alphanumeric'
        });
        
        // sql=`INSERT INTO urls(surl,lurl) VALUES(${key},${lurl})`;
        sql = "INSERT INTO urls(surl,lurl) VALUES('"+key+"','"+lurl+"')";
        surl=key;
        db.run(sql)
        console.log('Insert succesful');
    }

  return res.send(`Your short url is at localhost:3000/${surl}`);
});


router.get('*',(req,res) => {
    return res.send('Invalid URL');
})

export default router;