import express from 'express';
import 'dotenv/config.js';
import randomstring from 'randomstring';
import sqlite3 from  'sqlite3';
const app = express();
const router = express.Router();

function setHttp(link) {
  if (link.search(/^http[s]?\:\/\//) == -1) {
      link = 'http://' + link;
  }
  return link;
}
 let db=new sqlite3.Database('./urls.db',(err) => {
     if(err){
        console.log('Error connecting to DB');
     }
     console.log('Connected to database');
 });


router.get('/', (req, res) => {
    //You need to redirect to the static site here
    
    return res.status(301).redirect('https://rahuls.github.io/app');
});


router.get('/:surl', (req, res) => {
    //localhost:3000/YinGTg
    // /localhost:3000/LyefhE
    //Request for original url
    
    
    let path=req.originalUrl;
    path=path.slice(1);
    let sql = 'select surl, lurl from urls';
    let lurl='';
    console.log(path)
    
    var prom = new Promise((res,rej)=>{
      db.all(sql, [], (err, rows) => {
        if (err) {
          throw err;
        }
        console.log('starting search');
        rows.forEach((row) => {
          if (path.localeCompare(row.surl) == 0) {
            lurl = row.lurl;
          }
        });
        console.log('search completed');
        console.log('LURL: ' + lurl);
        res(lurl);
      });
    }).then((lurl) => {
      if(lurl.length!=0){
        return res.status(301).redirect(setHttp(lurl));
      }else{
        return res.status(400).json("The short url doesn't exists in our system.");
      }
    })
    
}

)


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
            charset: 'alphabetic'
        });
        
        // sql=`INSERT INTO urls(surl,lurl) VALUES(${key},${lurl})`;
        sql = "INSERT INTO urls(surl,lurl) VALUES('"+key+"','"+lurl+"')";
        surl=key;
        db.run(sql)
        console.log('Insert succesful');
    }
    res.set({
      'Access-Control-Allow-Origin': ['*'],
    'Access-Control-Allow-Methods': 'GET,POST'
    
 
    });
  return res.json({surl: surl});
  //return res.send(`Your short url is at localhost:3000/${surl}`);
});


router.get('*',(req,res) => {
    return res.send('Invalid URL');
})

export default router;