import * as AWSXRay from 'aws-xray-sdk';
import * as AWSSDK from 'aws-sdk';
import { APIGatewayProxyEvent } from "aws-lambda";

const AWS = AWSXRay.captureAWS(AWSSDK);
const docClient = new AWS.DynamoDB.DocumentClient();

//define table by variable passed from stack
const tableName = process.env.DYNAMODB || "undefined"


//define table in params
const params = {
  TableName: tableName
}


//getItems function uses params to scan a dynamodb table
async function getItems() {
  try {
    const data = await docClient.scan(params).promise()
    return data
  } catch (err) {
    return err
  }
}

//actual handler logs events and calls getItems
//logs error on catch
exports.handler = async (event: APIGatewayProxyEvent) => {
  try {
    console.log(event)
    const data = await getItems()
    return { body: JSON.stringify(data) }
  } catch (err) {
    return { error: err }
  }
}