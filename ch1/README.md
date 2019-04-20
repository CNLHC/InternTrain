# CH1-全栈实现的抽奖活动

## 前端

1. 使用 `Canvas` 及相关API实现前端动画(可以兼容 ios6.0/Android 4.4+)
2. 使用 `XMLHttpRequest` 实现与后端的交互。

## 后端

使用`django` 提供简单的接口.

可以通过修改 `/backend/turntable/chance.conf.json`文件，并通过自定义命令 `updateChance` 将概率数据同步到数据库中.

使用`rest-framework` 添加了`Throttling`控制，同一客户端每60s只能访问接口10次.
