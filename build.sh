#!/bin/sh
cd pages
npm run build --name "Valine Checker"
cp -r pages/dist/* server/public/
