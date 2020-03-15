#!/bin/sh
cd pages
npm run build --name "Valine Checker"
cd ..
if [ ! -d "server/public/" ];then
    mkdir server/public/
fi
cp -r pages/dist/* server/public/
