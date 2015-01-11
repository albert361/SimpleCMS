db = connect("localhost:27017/admin");
db.auth('CMSadmin', 'IPTV#hawsing232');
cmsdb = db.getSiblingDB('cmsdb');
cmsdb.createCollection('deviceIds');
cmsdb.deviceIds.ensureIndex( { deviceId: 1 }, { unique: true } );
cmsdb.createCollection('channels');
cmsdb.channels.ensureIndex( { name: 1 }, { unique: true } );