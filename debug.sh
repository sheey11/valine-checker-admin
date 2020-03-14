#!/bin/sh
cd server
export NODE_ENV=development
npm run start &
cd ../pages/
npm run serve
