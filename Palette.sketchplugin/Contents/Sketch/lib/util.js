
function Util() {}

Util.convertArrayToList = function(array) {
    var list = [];
    var array = array.arrayByRemovingNull()
    for (var i = 0; i < array.count(); i++) {
        if (array[i].length > 0) {
            list.push(array[i].firstObject());
        }
    }
    return list;
}
