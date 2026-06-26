FROM mcr.microsoft.com/devcontainers/javascript-node:20

RUN apt-get update && apt-get install -y \
    ffmpeg \
    git \
    curl \
    wget

WORKDIR /workspace

COPY package*.json ./

RUN npm install
