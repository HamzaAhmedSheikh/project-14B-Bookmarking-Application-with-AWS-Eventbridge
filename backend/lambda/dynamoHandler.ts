import { EventBridgeEvent, Context } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMO_TABLE_NAME as string;


export const handler = async (event: EventBridgeEvent<string, any>) => {
    try {
        if (event["detail-type"] === "createBookmark") {
            const params = {
                TableName: TABLE_NAME,
                Item: { ...event.detail },
            }; // id: randomBytes(16).toString("hex")
            await dynamoClient.put(params).promise();
        }
        
        else if (event["detail-type"] === "deleteBookmark") {
            const params = {
                TableName: TABLE_NAME,
                Key: { id: event.detail.id },
            };
            
            await dynamoClient.delete(params).promise();
        }
    } catch (error) {
        console.log("ERROR ====>", error);
    }
};