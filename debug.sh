#!/bin/sh
source ./server/checker/config.env
cd server
export NODE_ENV=development
npm run start &
cd ../pages/
npm run serve
