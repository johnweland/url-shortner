#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ShortnerStack } from '../lib/url-shortner-stack';

const app = new cdk.App();
new ShortnerStack(app, 'url-shortner', {
  stackName: 'url-shortner',
  description: 'url-shortner',
  tags: {
    project: 'url-shortner',
    environment: 'dev',
    deployment: 'blue',
  },
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  }
});

new ShortnerStack(app, 'url-shortner', {
  stackName: 'url-shortner',
  description: 'url-shortner',
  tags: {
    project: 'url-shortner',
    environment: 'dev',
    deployment: 'green',
  },
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  }
});