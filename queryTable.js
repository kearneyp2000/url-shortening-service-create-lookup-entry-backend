module.exports.queryTable = function(params) {
  var AWS = require("aws-sdk");

  AWS.config.update({region: "eu-west-1", endpoint: "https://dynamodb.eu-west-1.amazonaws.com"});

  var docClient = new AWS.DynamoDB.DocumentClient();
  //console.log("Querying...." + params.TableName);

  return new Promise((resolve, reject) => {
    return docClient.query(params, function(err, data) {
      if (err) {
        //console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        reject("Unable to query. Error:", JSON.stringify(err, null, 2));
      } else {
        //console.log("Query succeeded...." + data.Items);
        resolve(data);
      }
    });
  })
}
