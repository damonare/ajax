###  轻量级ajax

- 单独对ajax进行了封装，轻量，方便使用。
- 如果您使用jQuery只是为了使用`$ajax()`方法的话，这个正适合您。

### 例:

#### Get请求

```javascript
ajax.get(url, {
    name: 'damonare',
    sex: 'man'
}, function(res){
    console.log(res);
}, async);
// 或
ajax.get(url, {
    name: 'damonare',
    sex: 'man'
    success: function(res) {},
    error: function(err) {}
});
```

#### POST请求

```javascript
// json
ajax.post('/', {
    data: {
        "name": "damonare",
        "age": 12
    },
    dataType: 'json',
    contentType: 'application/json; charset=UTF-8',
    success: function(res) {
        console.log(res);
    },
    error: function(err) {
        console.error(err);
    }
});
// x-www-form-urlencoded
ajax.post('/', {
    data: {
        "name": "damonare",
        "age": 12
    },
    dataType: 'json',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    success: function(res) {
        console.log(res);
    },
    error: function(err) {
        console.error(err);
    }
});
// form-data
ajax.post('/', {
    data: formData,
    dataType: 'json',
    success: function(res) {
        console.log(res);
    },
    error: function(err) {
        console.error(err);
    }
});
```

#### XMLHttpRequest实例对象获取

```javascript
// 实例对象
ajax.post('/', {
    data: {},
    xhr: function(xhr) {
        console.log(xhr);
    }
});
```

#### 同步请求(慎用)

```javascript
// 实例对象
ajax.get('/', {
    data: {}
}, function() {
}, false);
```

