"use strict";

const fp = require('fastify-plugin')
const parseClientIP = require('./getClientIP')


function getRealIP(fastify, opts, next) {
    fastify.decorateRequest('getRealIP', function () {
        const {
            req
        } = this
        this.headers['realIP'] =parseClientIP(req)
    })

    fastify.addHook('preHandler', (request, reply, done) => {
        request.getRealIP('real-ip')
        done()
    })
    next()
}

module.exports = fp(getRealIP)