
function buildTestFastify() {
    const fastify = require('fastify')()
    fastify.register(require('../src/index'))
    fastify.register(require('./route'))
    return fastify
}

module.exports = buildTestFastify