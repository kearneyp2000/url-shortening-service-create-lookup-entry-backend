module.exports.updateGroupsTableCarTrawler = function(params) {
var AWS = require("aws-sdk");

AWS.config.update({region: "eu-west-1", endpoint: "https://dynamodb.eu-west-1.amazonaws.com"});
var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Updating table " +  params.TableName + " record item... " + params.Item);
docClient.put(params, function(err, data) {
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        return err.message;
    } else {
        console.log("Updated item:", JSON.stringify(data, null, 2));
        return JSON.stringify(data, null, 2);
    }
});
}
