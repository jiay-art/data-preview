vscode 插件开发需求：

1.点击Tree View图标打开侧边栏显示配置中的内容，侧边栏以html列表展示数据，

数据从my-data.json中获取， my-data.json必须存在于.vscode 目录在项目的根层次。

数据格式为:

```
json
[{
"gtkware":"sss",
"5900":"xxx",
"6080":"xxxx",
"url":"http://xxxx/com"
}]
```

以列表的形式展示在侧边栏中

2.点击列表中的地址跳转到vscode预览网页或者跳转到外部默认浏览器


打包命令vsce package
