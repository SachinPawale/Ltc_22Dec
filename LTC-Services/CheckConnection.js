var mysql = require('mysql2');

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Itcportal@2021',
  database: 'ltcportal'
});

connection.connect(function (err) {
  if (err) {
    return console.error('error: ' + err.message);
  }

  console.log('Connected to the MySQL server.');
});

connection.query('select * from user_master', (err, result, fields) => {
  if (err) {
    return console.log('Error', err);
  }
  return console.log('result', result);

})