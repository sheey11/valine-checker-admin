#!/bin/sh
source ./server/checker/config.env
cd server
export NODE_ENV=development
yarn start &
cd ../pages
yarn serve
