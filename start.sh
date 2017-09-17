#!/bin/bash

#source prod env variables
source /root/flight-tracker/env/production;
aws s3 cp s3://flight-tracker-bucket/production/secrets /root/flight-tracker/env/secrets --region us-east-1;
source /root/flight-tracker/env/secrets;

# in production, automatically start the app
# docker will take care of restart policies in the event that the process or container dies
cd /root/flight-tracker;
node app.js;
