exports.success = function (result) {
    return {
        status: 'success',
        result: result
    }
}


exports.error = function (message) {
    return {
        status: 'error',
        message: message
    }
}

exports.sortArray = function (property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

exports.isErr = (err) => {
    return err instanceof Error;
}
exports.checkAndChange = (obj) => {
    if (this.isErr(obj)) {
        return this.error(obj.message)
    } else {
        return this.success(obj)
    }
}