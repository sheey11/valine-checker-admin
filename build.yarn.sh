#!/bin/sh
cd pages
yarn build --name "Valine Checker"
cd ..
cp -r pages/dist/* server/public/
