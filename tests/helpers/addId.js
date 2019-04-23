const addId = function(items, idProp) {
    if (!idProp) {
        idProp = 'id';
    }

    var ids = [];

    for (var i = 0; i < items.length; i++) {
        items[i][idProp] = i + 1;
        ids.push(i + 1);
    }

    return ids;
};

export {addId};