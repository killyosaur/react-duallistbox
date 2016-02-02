var addId = function(items, idProp) {
    if (!idProp) {
        idProp = 'id';
    }

    for (var i = 0; i < items.length; i++) {
        items[i][idProp] = i + 1;
    }
};