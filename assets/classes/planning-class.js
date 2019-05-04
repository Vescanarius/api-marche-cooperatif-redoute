let db, config

module.exports = (_db, _config) => {
    db = _db
    config = _config
    return Planning
}

let Planning = class {


    static getTwoMonths(max) {
        return new Promise((next) => {

            if (max != undefined && max > 0) {
                db.query('SELECT * FROM members LIMIT 0, ?', [parseInt(max)])
                    .then((result) => next(result))
                    .catch((err) => next(err))
            } else if (max != undefined) {
                next(new Error(config.errors.wrongmaxValue))
            } else {
                db.query('SELECT * FROM members')
                    .then((result) => next(result))
                    .catch((err) => next(err))
            }
        })
    }



}