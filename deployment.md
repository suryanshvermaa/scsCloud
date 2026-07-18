# Deployment using KIND Cluser

## 1. Install docker
1. Set up Docker's apt repository.
```bash
# Add Docker's official GPG key:
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
``` 
2. Install the Docker packages.
```bash
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```
3. Give user to docker's group access and restart the system
```bash
sudo usermod -aG docker $USER && newgrp docker
```

## 2. Install kubectl
1. Download the latest release with the command:
```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
```
2. Install kubectl
```bash
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```
3. Verify the installation
```bash
kubectl version --client
```

## 3. Install Kind
1. installation
```bash
# download the latest release
[ $(uname -m) = x86_64 ] && curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.32.0/kind-linux-amd64
# move to local bin
sudo mv ./kind /usr/local/bin/kind
# make it executable
sudo chmod +x /usr/local/bin/kind
```
2. verify the installation
```bash
kind version
```

## 4. k9s (optional -> for better ui to interact with cluster)
1. installation
```bash
curl -LO https://github.com/derailed/k9s/releases/latest/download/k9s_Linux_amd64.tar.gz

tar -xzf k9s_Linux_amd64.tar.gz
# move to local bin
sudo mv k9s /usr/local/bin/
# make it executable
sudo chmod +x /usr/local/bin/k9s
```
2. Verify the installation
```bash
k9s version
```

## 5. clone the repository
```bash
git clone https://github.com/suryanshvermaa/scsCloud.git
cd scsCloud
cd k8s
```
## 6. Nginx
1. installation
```bash
sudo apt install nginx
```

## 7. follow next instructions
for cluster deplyment.<br>
[Cluster deplyment](./k8s/README.md)

## Nginx HTTPS wildcard domain configuration
1. certbot installation
```bash
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/local/bin/certbot
sudo snap set certbot trust-plugin-with-root=ok
```
2. cloudflare plugin if using cloudflare DNS
```bash
sudo snap install certbot-dns-cloudflare
```
3. Certificate generation
```bash
sudo certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /root/.secrets/cloudflare.ini \
  -d nebula-hack.tech \
  -d "*.nebula-hack.tech"
```