#!/bin/sh
cd pages
npm run build --name "Valine Checker"
cd ..
cp -r pages/dist/* server/public/
