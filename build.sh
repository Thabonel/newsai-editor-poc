#!/bin/bash
set -e

# build react
cd NewsAI.Editor.Client
npm install
npm run build
cd ..

# copy build to API wwwroot
rm -rf NewsAI.Editor.Api/wwwroot
mkdir -p NewsAI.Editor.Api/wwwroot
cp -r NewsAI.Editor.Client/dist/* NewsAI.Editor.Api/wwwroot/

# build docker image
docker build -t newsai-editor .
