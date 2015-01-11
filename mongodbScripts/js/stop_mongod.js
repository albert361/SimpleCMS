db = connect("localhost:27017/admin");
db.auth('CMSadmin', 'IPTV#hawsing232');
db.shutdownServer();
quit();
