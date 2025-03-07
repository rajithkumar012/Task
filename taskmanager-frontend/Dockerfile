# Use official Node.js image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend project files
COPY . .

# Expose the frontend port
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
