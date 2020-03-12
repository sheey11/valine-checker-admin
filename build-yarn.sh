#!/bin/sh
cd pages
yarn build --name "Valine Checker"
cp -r pages/dist/* server/public/
