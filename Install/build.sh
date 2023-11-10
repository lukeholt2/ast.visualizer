#!/bin/bash

DEPLOY_USER=$1
DEPLOY_SERVER=$2

PUBLISH_DIR=visualizer

# publish the build
dotnet publish $(ls ../AST.Visualizer/*.csproj) --configuration "Release" --output ${PUBLISH_DIR} -p:PublishSingleFile=true -p:PublishTrimmed=true --self-contained --runtime linux-arm64

mkdir -p ${PUBLISH_DIR}/ClientApp/

cd ../AST.Visualizer/ClientApp 
npm ci
npm run build -c production

# move the client build files to the correct directory
cd ../../Install
mv ../AST.Visualizer/ClientApp/build ${PUBLISH_DIR}/ClientApp/build

# copy the files to the server
scp -r ${PUBLISH_DIR} ${DEPLOY_USER}@${DEPLOY_SERVER}:~

scp install.sh ${DEPLOY_USER}@${DEPLOY_SERVER}:~

ssh ${DEPLOY_USER}@${DEPLOY_SERVER} "bash install.sh"

#rm -rf ${PUBLISH_DIR}
