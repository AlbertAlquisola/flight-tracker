# flight-tracker

# Run and Debug in development
**make sure to have docker installed**

# How to start flight-tracker
1. run `docker-compose up -d` (start flight-tracker and all dependent services)
2. run `docker exec -it flight-tracker bash` (jump inside the flight-tracker docker container)
3. run `npm run dev-start`
4. visit localhost:3000/errorTest (should see a predefined json error. if you do, were live!)

# How to start node inspector
1. run `docker exec -it flight-tracker bash` (jump inside the flight-tracker docker container)
2. run `node-inspector --no-preload`
3. visit localhost:8080 (node inspector server is running there)

# Docker

**building an image**
`docker build -t ${userName}/${repoName}:${tag} -f ${fileName} .`

**example**
`docker build -t albertalquisola/flight-tracker-core:0.0.1 -f Dockerfile.core .`

**how to push to dockerhub**
`docker push ${userName}/${repoName}:${tag}`

**example**
`docker push albertalquisola/flight-tracker-core:0.0.1`

# Database How Tos
**You will be prompted for a password so have it handy**
How to acccess inside the container
1. `docker exec -it flight-tracker bash`
2. `mysql -hflight-tracker-db -uroot -p`

How to access outside the container
1. `mysql -h127.0.0.1 -uroot -p`
s
Running a migration or seed script
`mysql -hflight-tracker-db -uroot -p < scripts/db/${nameOfScript}`

Flights Endpoint

Example:
http://localhost:3000/api/v1/flights?originPlace=sfo&destinationPlace=anywhere

Pass all params as query params
- country (default US)
- currency (default usd)
- locale default (en-us)
- originPlace (required)
- destinationPlace (required)
- inboundDate (default today)
- outboundDate (default 7 days from today)

