# Recruit Tree Deployment Guide

This guide details the environment required to host Recruit Tree on a VPS (Ubuntu 22.04).

## 1. Login to VPS & Update
```bash
ssh root@your_vps_ip
sudo apt update && sudo apt upgrade -y
```

## 2. Install Node.js (v20)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
# Verify
node -v
npm -v
```

## 3. Install Nginx (Web Server)
```bash
sudo apt install nginx -y
# Allow firewall traffic
sudo ufw allow 'Nginx Full'
```

## 4. Install Database (MongoDB Community)
*Note: You can also use MongoDB Atlas (Cloud) and just skip this step, using the connection string in your .env file.*

```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

## 5. Install Process Manager (PM2)
PM2 keeps your backend running 24/7.
```bash
sudo npm install -g pm2
```

## 6. Project Setup
1. Clone your repo to `/var/www/recruit-tree`.
2. Install dependencies:
   ```bash
   cd /var/www/recruit-tree
   npm install
   ```
3. Build the Frontend:
   ```bash
   npm run build
   # This creates the 'dist' folder
   ```

## 7. Nginx Configuration
Create a config file: `sudo nano /etc/nginx/sites-available/recruit-tree`

```nginx
server {
    listen 80;
    server_name your_domain.com; # Or your IP

    # 1. Serve React Frontend
    location / {
        root /var/www/recruit-tree/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 2. Proxy API requests to Backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/recruit-tree /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 8. Start Backend
```bash
# Start server.js using PM2
pm2 start server.js --name "recruit-backend"
pm2 save
pm2 startup
```
