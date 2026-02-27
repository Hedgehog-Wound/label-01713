# 基础镜像：nginx:1.27-alpine 支持 AMD64 / ARM64 / ARM v7
FROM nginx:1.27-alpine

RUN rm -rf /usr/share/nginx/html/*
COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
