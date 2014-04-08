/**
 * @file data tester
 * @author junmer(junmer@foxmail.com)
 */

define(function (require) {

    var DataList = require('saber-data/list');

    var URL = {
        LIST: 'data/list.json',
        JSONP: 'data/jsonp',
    };

    describe('DataList', function () {

        describe('query各状态正确', function () {

            it('emit query:before', function (done) {

                var datalist = new DataList(URL.LIST);

                datalist.on('query:before', function () {
                    this.queryInfo.beforeQuery = 1;
                    expect(this.url).toEqual(URL.LIST);
                    done();
                });
                
                datalist.query({ query: 1 });

            });

            it('emit query', function (done) {

                var datalist = new DataList(URL.LIST);

                datalist.on('query', function () {

                    expect(this.url).toEqual(URL.LIST);
                    done();
                
                });

                datalist.query({ query: 1 });

            });

            it('emit query:after', function (done) {

                var datalist = new DataList(URL.LIST);

                datalist.on('query:after', function () {

                    this.data = this.data.map(function (item) {
                        var itemNew = {};
                        Object.keys(item).forEach(function (key) {
                            itemNew[key.replace(/^org_/, '')] = item;
                        });
                        return itemNew;
                    });

                    expect(this.url).toEqual(URL.LIST);
                    done();

                });

                datalist.query({ query: 1 });

            });

            it('query', function (done) {

                var datalist = new DataList(URL.LIST);

                datalist.query({ query: 1 }).then(function (data) {

                    expect(data.length).toEqual(4);
                    done();

                });

            });

        });

    });

    var jsonp = require('saber-data/jsonp');

    describe('JSONP', function () {
        describe('获取数据正确', function () {
            it('status', function (done) {

                jsonp.request(URL.JSONP).then(function (data) {
                    expect(data.status).toEqual(0);
                    done();
                });

            });
        });
    });

});
