#!/bin/bash

[[ -z "${APP_BASE_URL}" ]] && apiBaseUrl="http://localhost" || apiBaseUrl="${APP_BASE_URL}"
[[ -z "${APP_PROD_FREQ}" ]] && apiProdFreq="60000" || apiProdFreq="${APP_PROD_FREQ}"
[[ -z "${EXTERNAL_EXPLORER_DMC}" ]] && defichainExplorerBaseUrl="" || defichainExplorerBaseUrl="${EXTERNAL_EXPLORER_DMC}"
[[ -z "${EXTERNAL_EXPLORER_PBC}" ]] && partisiaExplorerBaseUrl="" || partisiaExplorerBaseUrl="${EXTERNAL_EXPLORER_PBC}"
[[ -z "${EXTERNAL_EXPLORER_POL}" ]] && polygonExplorerBaseUrl="" || polygonExplorerBaseUrl="${EXTERNAL_EXPLORER_POL}"

find /usr/share/nginx/html/ -type f -name "main*.js" -print0 | xargs -0 sed -i "s|{{apiBaseUrl}}|$apiBaseUrl|g"
find /usr/share/nginx/html/ -type f -name "main*.js" -print0 | xargs -0 sed -i "s|{{apiProdFreq}}|$apiProdFreq|g"
find /usr/share/nginx/html/ -type f -name "main*.js" -print0 | xargs -0 sed -i "s|{{defichainExplorerBaseUrl}}|$defichainExplorerBaseUrl|g"
find /usr/share/nginx/html/ -type f -name "main*.js" -print0 | xargs -0 sed -i "s|{{partisiaExplorerBaseUrl}}|$partisiaExplorerBaseUrl|g"
find /usr/share/nginx/html/ -type f -name "main*.js" -print0 | xargs -0 sed -i "s|{{polygonExplorerBaseUrl}}|$polygonExplorerBaseUrl|g"

nginx -g "daemon off;"
