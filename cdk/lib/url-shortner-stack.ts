import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

interface ShortnerStackProps extends StackProps {
  stackName: string;
  description: string;
  tags: {
    [key: string]: string;
    environment: 'dev' | 'uat' | 'prod';
    deployment: 'blue' | 'green';
  }
}

export class ShortnerStack extends Stack {
  constructor(scope: cdk.App, id: string, props?: ShortnerStackProps) {
    super(scope, id, props);

    // DYANMO DB
    const dynamodb_table = new dynamodb.Table(this, `${props?.tags.environment}-${props?.stackName}-table`, {
      tableName: 'urls',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Lambda Functions
    const lambda_get = new NodejsFunction(this, "getFunction", {
      tracing: lambda.Tracing.ACTIVE,
      environment: {
        DYNAMODB: dynamodb_table.tableName
      },
    });
    dynamodb_table.grantReadData(lambda_get.role!);

    const lambda_put = new NodejsFunction(this, "putFunction", {
      tracing: lambda.Tracing.ACTIVE,
      environment: {
        DYNAMODB: dynamodb_table.tableName
      },
    });
    dynamodb_table.grantWriteData(lambda_put.role!);

    const lambda_delete = new NodejsFunction(this, "deleteFunction", {
      tracing: lambda.Tracing.ACTIVE,
      environment: {
        DYNAMODB: dynamodb_table.tableName
      },
    });
    dynamodb_table.grantWriteData(lambda_delete.role!);

    // API Gateway
    const api = new apigateway.RestApi(this, `${props?.tags.environment}-${props?.stackName}-api`, {
      deployOptions: {
        dataTraceEnabled: true,
        tracingEnabled: true
      },
    })

    const getEndpoint = api.root.addResource("urls")
    const getEndpointMethod = getEndpoint.addMethod("GET", new apigateway.LambdaIntegration(lambda_get));

    const putEndpoint = api.root.addResource("urls")
    const putEndpointMethod = putEndpoint.addMethod("PUT", new apigateway.LambdaIntegration(lambda_put));

    const deleteEndpoint = api.root.addResource("urls")
    const deleteEndpointMethod = deleteEndpoint.addMethod("PUT", new apigateway.LambdaIntegration(lambda_put));
  }
}
