import test from 'ava';
const buildFastify = require('../testUtil/build')
const parseClientIP =  require('../src/getClientIP')

const HeaderToTest = [
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



const fastify = buildFastify()
test('Header/No', async t => {
    await fastify.inject({
        method: "GET",
        url: "/",
    }).then(res =>
        t.deepEqual(JSON.parse(res.rawPayload.toString()), {
            RealIP: "127.0.0.1"
        })
    ).catch(e =>
        t.fail()
    )
});

test('Header/Basic', async t => {
    for (var i = 0; i < HeaderToTest.length; i++) {
        var head = {}
        head[HeaderToTest[i]] = "192.168.1.1"
        await fastify.inject({
            method: "GET",
            url: "/",
            headers: head
        }).then(res =>
            t.deepEqual(JSON.parse(res.rawPayload.toString()), {
                RealIP: "192.168.1.1"
            })
        ).catch(e =>
            t.fail()
        )
    }
});


test('Header/x-forwarded-for', async t => {
    await fastify.inject({
        method: "GET",
        url: "/",
        headers:{
            "x-forwarded-for":"192.168.1.1 192.168.1.2 192.168.1.3"
        }
    }).then(res =>
        t.deepEqual(JSON.parse(res.rawPayload.toString()), {
            RealIP: "192.168.1.1"
        })
    ).catch(e =>
        t.fail()
    )
});

test('Header/forwarded', async t => {
    await fastify.inject({
        method: "GET",
        url: "/",
        headers:{
            "forwarded":"for=192.168.1.1, for=198.51.100.17"
        }
    }).then(res =>
        t.deepEqual(JSON.parse(res.rawPayload.toString()), {
            RealIP: "192.168.1.1"
        })
    ).catch(e =>
        t.fail()
    )
});

test('Direct/connection-socket-remoteAddress', t=>{
    const mockReq = {
        connection: {
            socket: {
                remoteAddress: '192.168.1.2',
            },
        },
    };
    t.deepEqual("192.168.1.2",parseClientIP(mockReq))
})

test('Direct/socket-remoteAddress', t=>{
    const mockReq = {
        socket: {
            remoteAddress: '192.168.1.2',
        },
    };
    t.deepEqual("192.168.1.2",parseClientIP(mockReq))
})

test('Direct/info-remoteAddress', t=>{
    const mockReq = {
        info: {
            remoteAddress: '192.168.1.2',
        },
    };
    t.deepEqual("192.168.1.2",parseClientIP(mockReq))
})

test('Direct/connection-remoteAddress', t=>{
    const mockReq = {
        connection: {
            remoteAddress: '192.168.1.2',
        },
    };
    t.deepEqual("192.168.1.2",parseClientIP(mockReq))
})