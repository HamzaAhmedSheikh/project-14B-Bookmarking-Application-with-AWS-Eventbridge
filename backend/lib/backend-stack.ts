import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as events from '@aws-cdk/aws-events';
import * as eventsTargets from '@aws-cdk/aws-events-targets';
import * as s3 from "@aws-cdk/aws-s3";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as origins from "@aws-cdk/aws-cloudfront-origins";
import { requestTemplate, responseTemplate, EVENT_SOURCE } from '../utils/appsync-request-response';


export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    /// APPSYNC API gives you a graphql api with api key
    const api = new appsync.GraphqlApi(this, "Api", {
      name: "project14B-EventbridgeAPI",
      schema: appsync.Schema.fromAsset("utils/schema.gql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,     ///Defining Authorization Type          
        },
      },      
    });

    ///Defining a DynamoDB Table    
    const todoTableEvent = new dynamodb.Table(this, 'BookmarkAppEvent', {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
    });

    ///Attaching Datasource to api
    const bookmarkTable = api.addDynamoDbDataSource('todoAppTable', todoTableEvent);

    // Create Http Data source that will put our event to the eventbus
    const httpEventTriggerDS = api.addHttpDataSource(
      "eventTriggerDS",
      "https://events." + this.region + ".amazonaws.com/", // This is the ENDPOINT for eventbridge.
      {
        name: "httpDsWithEventBridge",
        description: "From Appsync to Eventbridge",
        authorizationConfig: {
          signingRegion: this.region,
          signingServiceName: "events",
        },
      }
    );
    
    events.EventBus.grantAllPutEvents(httpEventTriggerDS);

    // Resolver
    bookmarkTable.createResolver({
      typeName: "Query",
      fieldName: "allBookmarks",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),
    });

    const mutations = ["createBookmark","deleteBookmark"]
   
    mutations.forEach((mut) => {
      let details = `\\\"id\\\": \\\"$ctx.args.id\\\"`;

      if (mut === 'createBookmark') {
        details = `\\\"url\\\":\\\"$ctx.args.newBookmark.url\\\", \\\"description\\\":\\\"$ctx.args.newBookmark.description\\\", \\\"id\\\":\\\"$ctx.args.newBookmark.id\\\"`
      } 
      
    httpEventTriggerDS.createResolver({
      typeName: "Mutation",
      fieldName: mut,
      requestMappingTemplate: appsync.MappingTemplate.fromString(requestTemplate(details, mut)),
      responseMappingTemplate: appsync.MappingTemplate.fromString(responseTemplate()),
    });
  });

   // creating Lambda function
   const dynamoHandlerLambda = new lambda.Function(this, 'Dynamo_Handler', {
    code: lambda.Code.fromAsset('lambda'),
    runtime: lambda.Runtime.NODEJS_12_X,
    handler: 'dynamoHandler.handler',
    environment: {
      DYNAMO_TABLE_NAME:  todoTableEvent .tableName,
    },    
  });





  }
}
