FROM nginx:latest
COPY default.conf /etc/nginx/conf.d/default.conf
# Expose Cloud Run port
ENV PORT 8080
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]