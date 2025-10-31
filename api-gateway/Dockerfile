FROM nginx:latest
# Copy config as template so nginx automatically substitutes environment variables
COPY default.conf /etc/nginx/templates/default.conf.template

# Expose Cloud Run port (default 8080, overridden to 80 in local docker-compose)
EXPOSE ${PORT}
CMD ["nginx", "-g", "daemon off;"]
