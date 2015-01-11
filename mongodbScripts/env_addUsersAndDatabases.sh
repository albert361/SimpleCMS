#start mongodb
sudo mongod --fork -logpath /var/log/mongodb.log
#connect & add admin & shutdown
mongo js/env_addUser.js
SLEEP 3
#start mongodb in auth mode
sudo mongod --auth --fork --logpath /var/log/mongodb.log
mongo js/env_addDatabase.js