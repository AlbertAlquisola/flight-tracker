#!/bin/bash

#source prod env variables
source /root/flight-tracker/env/production;

# in production, automatically start the app
# docker will take care of restart policies in the event that the process or container dies
cd /root/flight-tracker;
node app.js;
