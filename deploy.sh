./node_modules/.bin/ng build --prod
rsync -av ./dist/apache-conf-generator/ apache-conf-generator.robvankeilegom.be:~/webroot/apache-conf-generator.robvankeilegom.be/ --delete

