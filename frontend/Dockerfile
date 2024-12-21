# Dockerfile for React frontend
FROM node:16 AS build

WORKDIR /app

# Copy package.json and optionally package-lock.json
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . ./

# Build the React app
RUN npm run build

# Use Nginx to serve the React build
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

