#!/bin/bash

echo "starting webpack dev" && export NODE_OPTIONS="--max_old_space_size=4096" && yarn && rm -rf /app/public/packs && bin/webpack && bin/webpack-dev-server