# Valine Checker Admin
**🚧 WIP**

# 使用方法
## 安装依赖库
```bash
$ cd server
$ npm install
$ cd ../pages
$ npm install
```
## 修改配置文件
见 [valine-checker](https://github.com/Sheey11/valine-checker#%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95), 修改 `server/checker/config.json`。
## 调试
```bash
$ ./debug.sh
# or
$ ./debug.yarn.sh
```
`express` 运行的服务器在 `localhost:3000`，`vue` 运行的服务器在 `localhost:8080`。  

## build
```bash
$ ./build.sh
# or
$ ./build.yarn.sh
```

## 部署
首先 `build`，然后复制 `server` 文件夹到服务器上，运行 `express`:
```bash
$ npm run start
```


# FAQ
- **Q: 为什么代码写的这么垃圾？**  
  A: 别问，问就是没搞过前端。