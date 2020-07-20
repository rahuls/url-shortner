import express from 'express';
import 'dotenv/config.js';
import randomstring from 'randomstring';
import sqlite3 from  'sqlite3';
const app = express();
const router = express.Router();

function setHttp(link){
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
    
    let sql = 'select lurl from urls where surl = ?';
    let lurl='';
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
    // db.all(sql, [], (err, rows) => {
    //   if (err) {
    //     throw err;
    //   }
    //   console.log('starting search');
    //   rows.forEach((row) => {
    //     if (path.localeCompare(row.surl) == 0) {
    //       lurl = row.lurl;
    //     }
    //   });
    //   console.log('search completed');
    //   console.log('LURL: ' + lurl);
    //   if(lurl.length!=0){
    //     return res.status(301).redirect(setHttp(lurl));
    //   }else{
    //     return res.status(400).json("The short url doesn't exists in our system.");
    //   }
    // });
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
    return res.send('Invalid URL');
})

export default router;