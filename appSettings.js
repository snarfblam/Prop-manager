const db = require('./models');





function createDefaultAppSettings() {
    // Names must be unique
    var defaultSettings = [
        // Prepended to any relative paths (e.g. /tenant/activate/code) for display in UI or 
        // in email correspondance.Construct the full path using url.resolve(urlPrefix, relativePath)
        { name: 'urlPrefix', value: 'http://localhost:3001/' },
    ];

    return db.AppSetting
        .bulkCreate(defaultSettings)
        .then(() => defaultSettings)
        .catch(err => {
            console.error(err);
            process.exit(); // Consider this a fatal error
        });
}

module.exports = {
    settings: null,

    /**
     * Returns a promise which resolves when the settings have been loaded from the database.
     */
    init: function () {
        return db.AppSetting.findAll()
            .then(settings => {
                this.settings = settings;
                if (this.settings.length == 0) {
                    return createDefaultAppSettings()
                        .then(defSettings => { 
                            this.settings = defSettings;
                        });
                }
            });
    },

    /** Returns an app setting by the specified name
     * @param {string} name - Name of the setting to get
     */
    getSetting: function (name) {
        return this.settings.find(setting => (setting.name == name));
    },

    /** Returns a promise which resolves to {name, value} when the database is updated.
     * @param {string} name - Name of the setting to get
     * @param {string} value - Name of the setting to set
     * 
     */
    changeSetting: function (name, value) {
        return db.AppSetting
            .find({ where: { name: name } })
            .then(record => ({ name: record.name, value: record.value }));
    }
};