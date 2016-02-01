const removeSelectedItems = function (dataSet, selectItems, key) {
    var result = [];
    for (var i = 0; i < dataSet.length; i++) {
        var remove = false;
        for (var j = 0; j < selectItems.length; j++) {
            if (dataSet[i][key] === selectItems[j][key]) {
                remove = true;
                break;
            }
        }

        if (!remove) {
            result.push(dataSet[i]);
        }
    }

    return result;
};

module.exports = removeSelectedItems;
