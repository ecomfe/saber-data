/**
 * @file 异步请求 封装业务逻辑
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {
    var ajax = require('saber-ajax/ejson');

    var model = {};

    function successHandlder(data) {
        model.paramData = data.paramData; 
        return data;
    }

    function getRequestParam() {
        var data = model.paramData || {};
        var res = [];

        Object.keys(data).forEach(function (key) {
            res.push(key + '=' + encodeURIComponent(data[key]));
        });

        return res.join('&');
    }

    function request(url, options) {
        var params = getRequestParam();
        var method = options.method || 'GET';

        options.method = method;
        if (method == 'GET') {
            url += (url.indexOf('?') >= 0 ? '&' : '?') + params;
        }
        else {
            options.data = (options.data ? options.data + '&' : '')
                            + params;
        }

        return ajax.request(url, options).then(successHandlder);
    }

    var exports = {};

    exports.init = function (data) {
        model.paramData = data;
    };

    exports.get = function (url) {
        return request(url, { method: 'GET' });
    };

    exports.post = function (url, data) {
        return request(url, { method: 'POST', data: data });
    };

    exports.request = request;

    return exports;
});
