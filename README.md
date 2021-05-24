# TornadoSST Etl EVO Server

## AWS Setup

### Install Git

```bash
sudo apt update
sudo apt install git
git --version
```

### Install Docker

```bash
# Uninstall old versions
sudo apt-get remove docker docker-engine docker.io containerd runc

# SET UP THE REPOSITORY
sudo apt-get update
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker’s official GPG key:
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# For x86_64
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# INSTALL DOCKER ENGINE
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

source: https://docs.docker.com/engine/install/ubuntu/

### Setup SSH

```bash
# Lists the files in your .ssh directory, if they exist
ls -al ~/.ssh

# Generate new SSH Key
ssh-keygen -t ed25519 -C "djonnyx@gmail.com"

# Adding your SSH key to the ssh-agent
eval `ssh-agent -s`
ssh-add ~/.ssh/id_ed25519

# Open Pub Key
sudo nano /home/djonnyx/.ssh/id_ed25519.pub
```

Add the SSH key to GitHub account.

### Clone repository from github

```bash
cd usr/src

sudo git clone git@github.com:DjonnyX/tornado-etl-evo-server.git
```

## Build

```bash
cd ./tornado-etl-evo-server
npm run docker-compose:build
npm run docker-compose:run
```
