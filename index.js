import express from 'express';
import 'dotenv/config.js';
import cors from 'cors';
const app = express();
import router from './routers.js'


app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://rahuls.github.io")
  res.header("Access-Control-Allow-Headers", "content-type")
  next();
})
app.use('/',router)
app.listen(process.env.PORT || 3000, () =>
  console.log(`API running on port ${process.env.PORT || 3000}`),
);

// End Point location:  https://stark-cove-29174.herokuapp.com/
