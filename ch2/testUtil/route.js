async function routes (fastify, options) {
    fastify.get('/', async (request, reply) => {
        reply.send({RealIP: request.headers['realIP']}) 
    })
}
  
  module.exports = routes