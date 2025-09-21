#!/bin/bash

[[ -z "${APP_BASE_URL}" ]] && apiBaseUrl="http://localhost" || apiBaseUrl="${APP_BASE_URL}"

find /usr/share/nginx/html/ -type f -name "main*.js" -print0 | xargs -0 sed -i "s|{{apiBaseUrl}}|$apiBaseUrl|g"

nginx -g "daemon off;"
