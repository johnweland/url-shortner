import * as AWSXRay from 'aws-xray-sdk';
import * as AWSSDK from 'aws-sdk';
import { APIGatewayProxyEvent } from "aws-lambda";

//define DocumentClient
const AWS = AWSXRay.captureAWS(AWSSDK);
const docClient = new AWS.DynamoDB.DocumentClient();

//define table by variable passed from stack
const table = process.env.DYNAMODB || "undefined"

console.log(event)
console.log(event.body)
const obj = JSON.parse(event.body)

const ID = obj.id;
const NAME = obj.name

//define table and item in params
const params = {
  TableName: table,
  Item: {
    id: { S: ID },
    name: { S: NAME }
  }
};

//deleteItem function uses params to scan a dynamodb table
async function deleteItem() {
  try {
    const data = await docClient.delete(params).promise()
    return data
  } catch (err) {
    return err
  }
}

//actual handler logs events and calls deleteItem
//logs error on catch
exports.handler = async (event: APIGatewayProxyEvent) => {
  try {
    const data = await deleteItem(params)
    return { body: JSON.stringify(data) }
  } catch (err) {
    return { error: err }
  }
}