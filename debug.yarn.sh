#!/bin/sh
cd server
DEBUG=server:* | yarn start &
cd ../pages
yarn serve
