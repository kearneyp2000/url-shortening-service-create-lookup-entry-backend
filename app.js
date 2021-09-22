const express = require("express");
const bodyParser = require("body-parser");
const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');
var AWS = require("aws-sdk");
const queryTable = require(__dirname + "/queryTable.js");
const insertTable = require(__dirname + "/insertTable.js");
const dbTable = "url-mappings";
const client = "ba";

const app = express();
const PORT = 4000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json({ extended: false }));
app.use(express.static(__dirname + "/docs"));

app.get("/", (req,res) => {
    res.send("<h1>Useful Helper Links</h1><a href='/urlshorten'>Url Shortener Service</a>")
});

app.get("/urlshorten", (req, res) => {
    console.log(__dirname);
    res.sendFile(__dirname + "/docs/urlshorten.html");
})

app.post("/urlshorten", (req, res) => {
  const { urlToShorten } = req.body;
  const baseUrl = config.get('baseUrl');

  console.log("baseUrl " + baseUrl);
  console.log("urlToShorten " + urlToShorten);

  // Check base url thats added in the default.json 
  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json('Base url is invalid');
  }

  // Create a code to append to the url
  const urlCode = shortid.generate();
  console.log("urlCode : " + urlCode);

      // Check long url
      if (validUrl.isUri(urlToShorten)) {
        try {

            var params = {
              TableName: dbTable,
              KeyConditionExpression: "#r_source = :resource",
              ExpressionAttributeNames: {
                "#r_source": "resource",
              },
              ExpressionAttributeValues: {
                ":resource": urlToShorten
              }
            };
          
            queryTable.queryTable(params)
            .then(response => {
              console.log("response : " + JSON.stringify(response, null, 2));
              console.log(response.Count);
                if (response.Count > 0) { 
                  console.log("response.Count : " + response.Count);
                  res.json(response.Items[0]);
                } else {
                    //if an entry does not exist add the record
                    const shortUrl = baseUrl + '/' + urlCode  
                    let row1 = {
                        "resource": urlToShorten,
                        "client": client,
                        "shorturl": shortUrl
                    }
                    var params1 = {
                      TableName: dbTable,
                      Item: row1,
                    };
                    insertTable.putItem(params1)
                    .then(response => {
        
                        // create an additional row to allow reverse lookup
                        let row2 = {
                          "resource": urlCode,
                          "client": client,
                          "shorturl": shortUrl,
                          "longurl": urlToShorten
                        }
                        var params2 = {
                          TableName: dbTable,
                          Item: row2,
                        };
                        insertTable.putItem(params2)
                        .then(response => {
                          console.log("response2 : " + JSON.stringify(response, null, 2));
                          res.json(params1.Item);
                        })
                        .catch(err => {console.log(err);})


                    })
                    .catch(err => {console.log(err);})

                }
              })
              .catch(err => {
                console.log("error : " + err)
              });

        } catch (err) {
          console.error(err);
          res.status(500).json('Server error');
        }
    } else {
      res.status(401).json('The url to be shortened is a invalid url');
    }
})

app.listen(PORT, () => console.log("server started on http://localhost:" + PORT));