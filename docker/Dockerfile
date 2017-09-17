# PRODUCTION Dockerfile
FROM albertalquisola/flight-tracker-core:0.0.1
MAINTAINER Albert <aalquiso@gmail.com>

# Copy over all app files
COPY . /root/flight-tracker
RUN /bin/cp -fRT /tmp/node_modules/ /root/flight-tracker/node_modules/

# install node modules
RUN npm install

# Install NVM for node version manager
RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.25.0/install.sh | bash

# set node path
ENV NODE_PATH /root/flight-tracker/node_modules:/root/flight-tracker/lib:/root/flight-tracker:/usr/lib/nodejs:/usr/lib/node_modules:/usr/share/javascript

# Ports:
# 3000: flight-tracker endpoints
EXPOSE 3000

CMD /sbin/my_init -- ./start.sh
