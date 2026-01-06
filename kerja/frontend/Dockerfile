FROM node:18-alpine as build

WORKDIR /app

ARG REACT_APP_API_URL=http://localhost:3000/api
ARG REACT_APP_USER_ID=user-123

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_USER_ID=$REACT_APP_USER_ID

COPY package*.json ./
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

