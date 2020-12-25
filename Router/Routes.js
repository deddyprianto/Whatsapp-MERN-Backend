import express from "express";
import schemaDB from "../dbMessages.js";
import schemaUserDB from "../dbUser.js";
const route = express.Router();
route.get("/", async (req, res) => {
  const data = await schemaDB.find({});
  res.send(data);
});
route.post("/", async (req, res) => {
  const dataDB = req.body;
  await schemaDB.create(dataDB, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});
route.post("/user", async (req, res) => {
  const user = req.body;
  await schemaUserDB.create(user, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});
route.post("/loginuser", async (req, res) => {
  const data = await schemaUserDB.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  if (data) {
    res.status(200).send({
      id: data._id,
      username: data.username,
      email: data.email,
      password: data.password,
    });
  } else {
    res.status(401).send({ pesan: "Password & Username salah" });
  }
});
export default route;
