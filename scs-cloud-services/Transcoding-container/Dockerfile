FROM ubuntu

RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y nodejs ffmpeg

WORKDIR /home/app

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
COPY main.sh main.sh
COPY download.js download.js
COPY outputs outputs

RUN chmod +x main.sh
RUN chmod +x download.js

RUN mkdir -p outputs/1080p outputs/720p outputs/480p outputs/360p



ENTRYPOINT [ "/home/app/main.sh" ]


