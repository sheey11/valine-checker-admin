#!/bin/sh
cd server
DEBUG=server:* | npm run start &
cd ../pages/
npm run serve
