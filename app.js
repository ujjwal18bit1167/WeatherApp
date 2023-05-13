const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require('ejs');

const app = express();
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.use(express.json({
  limit: '1mb'
}));
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.htm");
});

app.post("/api", (req, res) => {
  console.log('I got a request');
  console.log(req.body);
  const data = req.body;



  //const city = req.body.cityName;
  const lat = req.body.lat;
  const lon = req.body.lon;
  const apiKey = "3865b2a8f2f84db27a8729adcca94e44";
  const unit = "metric";
  var url = "https://api.openweathermap.org/data/2.5/onecall?" + "&lat=" + lat + "&lon=" + lon + "&exclude=hourly,daily" + "&appid=" + apiKey + "&units=" + unit;
  https.get(url, function(response) {
    //console.log(response.statusCode);
    response.on("data", function(data) {
      // console.log(data); // prints data in hexadecimal

      const weatherData = JSON.parse(data);
      var myDate = new Date(weatherData.current.dt * 1000); //weatherData.dt is epoch time i.e number of seconds elapsed since 1 Jan 1970
      console.log(myDate.getDate()); //number date according to local time i.e here we have GMT+5:30
      console.log("Date according to GMT is " + myDate.toGMTString() + " and Local date is " + myDate.toLocaleString());
      console.log(weatherData.current.dt); // epoch time


      const temp = weatherData.current.temp;
      const weatherDescription = weatherData.current.weather[0].description;
      const icon = weatherData.current.weather[0].icon;
      const date = new Date();

      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];




      url = "https://api.openweathermap.org/geo/1.0/reverse?" + "&lat=" + lat + "&lon=" + lon + "&limit=5" + "&appid=" + apiKey;
      https.get(url, function(response) {

        response.on("data", function(data) {


          const weatherData = JSON.parse(data);
          const cityName = weatherData[0].name;

          res.json({
            status: 'success',
            latitude: data.lat,
            longitude: data.lon,
            kindOftemp: temp,
            kindOfweatherDescription: weatherDescription,
            kindofname: weatherData.name,
            kindOfimgurl: imageURL,
            kindofdate: date.getDate(),
            kindOfmonth: months[date.getMonth()],
            kindofyear: date.getFullYear(),
            city: cityName
          });


        });

      });





    });

  });









});

app.post("/form", function(req, res) {



const city = req.body.city;


const apiKey = "3865b2a8f2f84db27a8729adcca94e44";
const unit = "metric";
var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=" + unit;
https.get(url, function(response) {
  //console.log(response.statusCode);
  response.on("data", function(data) {
    // console.log(data); // prints data in hexadecimal

    const weatherData = JSON.parse(data);
    console.log(weatherData);
    if(weatherData.cod=="404")
        res.send("Sorry city could not be found!");
    else
  {
    var myDate = new Date(weatherData.dt * 1000); //weatherData.dt is epoch time i.e number of seconds elapsed since 1 Jan 1970
    console.log(myDate.getDate()); //number date according to local time i.e here we have GMT+5:30
    console.log("Date according to GMT is " + myDate.toGMTString() + " and Local date is " + myDate.toLocaleString());
    console.log(weatherData.dt); // epoch time


    const temp = weatherData.main.temp;
    const weatherDescription = weatherData.weather[0].description;
    const icon = weatherData.weather[0].icon;
    const date = new Date();

    const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];








    const cityName = weatherData.name;
    res.render("index", {
      status: 'success',
      kindOftemp: temp,
      kindOfweatherDescription: weatherDescription,
      kindofname: weatherData.name,
      kindOfimgurl: imageURL,
      kindofdate: date.getDate(),
      kindOfmonth: months[date.getMonth()],
      kindofyear: date.getFullYear(),
      city: cityName
    });


}//else
  });







});

});
















app.listen(process.env.PORT || 3000, function() {
  console.log("Server running at port 3000");
});
