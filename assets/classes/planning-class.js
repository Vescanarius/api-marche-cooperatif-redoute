let db, config

module.exports = (_db, _config) => {
    db = _db
    config = _config
    return Planning
}

let Planning = class {

    static getAllTeams() {
        let equipes = ['caisse', 'caisseO', 'acc', 'coord1', 'coord2', 'demont', 'mont', 'prod']

        return equipes
    }


    static getTwoMonths() {

        return new Promise((next) => {

            let equipes = this.getAllTeams()
            let queries = equipes.map((equipe) => {
                return new Promise((next) => {
                    db.query('SELECT * FROM members WHERE equipe=? ', [equipe])
                        .then((result) => {

                            let teamArray = result
                            let today = new Date

                            let queries = teamArray.map((consomacteur) => {
                                return new Promise((resolve, reject) => {
                                    db.query("SELECT COUNT(*) as services FROM services WHERE `member`=?", [consomacteur.id])
                                        .then((result) => {
                                            let nbServices = result[0].services
                                            console.log(result)
                                            let dateArrivee = new Date(consomacteur.dateAjout)
                                            let nbDeMarches = Math.round((today - dateArrivee) / (7 * 24 * 60 * 60 * 1000))
                                            // on crée la note pour chaque consomacteur
                                            let note = nbServices / nbDeMarches

                                            result = [consomacteur.name, consomacteur.prenom, consomacteur.tel, consomacteur.email, note]

                                            resolve(result)
                                        })
                                        .catch((err) => next(err))
                                })
                            })

                            Promise.all(queries)
                                .then(results => {
                                    //console.log(results)
                                    next(results)
                                })

                        })
                        .catch((err) => next(err))

                })

            })

            Promise.all(queries)
                .then(results => {
                    //console.log(results)
                    next(results)
                })

        })

    }






}