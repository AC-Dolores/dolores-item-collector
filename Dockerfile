FROM daocloud.io/library/node:7.2

RUN apt-get update && apt-get -y install cron
# set the china time zone for the cron job

ENV YARN_VERSION 0.21.3
ENV YARN_HOME /yarn-${YARN_VERSION}
RUN mkdir ${YARN_HOME} && \
  curl -L https://github.com/yarnpkg/yarn/releases/download/v${YARN_VERSION}/yarn-v${YARN_VERSION}.tar.gz | tar xzC ${YARN_HOME} --strip-components=1
ENV PATH ${YARN_HOME}/bin:$PATH

WORKDIR /app

ADD yarn.lock /app/yarn.lock
ADD package.json /app/package.json

RUN yarn install --frozen-lockfile

COPY . /app
#ADD ./run/crontab /etc/cron.d/dolores-cron

#RUN chmod +x /app/run/run.sh


# Give execution rights on the cron job
#RUN chmod 0644 /etc/cron.d/dolores-cron

# Create the log file to be able to run tail
#RUN touch /var/log/cron.log

# Run the command on container startup
CMD node index.js
# Add crontab file in the cron directory

# Give execution rights on the cron crontab


# Create the log file to be able to run tail


# Run the command on container startup
#CMD cron && tail -f /var/log/cron.log


