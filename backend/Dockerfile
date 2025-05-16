FROM node:18

# Set working dir
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Install nodemon globally (optional but safer for containers)
RUN npm install -g nodemon

# Copy the app files
COPY . .

# Expose the backend port
EXPOSE 4000

# Use nodemon to start the server
CMD ["nodemon", "index.js"]
