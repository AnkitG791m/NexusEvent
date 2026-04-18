# Build stage
FROM node:18 as build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage (NGINX)
FROM nginx:alpine

# Remove default config
RUN rm -rf /usr/share/nginx/html/*

# Copy build files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]