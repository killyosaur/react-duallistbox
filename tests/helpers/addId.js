const addId = function(items, idProp) {
    if (!idProp) {
        idProp = 'id';
    }

    for (let i = 0; i < items.length; i++) {
        items[i][idProp] = i + 1;
    }
};

module.exports = addId;