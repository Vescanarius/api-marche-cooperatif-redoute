let db, config
const { sortArray, nextMercredi } = require('../functions');


module.exports = (_db, _config) => {
    db = _db
    config = _config
    return Service
}

let Service = class {
    static add(member, date, source, status) {

        return new Promise((next) => {
            if (member && date && source && status) {
                db.query("SELECT equipe FROM members WHERE id=?", [member])
                    .then((result) => {
                        let equipe = result[0].equipe
                        console.log(equipe)
                        db.query(
                            "INSERT INTO `services` (`id`, `member`, `date`, `equipe`, `status`, `source`) VALUES ( ? , ? , ? , ?, ?, ?)",
                            [null, member, date, equipe, status, source]
                        )
                            .then((result) => next(result))
                            .catch((err) => next(err))
                    })
                    .catch((err) => next(err))
            } else {
                next(new Error(config.errors.wrongRequest))
            }

        })

    }
    static delete() {
        return new Promise((next) => {

        })


    }
    static removeAllPlanning(date) {
        return new Promise((next) => {
            db.query("DELETE FROM services WHERE `date`=? `source` LIKE 'planning' AND `status` LIKE 'pending'",[date])
                .then((results) => next(true))
                .catch((err) => next(err))
        })
    }
    static getAllServices(member) {

        if (member != null) {
            var sql = "SELECT * FROM services WHERE member=?"
            var args = member

        } else {
            var sql = "SELECT * FROM services "
            var args = null
        }
        return new Promise((next) => {
            db.query(sql, [args])
                .then((result) => next(result)
                )
                .catch((err) => next(err))
        })
    }

}