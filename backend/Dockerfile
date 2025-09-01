FROM node:18

# Install Chrome
RUN apt-get update && apt-get install -y \
    wget gnupg \
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Install Tor
RUN apt-get update && apt-get install -y tor

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY ./tor/torrc /etc/tor/torrc

CMD ["sh", "-c", "tor & node server.js"]