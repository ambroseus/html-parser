FROM zenika/alpine-chrome:83-with-node-12

WORKDIR /usr/src/app
COPY . .

RUN npm ci

ENV PORT=8082
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

EXPOSE 8082
ENTRYPOINT ["tini", "--"]

CMD [ "npm", "start" ]
