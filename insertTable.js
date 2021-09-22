module.exports.putItem = function(params) {
var AWS = require("aws-sdk");

AWS.config.update({region: "eu-west-1", endpoint: "https://dynamodb.eu-west-1.amazonaws.com"});
var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Adding to table " +  params.TableName + " a new item/group... " + JSON.stringify(params.Item, null, 2));
    return new Promise((resolve, reject) => {
        docClient.put(params, function(err, data) {
            if (err) {
                //console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                reject(err.message)
            } else {
                //console.log("Added item:", JSON.stringify(data, null, 2));
                resolve(data)
            }
        });
    })
}
