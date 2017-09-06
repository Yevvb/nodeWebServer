## express web server

```javascript
  // 确保先执行 npm install
  const express = require('express');

  var app = express();

  // 静态web服务器，中间件

  // handle request... blabla

  app.listen(3000, () => {
    // console.log(...)
  });
```

#### 静态 web 服务器中间件

```javascript
  // 这时候 express 会将静态文件的请求转到 /public 文件夹
  // localhost:3000/index.html  <-- public/index.html
  app.use(express.static(__dirname + '/public'));
```

#### 处理请求以及路由配置

```javascript
  app.get('/', (req, res) => {
    // res.send() 可以传入对象作为 json，可以发送文本，etc
    res.send();
  });

  // 这里用到了 handlebars -- hbs 模板引擎，后面会介绍
  app.get('/about', (req, res) => {
    // res.render() --> 指将数据渲染到对应模板，然后返回渲染后的文件
    res.render('about.hbs', {
      pageTitle: "About page",
      currentYear: new Date().getFullYear()
    })
  });
```

#### 模板渲染引擎

渲染引擎有很多 pug（jade）、ejs、handlerbars 等等

这里主要介绍 handlerbars，支持友好

```
  // 首先确保 npm i hbs -S
  const hbs = require('hbs');

  // 注册 hbs 所有子组件（复用组件）
  hbs.registerPartials(__dirname + '/views/partials');

  // express.set() ---> 设置模板引擎为 hbs
  express.set('view engine', 'hbs');
```

#### [handlebars](http://handlebarsjs.com/)

> **`hbs.registerPartials(__dirname + 'views/partials')`**

注册 hbs 组件，以便复用，使用方式 `{{> component}}`

> **`hbs.registerHelper(func, () => {})`**

注册 hbs 方法，以便在 hbs 模板中调用，使用方式 {{func 参数1 参数2}} 参数可选


```javascript
  hbs.registerHelper('scream', (text) => {
    return text.toUpperCase();
  })
```

```
  // 在 xxx.hbs 中使用，也可以在 partials 中使用
  // message 是调用 res.render('xxx.hbs', {message: 'some text'}) 传入的参数
  {{scream message}}
```


## middlewares

最上面我们提到 express 自带的处理静态文件的中间件

**`app.use(express.static(__dirname + '/public'))`**

那么如何使用中间件来处理请求、验证用户输入之类的呢？

```javascript
  app.use((req, res, next) => {
    // 注意这里，只有调用 next() 之后，请求才能继续走下去
    next(); // 注释之后观察浏览器 network，虽然发起请求但是没有响应，一直在加载 
  });
```

所以，调用 middlewares 的方法就是 app.use()，

当我们需要对请求、响应做处理时，就可以在 next() 之前做文章。

比如说，网站维护升级（看例子）：

```javascript
  app.use((req, res, next) => {
    res.render('maintaince.hbs',{message: '网站升级，预计1小时...'})
  });

  // 放在，express.static() 中间件之前
```

这时候，你访问任何路径或者资源都会显示升级的通知。
