# flight-tracker

# Run and Debug in development
**make sure to have docker installed**

# How to start flight-tracker
1. run `docker-compose up -d` (start flight-tracker and all dependent services)
2. run `docker exec -it flight-tracker bash` (jump inside the flight-tracker docker container)
3. run `npm run dev-start`
4. visit localhost:3000/errorTest (should see a predefined json error. if you do, were live!)

# How to debug with chrome devtools
1. run `docker exec -it flight-tracker bash` (jump inside the flight-tracker docker container)
2. if server is not running already, start it with `npm run dev-start`
3. in chrome, go to about:inspect
4. click on remote target link

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

Flights Endpoints

Quotes

Example:
http://localhost:3000/api/v1/flights/quotes?origin=sfo&destination=anywhere

Routes
Example:

http://localhost:3000/api/v1/flights/routes?origin=sfo&destination=anywhere
http://flight-tracker-1816596686.us-east-2.elb.amazonaws.com/api/v1/flights/quotes?origin=sfo&destination=anywhere

Pass all params as query params
- country (default US)
- currency (default usd)
- locale default (en-us)
- origin (required)
- destination (required)
- departureDate (default anytime)
- returnDate (default anytime)

# AWS
How to ssh into an ec2 instance running our docker containers
- aws ec2 describe-instances (grab publicDNS)
- ssh -i ${pem key} ec2-user@${publicDNS}
