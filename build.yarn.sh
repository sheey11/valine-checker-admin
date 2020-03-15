#!/bin/sh
cd pages
yarn build --name "Valine Checker"
cd ..
if [ ! -d "server/public/" ];then
    mkdir server/public/
fi
cp -r pages/dist/* server/public/
