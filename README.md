# nodejs-360-video-server
a 360 node js video server with a react vr video player

1) Install all the dependencies in `services/player` and `services/server` with:
`npm install`

2) Build docker container with:
`docker-compose build`

(install docker if needed)

3) Run container with:
`docker-compose up`

Put videos in de video folder inside `services/server`

Open the player in your browser with the url:
`http://localhost:8081/vr/
