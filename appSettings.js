const db = require('./models');





function createDefaultAppSettings() {
    // Names must be unique
    var defaultSettings = [
        // Prepended to any relative paths (e.g. /tenant/activate/code) for display in UI or 
        // in email correspondance.Construct the full path using url.resolve(urlPrefix, relativePath)
        { name: 'urlPrefix', value: 'http://localhost:3001/' },
        { name: 'appTitle', value: 'Tenant Service Portal' },
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
    /** @type {{name: string, value: string}[]} */
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
        var setting = this.settings.find(setting => (setting.name == name));
        if (setting) return setting.value;
        return null;
    },

    /**
     * Gets all app settings
     */
    getAllSettings: function () {
        return [...(this.settings)];
    },

    /** Returns Promis<{name, value}> when the database is updated.
     *  
     * @param {string} name - Name of the setting to get
     * @param {string} value - Name of the setting to set
     * 
     */
    changeSetting: function (name, value) {
        // Find, then update or create new as needed. Then update this.settings
        return db.AppSetting
            .findOne({
                where: { name: value }
            }).then(setting => {
                if (setting) {
                    return setting.update({ value: value });
                } else {
                    return db.AppSetting.create({ name: name, value: value });
                }
            }).then(setting => {
                var newSetting = { name: name, value: record.value };

                var indexOf = this.settings.findIndex(item => item.name === name);
                if (indexOf < 0) indexOf = this.settings.length;
                this.settings[indexOf] = newSetting;

                return { name: record.name, value: setting.value };
            });
    }
};