
function Util() {}

Util.convertArrayToList = function(array) {
    var list = [];
    var array = array.arrayByRemovingNull()
    for (var i = 0; i < array.count(); i++) {
    	var item = array[i];
    	if (item.length == 0) {
    		continue;
    	} else if (item.length > 0) {
            var newList = Util.convertArrayToList(item);
            list = list.concat(newList);
        } else {
        	list.push(item);
        }
    }
    return list;
}

Util.unique = function(list) {
  	return Array.from(new Set(list));
}
