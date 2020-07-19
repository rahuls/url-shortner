import express from 'express';
import 'dotenv/config.js';
import cors from 'cors';
const app = express();
import router from './routers.js'
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.use('/',router)
app.use(cors());
app.listen(process.env.PORT || 3000, () =>
  console.log(`Example app listening on port ${process.env.PORT || 3000}`),
);


