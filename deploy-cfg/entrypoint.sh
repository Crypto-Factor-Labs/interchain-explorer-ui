#!/bin/bash

[[ -z "${APP_BASE_URL}" ]] && apiBaseUrl="http://localhost" || apiBaseUrl="${APP_BASE_URL}"
[[ -z "${APP_PROD_FREQ}" ]] && apiProdFreq="60000" || apiProdFreq="${APP_PROD_FREQ}"
[[ -z "${EXTERNAL_EXPLORERS_JSON}" ]] && externalExplorers="" || externalExplorers="${EXTERNAL_EXPLORERS_JSON}"
[[ -z "${STATE_VALIDATION_CHAIN_ID}" ]] && stateValidationChainId="" || stateValidationChainId="${STATE_VALIDATION_CHAIN_ID}"

find /usr/share/nginx/html/ -type f -name "main*.js" -print0 | xargs -0 sed -i "s|{{apiBaseUrl}}|$apiBaseUrl|g"
find /usr/share/nginx/html/ -type f -name "main*.js" -print0 | xargs -0 sed -i "s|{{apiProdFreq}}|$apiProdFreq|g"
find /usr/share/nginx/html/ -type f -name "main*.js" -print0 | xargs -0 sed -i "s|{{externalExplorers}}|$externalExplorers|g"
find /usr/share/nginx/html/ -type f -name "main*.js" -print0 | xargs -0 sed -i "s|{{stateValidationChainId}}|$stateValidationChainId|g"

nginx -g "daemon off;"
