/**
 * @file travis karma
 * @author ludafa <ludafa@outlook.com>
 */

const karmaConfig = require('./karma.conf.js');

module.exports = function (config) {

    config.set(
        Object.assign(
            {},
            karmaConfig,
            {
                customLaunchers: {
                    ChromeTravis: {
                        base: 'Chrome',
                        flags: ['--no-sandbox']
                    }
                },
                browsers: ['ChromeTravis'],
                reporters: ['coverage', 'mocha', 'dots'],
                singleRun: true
            }
        )
    );

};
