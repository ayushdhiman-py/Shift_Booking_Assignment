import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { plugin as shiftsMockApi } from "./api/index.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/shifts", shiftsMockApi);

app.listen(8080, () =>
  console.info(`✅  API server is listening at http://127.0.0.1:8080`)
);
