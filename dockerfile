FROM node:lts-buster

# set working directory
WORKDIR /app
EXPOSE 3001

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# add app
COPY . ./

# start app
CMD ["pwd"]
CMD ["npm", "start"]
