./node_modules/.bin/ng build --prod
rsync -av ./dist/apache-conf-generator/ user@robvankeilegom.be:~/web/apache-conf-generator.robvankeilegom.be/
