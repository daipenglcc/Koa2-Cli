# KOA-基础模板

基于 koa 搭建的符合 RESTful 结构后端基础脚手架

## 前言

知乎：https://zhuanlan.zhihu.com/p/492827111

service层分离：https://github.com/ikcamp/koa2-tutorial/tree/4-refactor

详细搭建过程可以看这一篇：[Koa2 从零到脚手架](https://blog.azhubaby.com/2021/08/24/2021-08-24-Koa2%E4%BB%8E%E9%9B%B6%E5%88%B0%E8%84%9A%E6%89%8B%E6%9E%B6/)

Mongoose解决MongoDB弃用警告（DeprecationWarning）https://blog.csdn.net/qq_42760049/article/details/98593923?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-2&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-2

Koa中间件使用之koa-jwt：https://www.jianshu.com/p/2552cdf35e66

koa获取请求参数的三种方法：https://www.jianshu.com/p/4f7877eba40e

## 其他

koa2安装使用教程：https://www.itying.com/koa/start-install.html

## 获取请求参数

- 原始get

ctx.request.query

- 原始post

ctx.req

- 获取post(通过koa-bodyparser)

post:ctx.request.body

- 获取动态路由的传值

git:ctx.params

## 使用的中间件

- koa-router——路由解决方案
- koa-bodyparser——请求体解析
- koa-static—— 提供静态资源服务
- @koa/cors——跨域
- koa-json-error——处理错误
- koa-parameter —— 参数校验
- http-assert—— 断言

## 项目目录

````
```
├── config                          运行配置
│   ├── index.js
├── controller                      控制器，控制数据库
│   ├── home.js                     主/根
│   ├── user.js                     用户
├── db                              连接数据库
│   ├── index.js
├── models                          模型(数据库)
│   ├── User.js                     用户模型
├── public                          静态资源目录
├── routes                          路由配置
│   ├── home.js                     主/根
│   ├── index.js                    路由配置主文件
│   ├── user.js                     用户
├── .editorconfig                   统一编码配置文件
├── .gitignore
├── index.js                        入口文件
├── package.json
├── README.md
```
````
