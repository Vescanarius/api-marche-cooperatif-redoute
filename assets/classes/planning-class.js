let db, config
const { sortArray } = require('../functions');



module.exports = (_db, _config) => {
    db = _db
    config = _config
    return Planning
}

let Planning = class {

    static getAllTeams() {
        return new Promise((next) => {
            db.query("SELECT * FROM teams")
                .then((equipes) => {
                    next(equipes)
                })
                .catch((err) => next(err))
        })
    }


    static getTwoMonths() {

        return new Promise((next) => {

            let equipes = this.getAllTeams()
                .then((equipes) => {
                    // console.log(equipes)

                    let queries = equipes.map((equipe) => {
                        //console.log(equipe)
                        return new Promise((next) => {
                            db.query('SELECT * FROM members WHERE equipe=? ', [equipe.id])
                                .then((result) => {

                                    let teamArray = result
                                    let today = new Date

                                    let queries = teamArray.map((consomacteur) => {
                                        return new Promise((resolve, reject) => {
                                            db.query("SELECT COUNT(*) as services FROM services WHERE `member`=?", [consomacteur.id])
                                                .then((result) => {
                                                    let nbServices = result[0].services
                                                    let dateArrivee = new Date(consomacteur.dateAjout)

                                                    if (dateArrivee == null || dateArrivee == 'Invalid Date') {
                                                        dateArrivee = new Date();
                                                        dateArrivee.setDate(today.getDate() - 30);
                                                    }

                                                    let nbDeMarches = Math.round((today - dateArrivee) / (7 * 24 * 60 * 60 * 1000))

                                                    // on crée la note pour chaque consomacteur
                                                    let note = parseInt(nbServices) / parseInt(nbDeMarches)

                                                    //console.log(note)

                                                    result = {
                                                        "nom": consomacteur.name,
                                                        "prenom": consomacteur.prenom,
                                                        "tel": consomacteur.tel,
                                                        "email": consomacteur.email,
                                                        "note": note
                                                    }

                                                    resolve(result)
                                                })
                                                .catch((err) => next(err))
                                        })
                                    })

                                    Promise.all(queries)
                                        .then(results => {

                                            // On trie les résultats en fonction de la note
                                            results.sort(sortArray("note"));

                                            // On prends que les deux notes les plus basses
                                            let max = equipe.nbPlanning

                                            results = results.slice(0,max)
                                            // Rangement dans un tableau
                                            results = {
                                                "equipe": equipe.nomComplet,
                                                "equipeAbrege": equipe.abrege,
                                                "membres": results
                                            }

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
                .catch((err) => next(err))
        })
    }
}