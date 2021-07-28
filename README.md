# ![logo](webcam-cctv.png) Webcam CCTV
Webcam CCTV is a security camera system with web-based clients and dashboard

## Features
- Select video and audio capture devices to stream
- Support for multiple broadcasting clients
- Password-protected dashboard
- Mute/unmute audio streams
- Zoom video streams
- Automatic client reconnect on network disruptions
- Light and responsive UI
- Saves bandwidth when nobody's watching

https://user-images.githubusercontent.com/4363111/127362889-e4cb5599-8ade-4a69-a3f2-67a41d6722b1.mp4

## Requirements
To run, Webcam CCTV requires either Node.js or Docker installed

> `IMPORTANT:`
>
> Due to all modern browsers requiring an HTTPS connection to allow access to local capture devices, this application must be run behind an SSL-terminating proxy or with an [SSL key and certificate supplied ](#runtime-variables).

## Runtime variables
Name     | Default | Example            | Description
---------|---------|--------------------|------------
PORT     | 3000    | 8080               | The port on which the app should bind to
PASSWORD | test    | MyStr0ngP4$s       | Password for accessing the dashboard
SSL_KEY  |         | -----BEGIN RSA...  | SSL private key in PEM format
SSL_CERT |         | -----BEGIN CERT... | SSL certificate chain in PEM format
SSL_PASS |         | MySslPass          | Optional passphrase for the private key

## Running with Docker
```sh
sudo docker run -d ttecss/webcam-cctv
```

## Installation
```sh
npm install
npm run build
```

## Running
```sh
npm start
```
