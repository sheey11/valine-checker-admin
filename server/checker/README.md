# valine checker
轮询 Valine 的新评论并发送通知邮件。

# 使用方法
1. 至少需要 `python` >= `3.7` 的版本。
2. `pip3 install -r requirements.txt`
3. 如果编译失败，安装 `python3.x-dev`，再次编译。
4. 复制一份 `config.example.json` 为 `config.json`，修改配置项。
5. 各配置项见 [Valine-Admin](https://github.com/DesertsP/Valine-Admin)，注意这里为了修改是否已通知，使用的是 `master key`。
