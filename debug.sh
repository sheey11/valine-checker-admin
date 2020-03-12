#!/bin/sh
node ./server/app.js &
cd pages
npm run serve