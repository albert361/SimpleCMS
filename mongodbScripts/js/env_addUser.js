var db = connect('localhost:27017/admin');
db.addUser('CMSadmin', 'IPTV#hawsing232');
db.shutdownServer();
quit();