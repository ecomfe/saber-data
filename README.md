# saber-data [![Build Status](https://travis-ci.org/ecomfe/saber-data.png)](https://travis-ci.org/ecomfe/saber-data)

常用数据逻辑封装

## Usage

通过`edp`引入模块

    $ edp import saber-data

```javascript

var DataList = require('saber-data');

var datalist = new DataList('data/list');

datalist.on('query:before', function () {
    this.queryInfo.beforeQuery = 1;
    console.log(this);
});

datalist.on('query', function () {
    console.log(this);
});

datalist.on('query:after', function () {
    this.data = this.data.map(function (item) {
        var itemNew = {};
        Object.keys(item).forEach(function (key) {
            itemNew[key.replace(/^org_/, '')] = item;
        });
        return itemNew;
    });
});

datalist.query({
    query: 1
}).then(function (data) {
    console.log(data);
});

```

## Test

启动测试服务器

    $ node test/server.js

默认端口为`8848`，可以通过参数修改：

    $ node test/server.js 8080

访问`http://localhost:8848/test/runner.html`

===

[![Saber](https://f.cloud.github.com/assets/157338/1485433/aeb5c72a-4714-11e3-87ae-7ef8ae66e605.png)](http://ecomfe.github.io/saber/)
