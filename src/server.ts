import express from "express";
import { connect, ConnectOptions } from "mongoose";
import requireDir from "require-dir";
import allowCors from "./config/cors";
import 'dotenv/config';
import { routesApi } from './routes';

const app = express();
app.use(express.json());
app.use(allowCors);

async function runDB(): Promise<void> {
  await connect("mongodb://127.0.0.1:27017/series", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);
}

runDB();

requireDir("./models");

app.use(routesApi);

const port = 3002;

app.listen(port, () => {
  console.log("Server is running on PORT 3002");
});
