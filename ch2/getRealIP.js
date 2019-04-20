const fp = require('fastify-plugin')

const HeaderToCheck = [
    "x-client-ip", //Amazon EC2, Heroku
    "x-forwarded-for", //SQUID - https://wiki.squid-cache.org/SquidFaq/ConfiguringSquid#head-3518b69c63e221cc3cd7885415e365ffaf3dd27f
    "cf-connecting-ip", //Cloudflare, https://support.cloudflare.com/hc/en-us/articles/200170986-How-does-Cloudflare-handle-HTTP-Request-headers-
    "fastly-client-ip", //Fastly + FireBase
    "true-client-ip", //Akami+Cloudflare, https://support.cloudflare.com/hc/en-us/articles/200170986-How-does-Cloudflare-handle-HTTP-Request-headers-
    "x-real-ip", //Nginx+FastCGI ref to nginx- http://nginx.org/en/docs/http/ngx_http_realip_module.html#real_ip_header
    "x-cluster-client-ip", //Rackspace LB, Riverbed Stingray https://community.pulsesecure.net/t5/Pulse-Secure-vADC/IP-Transparency-Preserving-the-Client-IP-address-in-Stingray/ta-p/29415
    "x-forwarded", //Can't find document, assueming have same format to x-forwarded-for
    "forwarded-for", //Can't find document, assueming have same format to x-forwarded-for
    "forwarded", //RFC-7239 https://tools.ietf.org/html/rfc7239#section-5.2
    //Warning:If you're interested in the actual client (visitor) IP address, we recommend relying on the CF-Connecting-IP (or True-Client-IP) instead of X-Forwarded-For.
]

pattern = /\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|)){4}\b/

const isValidIP = (s) => typeof s === "string" ? s.match(pattern)[0] !== null :false

const parseHeader = (req) => {
    for (let i = 0; i < HeaderToCheck.length; i++) 
        if(isValidIP(req.headers[HeaderToCheck[i]]))
            return req.headers[HeaderToCheck[i]].match(pattern)[0].replace(new RegExp('(,|\s)'),'')

    if (req.connection !== undefined) {
        if (isValidIP(req.connection.remoteAddress)) {
            return req.connection.remoteAddress;
        }
        if ((req.connection.socket) !== undefined && isValidIP(req.connection.socket.remoteAddress)) {
            return req.connection.socket.remoteAddress;
        }
    }

    if ((req.socket) !== undefined && isValidIP(req.socket.remoteAddress))
        return req.socket.remoteAddress;

    if ((req.info) !== undefined && isValidIP(req.info.remoteAddress))
        return req.info.remoteAddress;

    if ((req.requestContext) !== undefined && (req.requestContext.identity) !== undefined && isValidIP(req.requestContext.identity.sourceIp))
        return req.requestContext.identity.sourceIp;
}

function getRealIP(fastify, opts, next) {
    fastify.decorateRequest('getRealIP', function () {
        const {
            req
        } = this
        this.headers['realIP'] = parseHeader(req)
        console.log(parseHeader(req))
    })

    fastify.addHook('preHandler', (request, reply, done) => {
        request.getRealIP('real-ip')
        done()
    })
    next()
}

module.exports = fp(getRealIP)