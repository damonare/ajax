/**
 * @description 你可知道造轮子的兴奋？
 */
var ajax = {};
ajax.httpRequest = function () {
    // 判断是否支持XMLHttpRequest对象
    // Chrome, Firefox, Opera 8.0+, Safari
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    }
    //兼容IE浏览器
    var versions = [
        "MSXML2.XmlHttp.6.0",
        "MSXML2.XmlHttp.5.0",
        "MSXML2.XmlHttp.4.0",
        "MSXML2.XmlHttp.3.0",
        "MSXML2.XmlHttp.2.0",
        "Microsoft.XmlHttp"
    ];
    // 定义局部变量xhr,储存IE浏览器的ActiveXObject对象
    var xhr;
    for (var i = 0; i < versions.length; i++) {
        try {
            xhr = new ActiveXObject(versions[i]);
            break;
        } catch (e) { }
    }
    return xhr;
};

ajax.send = function (url, callback, method, request, async) {
    // 默认异步
    if (async === undefined) {
        async = true;
    }
    var httpRequest = ajax.httpRequest();
    var handleResult = function() {
        if (httpRequest.status == 200) {// 200 = OK
            var responseText = httpRequest.responseText;
            if (request.dataType && request.dataType === 'json') {
                responseText = JSON.parse(responseText);
            }
            callback && callback({
                data: responseText,
                status: httpRequest.status,
                statusText: httpRequest.statusText,
                upload: httpRequest.upload
            });
            request.success && request.success({
                data: responseText,
                status: httpRequest.status,
                statusText: httpRequest.statusText,
                upload: httpRequest.upload
            });
        } else {
            // 错误回调
            callback && callback({
                status: httpRequest.status,
                statusText: httpRequest.statusText
            });
            request.error && request.error({
                status: httpRequest.status,
                statusText: httpRequest.statusText
            });
        }
    }
    if (typeof callback !== 'function') {
        callback = function () {}
    }
    // 初始化HTTP请求
    httpRequest.open(method, url, async);
    // 获取xhr对象
    request.xhr && request.xhr(httpRequest);
    httpRequest.withCredentials = true;
    if (request.withCredentials !== undefined) {
        httpRequest.withCredentials = !!request.withCredentials;
    }
    httpRequest.ontimeout = function () {
        console.error("The request for " + url + " timed out.");
    };
    httpRequest.onerror = function (e) {
        console.error(xhr.statusText);
    };
    // onreadystatechange函数对象
    if (async) {
        httpRequest.onreadystatechange = function () {
            // readyState 的值等于4，从服务器拿到了数据
            if (httpRequest.readyState == 4) {
                // 回调服务器响应数据
                handleResult();
            }
        };
    } else {
        handleResult();
    }
    
    if (method == 'POST' && request.contentType) {
        // 给指定的HTTP请求头赋值
        httpRequest.setRequestHeader('Content-Type', request.contentType);
    }
    // 发送HTTP请求
    httpRequest.send(request.data);
};
// 实现GET请求
ajax.get = function (url, request, callback, async) {
    var query = [];
    for (var key in request.data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(request.data[key]));
    }
    ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', request, async)
};
// 实现POST请求
ajax.post = function (url, request, callback, async) {
    var query = [];
    // contentType为false的请求，不进行数据处理；
    if (request.contentType === false) {
        ajax.send(url, callback, 'POST', request, async)
        return;
    }
    if (request.contentType && request.contentType.match(/json/g)) {
        try {
            request.data = JSON.stringify(request.data);
        } catch(e) {
            throw new Error(err);
        }
    } else {
        for (var key in request.data) {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(request.data[key]));
        }
        request.contentType = request.contentType || 'application/x-www-form-urlencoded; charset=UTF-8';
        request.data = query.join('&');
    }
    ajax.send(url, callback, 'POST', request, async)
};
