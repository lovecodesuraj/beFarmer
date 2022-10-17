const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const fuseSearch = require("fuse.js");
const mongoose = require("mongoose");
const https = require("https");
const fetch = require("node-fetch");
const satelize = require("satelize");
// const soilData= require("./public/home");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");



app.get("/", function (req, res) {
  res.render("home");
});
app.post("/result", function (req, res) {

  const waterSource=req.body.waterSource;
  // console.log(waterSource)
  fetch("https://api.ipify.org/?format=json")
    .then((results) => results.json())
    .then((ipAdress) => {
      satelize.satelize({ ip: "" + ipAdress.ip }, function (err, payload) {
        // console.log(payload);
        const lat = payload.latitude;
        const long = payload.longitude;

        const url =
          "https://api.openweathermap.org/data/2.5/weather?lat=" +
          lat +
          "&lon=" +
          long +
          "&appid=885c91b236ff853cd3798b234713fc53";
        fetch(url)
          .then((response) => response.json())
          .then((jsonData) => {

          
            const allData = {
              crops: [
                 {
                    name:"Rice",
                  temperature: 25,
                  waterSource:"vgood",
                  rainfall:{lowerLimit:150,upperLimit:300},
                },
                {   name:"Wheat",
                    temperature:15,
                    waterSource:"good",
                    rainfall:{lowerLimit:75,upperLimit:100},
                 },
                 {  name:"Millets",
                    temperature:25,
                    waterSource:"good",
                    rainfall:{lowerLimit:50,upperLimit:100},
                 },
                 {  name:"Grams",
                    temperature:25,
                    waterSource:"poor",
                    rainfall:{lowerLimit:40,upperLimit:45},
                 },
                 {  name:"Sugarcane",
                    temperature:25,
                    waterSource:"good",
                    rainfall:{lowerLimit:75,upperLimit:150},
                 },
                 {  name:"Cotton",
                    temperature:25,
                    waterSource:"good",
                    rainfall:{lowerLimit:50,upperLimit:100},
                 },
                 {  name:"Oilseeds",
                    temperature:25,
                    waterSource:"good",
                    rainfall:{lowerLimit:50,upperLimit:75},
                 },
                 {  name:"Tea",
                    temperature:25,
                    waterSource:"vgood",
                    rainfall:{lowerLimit:150,upperLimit:300},
                 },
                 {  name:"Coffee",
                    temperature:25,
                    waterSource:"vgood",
                    rainfall:{lowerLimit:150,upperLimit:250},
                 },
                 {  name:"Soyabean",
                    temperature:33,
                    waterSource:"poor",
                    rainfall:{lowerLimit:150,upperLimit:250},
                 },
                 {  name:"Sun Flower",
                    temperature:30,
                    waterSource:"poor",
                    rainfall:{lowerLimit:150,upperLimit:250},
                 },
                 {  name:"Musturd",
                    temperature:30,
                    waterSource:"poor",
                    rainfall:{lowerLimit:150,upperLimit:250},
                 },
                 {  name:"Sorghum",
                    temperature:35,
                     waterSource:"poor",
                    rainfall:{lowerLimit:150,upperLimit:250},
                 }
              ],
              summerCrops:[{name:"Cucumber"},{name:"Pumpkin"},{name:"Tomato"},{name:"Sweet Potato"},{name:"Water Melon"},{name:"Snap Bean"}],
              winterCrops:[{name:"Broccoli"},{name:"Garlic"},{name:"Onion"},{name:"Turnip"},{name:"Pea"},{name:"Kale"},{name:"Cabbage"},{name:"Carrot"},{name:"Cauliflower"},{name:"Potato"}],
            };
           
            

            var tempCrops=[];
            // console.log((jsonData.main.temp - 273));
            allData.crops.forEach((crop)=>{
           
              if(crop.temperature-5<=(jsonData.main.temp-273) && crop.temperature+5>=(jsonData.main.temp-273)){
                tempCrops.push(crop);
              }
            })
            var result;
        
            if(waterSource==="good"){
            result =tempCrops.filter( (crop)=>{
              return crop.waterSource!="vgood";
             },result)
            }
            if(waterSource==="poor"){
              result=tempCrops.filter( (crop)=>{
               return crop.waterSource=="poor";
              })
             }
          if(waterSource==="vgood"){
            result=tempCrops;
          }
          if(jsonData.main.temp - 273<30){
            allData.winterCrops.forEach((crop)=>{
              result.push(crop);
            })
          }else{
            allData.summerCrops.forEach((crop)=>{
              result.push(crop);
            })
          }
        // if(temperature<30)

            res.render("result", { result });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    });
});

app.listen(process.env.PORT || 3000, function (res) {
  console.log("server is running at port 3000");
});
