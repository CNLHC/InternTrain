
function buildTestFastify() {
    const fastify = require('fastify')({
        logger: true
    })
    fastify.register(require('../getRealIP'))
    fastify.register(require('./route'))
    return fastify
}

module.exports = buildTestFastify