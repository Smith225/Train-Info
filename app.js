const express= require('express');
const bodyParser= require('body-parser');
const https= require('https');
const ejs= require('ejs');
const date= require( __dirname + "/date.js"); // Requiring date from date.js

const app= express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req,res)
{
  res.sendFile( __dirname + "/indexInfo.html");
});

app.post("/", function(req, res)
{
  const trainNumOrName= req.body.trainNo;
  options= {
    headers: {
      "X-RapidAPI-Key": "d961e82fbbmshf81571d6b9cf834p136039jsnbdf65508aebf",
		  "X-RapidAPI-Host": "indian-railway-irctc.p.rapidapi.com"
    }
  }
  const url= "https://indian-railway-irctc.p.rapidapi.com/getTrainId?trainno="+ trainNumOrName;

  https.get(url, options, function(response){

    console.log(response.statusCode);
    if(response.statusCode== 200)
    {
      response.on("data", function(data)
      {
        const output= JSON.parse(data);
        console.log(output);

        if(output.length != 0)
        {
          res.render("successInfo", {
            array: output
          });
        }
        else
        {
            res.render("failure");
        }
      });
    }
  })
});



app.post("/trainLivestatus", function(req, res)
{
  const id= req.body.trainId;

  const options= {
    headers: {
      "X-RapidAPI-Key": "d961e82fbbmshf81571d6b9cf834p136039jsnbdf65508aebf",
      "X-RapidAPI-Host": "indian-railway-irctc.p.rapidapi.com"
    }
  }

  const today= date.getDate();

  const url= "https://indian-railway-irctc.p.rapidapi.com/getTrainLiveStatusById?id="+ id +"&date=" + today;

  https.get(url, options, function(response){

    if(response.statusCode== 200)
    {
      const chunks= [];
      response.on("data", function(chunk)
      {
        chunks.push(chunk);
      });

      response.on("end", function()
      {
        const body= Buffer.concat(chunks);  // Combines all buffer objects in array into single buffer object
       // toString :    Converts Buffer data format into string key value pairs (json)
        const output= JSON.parse(body.toString());  // Converts into javascript objects (with key having no double quotes)

        const liveStatus= output.train;
        console.log(liveStatus);


        if(liveStatus.departed== '0')
        {
          liveStatus.departed= "Not Departed";
        }
        else{
          liveStatus.departed= "Departed";
        }

        res.render("successLiveStatus",
        {
          output: output,
          jsObject: liveStatus
        });
      })
    }
    else
    {
      res.render("failure");
    }
  })
});


app.post("/Stations", function(req, res)
{
  const id= req.body.trainId;

  const options= {
    headers: {
      "X-RapidAPI-Key": "d961e82fbbmshf81571d6b9cf834p136039jsnbdf65508aebf",
      "X-RapidAPI-Host": "indian-railway-irctc.p.rapidapi.com"
    }
  }

  const today= date.getDate();

  const url= "https://indian-railway-irctc.p.rapidapi.com/getTrainLiveStatusById?id="+ id +"&date=" + today;

  https.get(url, options, function(response)
  {
    if(response.statusCode== 200)
    {
      const chunks= [];
      response.on("data", function(chunk)
      {
         chunks.push(chunk);
      })

      response.on("end", function()
      {
        const body= Buffer.concat(chunks);

        const output= JSON.parse(body.toString());

        const stations= output.stations;

        res.render("successStations",
        {
          output: output,
          stations: stations
        });
      })
    }
    else
    {
        res.render("failure");
    }

  })
});



/* The API used here is of IRCTC and has limit of 20 requests per month and will start working from 20 March
app.get("/trainsBetweenStations", function(req, res)
{
  res.sendFile( __dirname + "/index3.html");
});

app.post("/trainsBetweenStations", function(req, res)
{
  const fromCode= req.body.fromStationCode;
  const toCode= req.body.toStationCode;

  const url= "https:irctc1.p.rapidapi.com/api/v2/trainBetweenStations?fromStationCode="+ fromCode+"&toStationCode="+toCode ;

  const options= {
    headers: {
      "X-RapidAPI-Key": "d961e82fbbmshf81571d6b9cf834p136039jsnbdf65508aebf",
      "X-RapidAPI-Host": "irctc1.p.rapidapi.com"
    }
  }

  https.get(url, options, function(response)
  {
      response.on("data", function(data)
      {
        const output= JSON.parse(data);

        res.send(output);

      })
  })
});
*/

app.post("/failure", function(req, res){
  res.redirect("/");
});


app.listen(3000, function()
{
  console.log("Server has started at port 3000.");
});
