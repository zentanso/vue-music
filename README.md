# vue-music

> 基于vue全家桶开发的网易云音乐webApp，UI基于vux进行定制
> 
> 后端基于[Binaryify](https://github.com/Binaryify)提供的网易云音乐[API](https://github.com/Binaryify)，感谢这位大大

## 技术栈
* vue2
* vuex
* vue-router
* webpack
* ES6/7
* less
* axios
* flex

## 功能列表
- [x] 播放器基本功能（曲目切换，播放暂停，模式切换等）
- [x] 滚动歌词显示
- [x] 搜索（目前只做了单曲和歌单搜索）
- [x] 热门歌单（主要华语，欧美，电子三类）
- [x] 推荐歌单
- [x] 推荐音乐
- [x] 排行榜
- [x] 歌单详情
- [x] 播放列表
- [x] 评论查看
- [x] 登录（只能是手机号登陆）
- [x] 私人FM（需登录）
- [x] 用户信息查看（需登录）
- [x] 每日歌曲推荐（需登录）
- [x] 喜欢歌曲（需登录）
- [x] 扔进垃圾桶（需登录）

## 项目运行

``` bash
# 需要先clone后端api，并运行服务
git clone https://github.com/Binaryify/NeteaseCloudMusicApi.git

# 安装依赖
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

```
## 功能演示
### 歌单详情
<img src='http://i1.buimg.com/1949/0512fe916a0f1c94.gif'>

### 播放列表
<img src='http://i1.buimg.com/1949/76cc02063593412c.gif'>

### 歌曲详情
<img src='http://i1.buimg.com/1949/416daeeb050e3bf3.gif'>

### 每日推荐
<img src='http://i1.buimg.com/1949/20d896a9681ca8c6.gif'>

### 排行榜
<img src='http://i1.buimg.com/1949/abd3a20a5c417bc3.gif'>

### 歌曲评论
<img src='http://i1.buimg.com/1949/13411544dfb9fa18.gif'>

### 热门歌单推荐
<img src='http://i1.buimg.com/1949/6a3e09931e5ab301.gif'>

### 私人FM
<img src='http://i1.buimg.com/1949/bacfc2f9b71e32ea.gif'>

### 搜索
<img src='http://i1.buimg.com/1949/0554a7b46166faa3.gif'>

### 用户信息
<img src='http://i1.buimg.com/1949/d10285719920bbc7.gif'>