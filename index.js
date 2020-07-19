import express from 'express';
import 'dotenv/config.js';

const app = express();
import router from './routers.js'
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.use('/',router)
 
app.listen(3000, () =>
  console.log(`Example app listening on port 3000!`),
);


