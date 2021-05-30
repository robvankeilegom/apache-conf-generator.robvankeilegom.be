./node_modules/.bin/ng build --configuration production
rsync -av ./dist/apache-conf-generator/ apache-conf-generator.robvankeilegom.be:~/webroot/apache-conf-generator.robvankeilegom.be/ --delete

