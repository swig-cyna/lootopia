#!/bin/sh
envsubst '${DASHBOARD_DOMAIN} ${MOBILE_DOMAIN}' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/nginx.conf
exec "$@"
