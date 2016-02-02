var removeDups = function (data, id) {
    var arr = {};

    for (var i = 0, len = data.length; i < len; i++) {
        arr[data[i][id]] = data[i];
    }

    data = new Array();
    for (var key in arr) {
        if (arr.hasOwnProperty(key)) {
            data.push(arr[key]);
        }
    }

    return data;
};
