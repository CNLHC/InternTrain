# CH2: 实现Bypass Proxy/LB

## 实现思路

同 https://github.com/byte-fe/intern-study/issues/23 中的描述

1. 检查特定Header
2. 检查 `Node` `req`对象
3. 检查附加字段

## 测试思路

### 附加额外Header

使用 `Fastify` 提供的 `Inject` 功能进行测试。构造一个注册了被测插件的 `fastify`对象，并为其添加一个回环接口。
回环接口返回经过被测插件处理后的真实IP地址。

在 `AVA` `TestCase`中,使用`fastify` 提供的 `inject` 方法，通过改变Headers，构造不同的请求头,模拟存在代理/负载均衡时的情形,访问上述回环接口,并
断言将返回的IP与构造IP相等。

### 直连或透穿

利用先验知识构造一个与待测字段真实情况吻合的`req`对象，直接调用解析客户端IP的函数进行测试。

## 测试运行

```shell
cd ch2
yarn install
yarn test
```
