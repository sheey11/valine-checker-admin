#!/bin/sh
cd server
export NODE_ENV=development
yarn start &
cd ../pages
yarn serve
