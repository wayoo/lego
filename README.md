# lego

## Project setup
https://git.corp.wdeduc.com/wang/lego
https://git.corp.wdeduc.com/wang/lego-decorator

```
# 装修 + 预览项目
git clone https://git.corp.wdeduc.com/wang/lego-decorator
cd lego-decorator
npm install 
npm run serve

# 后台
git clone https://git.corp.wdeduc.com/wang/lego
cd lego 
npm install 
npm run serve
```
后台默认运行在 http://localhost:8080/ , 可从 Terminal 验证正确的地址。

保存位置文件之后，把下载的 json 文件放到 lego-decorator/data/site.json 位置，
访问 http://localhost:8809/realsite 可以验证保存的配置文件是否有效。

## TODO
+ Layout 布局支持
+ 更全面的模块描述文件，用于固定样式
+ 适配 H5
+ 拖拽替换成带提示的线框图

