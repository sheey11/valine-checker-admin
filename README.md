# Valine Checker Admin
一个部署在服务器上的 7 * 24 小时全天候检测、管理 Valine 评论的工具。

# Feature
- [x] 🕑 7 * 24 小时检测  
- [x] 🤖 全自动化  
- [x] 🎉 评论管理  
- [x] 📝 日志查看

# TODO
- 优化用户体验
- 优化性能
- VC 出错时邮件通知

# 使用方法
需要 `node` 以及 `python3` (>=3.7)环境。
## 安装依赖库
```bash
$ cd pages
$ npm install
$ cd checker
$ python3 -m pip install -r requirements.txt
$ cd ../../server
$ npm install
```
## 修改配置文件
复制一份 `server/config.example.env` 到 `server/config.env`，修改配置项。    
> **注意**: 与 `Valine-Admin` 不同的是，`BLOGGER_MAIL` 项可以设置多个，中间由逗号隔开。

然后应用配置项
```shell
$ source server/checker/config.env
```

## 调试
```bash
$ ./debug.sh
# or
$ ./debug.yarn.sh
```
`express` 对 `vue` 有反向代理，所以直接访问 `http://localhost:3000` 即可。

## build
```bash
$ ./build.sh
# or
$ ./build.yarn.sh
```

## 部署
首先 `build`，然后复制 `server` 文件夹到服务器上，安装依赖，最后运行 `express`:
```bash
$ export NODE_ENV=prodction
$ npm start
```
# FAQ
- **Q: 为什么代码写的这么垃圾？**  
  A: 别问，问就是没搞过前端。