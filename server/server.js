const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const axios = require("axios");
const bodyParser = require("body-parser");
const twiller = require("./twiller.js");
const uuid = require("uuid");

// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route to reach out to NHTSA api endpoint
app.post("/vehicle", (req, res) => {
  const { year, make, model, toPhone } = req.body;
  const nhtsaEndpoint = `https://one.nhtsa.gov/webapi/api/Recalls/vehicle/modelyear/${year}/make/${make}/model/${model}?format=json`;
  console.log(nhtsaEndpoint);
  axios
    .get(nhtsaEndpoint)
    .then(result => {
      //console.log("SUMMARY => ", result.data.Results[0].Summary);
      res.send(result.data);
      twiller.sendSMS(toPhone, result.data.Results[0].Summary);
    })
    .catch(err => {
      console.log(err);
    });
});
