const fastify = require('fastify')({
    logger: true
})

fastify.register(require('./getRealIP'))

fastify.listen(3000, (err, address) => {
    fastify.log.info(`server listening on ${address}`)
})