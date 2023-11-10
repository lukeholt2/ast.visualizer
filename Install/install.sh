#!/bin/bash

sudo systemctl stop visualizer.service

if [ -d /opt/visualizer_backup ]; then
    rm -rf /opt/visualizer_backup
fi
if [ -d /opt/visualizer ]; then
    mv /opt/visualizer /opt/visualizer_backup
fi

mv visualizer /opt/visualizer
cd /opt/visualizer
chmod +x *so
chmod +x AST.Visualizer
cd 
sudo systemctl restart visualizer.service
sleep 3 # sleep for 3 seconds to give it time to startup
systemctl status visualizer.service
