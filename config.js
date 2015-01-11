module.exports = {
    init: function(app) {
        app.set('configPort', 3000);
        app.set('configCmsSecret', 'hawsingCMS#Secret');
        app.set('configPlaybackSecret', 'playback#Secret');
        app.set('configWowzaOriginAddr', '192.168.0.129');
        app.set('configWowzaOriginPort', '8000');
    }
}