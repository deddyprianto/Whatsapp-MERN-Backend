import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Pusher from "pusher";
import route from "./Router/Routes.js";
import bodyParser from "body-parser";
// App Config
const app = express();
const port = process.env.PORT || 5000;
const pusher = new Pusher({
  appId: "1084348",
  key: "48106856be76fac08ad0",
  secret: "af45974ddb1b7712f752",
  cluster: "ap1",
  useTLS: true,
});
// MiddleWare
app.use(bodyParser.json());
app.use(cors());
// DBConfig
const mongodbURL =
  "mongodb://admin:EOBgXsbTqLi1PLMF@cluster0-shard-00-00.tffzs.mongodb.net:27017,cluster0-shard-00-01.tffzs.mongodb.net:27017,cluster0-shard-00-02.tffzs.mongodb.net:27017/whatsdb?ssl=true&replicaSet=atlas-14axfj-shard-0&authSource=admin&retryWrites=true&w=majority";
mongoose.connect(mongodbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.once("open", () => {
  console.log(`DB CONNECTED`);
  const collection = db.collection("pesancontents");
  const lihatData = collection.watch();
  lihatData.on("change", (change) => {
    if (change.operationType === "insert") {
      const fullData = change.fullDocument;
      pusher.trigger("whatsdb", "inserted", fullData);
    }
  });
});
// Routes
app.use("/api/backend", route);
// Listen
app.listen(port, () => console.log(`listen to http://localhost:${port}`));
