FROM node:16
WORKDIR /app
COPY package*.json ./

# Install the dependencies
RUN yarn install

# Copy the rest of the application code to the container
COPY . .

# Expose the port that the server will listen on
EXPOSE 8000
EXPOSE 8080

CMD ["node", "server.js"]