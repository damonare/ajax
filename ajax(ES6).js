const ajax = {};
ajax.httpRequest = () => {
    //判断是否支持XMLHttpRequest对象
    // Chrome, Firefox, Opera 8.0+, Safari
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    }
    //兼容IE浏览器
    const versions = [
        "MSXML2.XmlHttp.6.0",
        "MSXML2.XmlHttp.5.0",
        "MSXML2.XmlHttp.4.0",
        "MSXML2.XmlHttp.3.0",
        "MSXML2.XmlHttp.2.0",
        "Microsoft.XmlHttp"
    ];
    //定义局部变量xhr,储存IE浏览器的ActiveXObject对象
    let xhr;
    for (let i = 0; i < versions.length; i++) {
        try {
            xhr = new ActiveXObject(versions[i]);
            break;
        } catch (e) {}
    }
    return xhr;
};

ajax.send = (url, callback, method, data, async) => {
    //默认异步
    if (async === undefined) {
        async = true;
    }
    let httpRequest = ajax.httpRequest();
    //初始化HTTP请求
    httpRequest.open(method, url, async);
    //onreadystatechange函数对象
    httpRequest.onreadystatechange = () => {
        //readyState 的值等于4，从服务器拿到了数据
        if (httpRequest.readyState == 4) {
            //回调服务器响应数据
            callback(httpRequest.responseText)
        }
    };
    if (method == 'POST') {
        //给指定的HTTP请求头赋值
        httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    //发送HTTP请求
    httpRequest.send(data);
};
//实现GET请求
ajax.get = (url, data, callback, async) => {
    const query = [];
    for (let key in data) {
        query.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
    }
    ajax.send(`${url}${query.length ? `?${query.join('&')}` : ''}`, callback, 'GET', null, async);
};
//实现POST请求
ajax.post = (url, data, callback, async) => {
    const query = [];
    for (let key in data) {
        query.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
    }
    ajax.send(url, callback, 'POST', query.join('&'), async);
};
