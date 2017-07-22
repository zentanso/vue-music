所有的vue.js组件都是被扩展的vue实例
生命周期：
过滤器filters

计算属性computed:抽离计算逻辑
计算属性与method：
计算属性：“依赖”变化，它才变化
  get
  set
method：不管怎样都会执行
watch

样式：数组语法

条件渲染
## key标记模板，说明元素是否复用

v-if 与v-show
v-if：真正的元素切换
v-show：只是简单的display

列表渲染：
v-for
v-for with v-if 列表条件渲染

数组变异方法：
非变异方法不能检测数组更新

事件处理：
事件修饰符：

表单：
v-model 双向数据绑定

## 组件
组件data必须为函数

父子组件：（单向数据流）
props down
events up ==> 父组件监听子组件抛出的事件，子组件通过$emit来抛出事件

父组件模板的内容在父组件作用域内编译；子组件模板的内容在子组件作用域内编译
slot机制：
子组件提供slot插槽供父组件

动态组件

keep-alive

component with is

vue响应式原理：
异步执行DOM更新：


## --------------music app-------------------------

基本思路：
audio标签必须处于根位置也就是app.vue上面，保证任何页面切换都无法将其卸载

playbar不应该出现的位置：
音乐详情页
歌曲评论页

路由设计：
app-->(audio)
  home
    recommend
    songlist
    radiostation
    ranklist

  songdetail

  songlistdetail

  singerdetail

vuex state设计:
仅仅共享音频部分，常用组件使用keep-alive来进行组件缓存

## 知识点
### es6异步操作实现：
#### 回调函数
#### promise对象
#### generator 函数
- yield：
  - 定义状态，遇到时暂停后面操作，执行next时执行上个yield到这个yield所在的语句，并返回yield的返回值
  - 只能在generator函数中运用
  - 本身没有返回值
- next：获取状态
  - 向next传参后默认为上一个yield的返回值
- 自动执行:
  - Thunk函数：一级柯里化普通参数和回调函数,也就是首先接收普通参数，然后接受回调函数
  - 拥有thunk函数以后，我们可以实现generator流程的自动化，
  - promise对象

#### async await
  - async
  - await 后接promise对象
    - 一个await reject的时候async函数后面所有语句都终止执行
    - 解决方法：try catch
