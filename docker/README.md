this folder should contain all scripts that need to be run on container start
they need to be copied over to the proper directory in the proper docker file

use Dockefile.development as a reference

Documentation on the baseimage init system can be found here:
https://github.com/phusion/baseimage-docker#running-scripts-during-container-startup

# Docker How Tos

to build a new docker image
docker build -t ${userName}/${repoName}:${tag} -f ${filename} .

example
docker build -t albertalquisola/flight-tracker-core:0.0.1 -f Dockerfile.core .

how to push to dockerhub
docker push $(userName)/${repoName}:${tag}

example
docker push albertalquisola/flight-tracker-core:0.0.1