/**
 * @file 列表数据实体
 * @author treelite(c.xinle@gmail.com)
 *         junmer(junmer@foxmail.com)
 */

define(function (require) {

    var Emitter = require('saber-emitter/emitter');
    var extend = require('saber-lang/extend');
    var request = require('./request');

    /**
     * @constructor
     * @param {string} url
     * @param {Object} queryInfo 查询条件
     * @param {number} queryInfo.pageSize 默认每页记录数 默认10
     * @param {Object} options 配置参数
     * @param {number} options.method 请求方法 默认`GET`
     *
     */
    function DataList(url, queryInfo, options) {
        options = options || {};
        this.url = url || '';
        this.queryInfo = extend({}, queryInfo || {});
        this.data = [];
        this.total = 0;
        this.pageSize = this.queryInfo.pageSize || 10;
        this.method = options.method || 'GET';
        this.condition = {};

        Emitter.mixin(this);
    }

    /**
     * 获取当前数据
     *
     * @public
     * @return {Array.<Object>}
     */
    DataList.prototype.getData = function () {
        return this.data;
    };

    /**
     * 获取当前页数
     *
     * @public
     * @return {number} 获取当前数
     */
    DataList.prototype.getPage = function () {
        return this.page;
    };

    /**
     * 获取总页数
     *
     * @public
     * @return {number}
     */
    DataList.prototype.getMaxPage = function () {
        return Math.ceil(this.total / this.pageSize);
    };

    /**
     * 获取每页大小
     *
     * @public
     * @return {number}
     */
    DataList.prototype.getPageSize = function () {
        return this.pageSize;
    };

    /**
     * 获取总记录数
     * 
     * @public
     * @return {number}
     */
    DataList.prototype.getTotal = function () {
        return this.total;
    };

    /**
     * 获取搜索条件 
     *
     * @public
     * @return {Object}
     */
    DataList.prototype.getCondition = function () {
        return this.condition;
    };

    /**
     * 获取当前的查询条件
     *
     * @public
     * @return {Object}
     */
    DataList.prototype.getQuery = function () {
        return extend({}, this.queryInfo);
    };

    /**
     * 查询数据 
     *
     * @public
     * @param {Object} 查询条件
     */
    DataList.prototype.query = function (queryInfo) {

        var me = this;

        me.emit('query:before');

        var query = extend(this.queryInfo, queryInfo || {});

        var queryStr = [];
        Object.keys(query).forEach(function (key) {
            queryStr.push(key + '=' + encodeURIComponent(query[key]));
        });
        queryStr = queryStr.join('&');
        var url = this.url;
        var options = { method: this.method.toUpperCase() };
        if (options.method == 'POST') {
            options.data = queryStr;
        }
        else {
            url += (url.indexOf('?') >= 0 ? '&' : '?') + queryStr;
        }

        me.emit('query');

        return (this.requestHook || request).request(url, options).then(
            function (res) {
                me.data = res.data || [];
                me.page = parseInt( res.page, 10 ) || 1;
                me.pageSize = parseInt( res.pageSize, 10 ) || me.pageSize;
                me.total = parseInt( res.total, 10 ) || 0;
                me.condition = res.condition || {};
                // 时间校验码
                me.signTime = res.signTime || 0;

                me.emit('query:after');

                return me.data;
            }
        );
    };

    /**
     * 拉取数据
     *
     * @public
     * @param {number} page 页数
     * @param {number} pageSize 每页数量
     * @return {Promise}
     */
    DataList.prototype.fetch = function (page, pageSize) {
        return this.query({
            page: page || 1,
            pageSize: pageSize || this.pageSize
        });
    };

    return DataList;
});
