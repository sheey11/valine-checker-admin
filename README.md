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

```bash
$ git clone https://github.com/Sheey11/valine-checker-admin.git
```
## 安装依赖库
```bash
$ npm install
$ cd checker
$ python3 -m pip install -r requirements.txt
```
## 修改配置文件
复制一份 `checker/config.example.env` 到 `checker/config.env`，修改配置项。  
配置项与 [Valine Admin](https://github.com/DesertsP/Valine-Admin#快速部署) 基本一致，不一样的配置项有：
- `BLOGGER_MAIL`，此项可以设置多个，中间由逗号隔开。
- `LOGIN_USERNAME`，登陆时的用户名。
- `LOGIN_PASSWORD`，登陆时的密码。
- `PYTHON_COMMAND`，使用的 `python` 命令。

然后应用配置项
```shell
$ source checker/config.env
```
> 你也可以直接在部署环境里直接添加环境变量。

## 运行
```shell
$ export NODE_ENV=production
$ npm start
```
之后 Valine Checker Admin 就会运行在 `3000` 端口。
