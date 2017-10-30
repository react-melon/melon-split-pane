/**
 * @file test index
 * @author leon <ludafa@outlook.com>
 */

const specContext = require.context('./spec', true, /\.spec\.js$/)
const specs = specContext
    .keys()
    .filter(spec => /\.spec\.js$/.test(spec))
    .forEach(specContext)
