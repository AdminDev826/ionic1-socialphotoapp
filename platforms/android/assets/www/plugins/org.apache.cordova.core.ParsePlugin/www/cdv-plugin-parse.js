cordova.define("org.apache.cordova.core.ParsePlugin.ParsePlugin", function(require, exports, module) {
var ParsePlugin = {
    register: function(regParams, successCallback, errorCallback) {
        cordova.exec(
            successCallback, errorCallback,
            'ParsePlugin', 'register',
            [regParams]
        );
    },

    getInstallationId: function(successCallback, errorCallback) {
        cordova.exec(
            successCallback, errorCallback,
            'ParsePlugin', 'getInstallationId',
            []
        );
    },

    getInstallationObjectId: function(successCallback, errorCallback) {
        cordova.exec(
            successCallback, errorCallback,
            'ParsePlugin', 'getInstallationObjectId',
            []
        );
    },

    getSubscriptions: function(successCallback, errorCallback) {
        cordova.exec(
            successCallback, errorCallback,
            'ParsePlugin', 'getSubscriptions',
            []
        );
    },

    subscribe: function(channel, successCallback, errorCallback) {
        cordova.exec(
            successCallback,
            errorCallback,
            'ParsePlugin',
            'subscribe',
            [ channel ]
        );
    },

    unsubscribe: function(channel, successCallback, errorCallback) {
        cordova.exec(
            successCallback,
            errorCallback,
            'ParsePlugin',
            'unsubscribe',
            [ channel ]
        );
    }
};
module.exports = ParsePlugin;

});
