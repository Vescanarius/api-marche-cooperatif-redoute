require('babel-register');
const { checkAndChange } = require('./assets/functions');

const mysql = require('promise-mysql');
const bodyParser = require('body-parser');
const morgan = require('morgan')('dev');
const config = require('./assets/config_dev')
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./assets/swagger.json');



mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database

}).then(
    (db) => {

        const app = express();


        console.log('connected as id ' + db.threadId);

        db.query('SELECT * FROM members', (err, result) => {
            if (err) {
                console.log(err.message)
            } else {

                let MembersRouter = express.Router()
                let PlanningRouter = express.Router()
                let Members = require('./assets/classes/members-class')(db, config)
                let Planning = require('./assets/classes/planning-class')(db, config)

                app.use(bodyParser.json()); // for parsing application/json
                app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
                app.use(config.rootAPI + 'api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

                MembersRouter.route('/:id')

                    // Récupère un mebre avec son id 
                    .get(async (req, res) => {
                        let member = await Members.getByID(req.params.id)
                        res.json(checkAndChange(member))

                    })
                    // modife un mebre avec son id
                    .put(async (req, res) => {

                        let updateMember = await Members.update(req.params.id, req.body.name)
                        res.json(checkAndChange(updateMember))

                    })
                    // supprime un membre evec son id
                    .delete(async (req, res) => {

                        let deleteMember = await Members.delete(req.params.id)
                        res.json(checkAndChange(deleteMember))


                    })

                MembersRouter.route('/')

                    // récupère tous les membres
                    .get(async (req, res) => {

                        let allMembers = await Members.getAll(req.query.max)
                        res.json(checkAndChange(allMembers))


                    })
                    // Ajoute un membre avec son nom
                    .post(async (req, res) => {

                        let addMember = await Members.add(req.body.name)
                        res.json(checkAndChange(addMember))

                    })

                PlanningRouter.route('/')

                    // récupère le planning des deux prochains mois
                    .get(async (req, res) => {

                        let planning = await Planning.getTwoMonths()
                        res.json(checkAndChange(planning))

                    })



                app.use(config.rootAPI + 'members', MembersRouter)
                app.use(config.rootAPI + 'planning', PlanningRouter)

                app.listen(config.port, () => console.log('started on port ' + config.port));
            }
        });

    }
).catch((err) => {
    console.log("Error during database connection")
    console.log(err.message)
})

