
// requerimento basicos para mysql
const mysql = require('mysql')

// criando driver para mysql
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sys'
});

// inicializando conexão
connection.connect(function(error){
    if(!!error) return console.log(error);
    
});

module.exports = connection;