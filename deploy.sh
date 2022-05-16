./node_modules/.bin/ng build --configuration production
rsync -av ./dist/apache-conf-generator/ apache-conf-generator.robvankeilegom.be:~/websites/apache-conf-generator.robvankeilegom.be/current --delete

