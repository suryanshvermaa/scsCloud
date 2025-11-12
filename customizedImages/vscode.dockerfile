FROM kasmweb/vs-code:1.17.0

USER root
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    wget \
    ca-certificates \
    apt-transport-https \
    lsb-release \
    software-properties-common \
    vim \
    unzip \
    zip \
    jq
RUN apt-get install nodejs -y && \
    apt-get install npm -y

RUN apt-get install golang -y && \
    echo 'export GOPATH=$HOME/go' >> ~/.bashrc && \
    echo 'export PATH=$PATH:/usr/local/go/bin:$GOPATH/bin' >> ~/.bashrc
ENV GOPATH=/root/go
ENV PATH=$PATH:/usr/local/go/bin:$GOPATH/bin

RUN apt-get install python3 -y

RUN mkdir -p /home/kasm-user/Desktop && chown -R kasm-user:kasm-user /home/kasm-user/Desktop

RUN echo 'kasm-user:root' | chpasswd
RUN usermod -aG sudo kasm-user

USER kasm-user