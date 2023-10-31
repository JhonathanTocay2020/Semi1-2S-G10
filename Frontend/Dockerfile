# Build Environment
FROM node:19.0.0-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
# Have a .dockerignore file ignoring node_modules and build
COPY . ./
RUN npm run build
# Production
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]