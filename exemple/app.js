require('babel-register')

const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gt18841_marchecoop'

});


db.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  } else {

    console.log('connected as id ' + db.threadId);

    db.query('SELECT * FROM members', (err, result) => {
      if (err){
        console.log(err.message)
      }else {
        console.log(result[0].name);
      }

    });
    
    /*db.query('INSERT INTO members(name) VALUES("John") ', (err, result) => {
      if (err){
        console.log(err.message)
      }else {
        console.log(result);
      }
    });*/


  }

});
