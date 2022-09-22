FROM node:latest
# Create the bot's directory
RUN mkdir -p /main/bot
WORKDIR /main/bot
COPY package.json /main/bot
RUN npm install
COPY . /main/bot
LABEL name="dreamvast" version="8.2.2022-1.1"
# Start the bot.
CMD ["npm", "start"]