/**
 * @file jsonp
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var curry = require('saber-lang/curry');
    var Resolver = require('saber-promise');

    var resolvers = {};

    /**
     * 生成全局唯一ID
     *
     * @inner
     */
    function generateId() {
        var now = Date.now ? Date.now() : (new Date()).getTime();
        
        return 'JSONP_' + now.toString(16);
    }

    /**
     * JSONP回调处理
     *
     * @inner
     */
    function callback(id, data) {
        var name = '_CB_' + id + '_';

        var resolver = resolvers[id];
        if (resolver) {
            resolver.resolve(data);
        }

        try {
            var ele = document.getElementById(id);
            if (ele) {
                ele.parentNode.removeChild(ele);
            }
            delete window[name];
        }
        catch (e) {}
    }

    /**
     * 创建全局回调函数
     *
     * @inner
     */
    function createCallback(id) {
        var name = '_CB_' + id + '_';

        window[name] = curry(callback, id);

        return name;
    }

    /**
     * 添加Script脚本
     *
     * @inner
     */
    function addScript(id, url, options) {
        var script = document.createElement('script');
        
        script.charset = options.charset || 'utf-8';
        script.id = id;
        script.defer = 'defer';
        script.async = 'async';

        var queryStr = [];
        Object.keys(options.data).forEach(function (key) {
            queryStr.push(key + '=' + encodeURIComponent(options.data[key]));
        });

        url += '?' + queryStr.join('&');
        script.src = url;

        var ele = document.getElementsByTagName('head')[0];
        if (ele) {
            ele.appendChild(script);
        }
        else {
            ele = document.getElementsByTagName('script')[0];
            ele.parentNode.insertBefore(script, ele);
        }
    }

    var exports = {};

    /**
     * 回调函数名参数
     *
     * @public
     * @type {string}
     */
    exports.callbackName = 'callback';

    /**
     * JSONP请求
     *
     * @public
     * @param {string} url
     * @param {Object} options 参数
     * @param {string} options.charset 编码方式，默认UTF-8
     * @param {Object} options.data 请求数据 只支持一层级的Object
     * @return {Promise}
     */
    exports.request = function (url, options) {
        options = options || {};

        var id = generateId();
        var resolver = new Resolver();
        resolvers[id] = resolver;

        options.data = options.data || {};
        options.data[exports.callbackName] = createCallback(id);

        addScript(id, url, options);

        return resolver.promise();
    };

    return exports;
});
