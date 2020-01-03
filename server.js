// requerimentos básicos 
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var mysql = require('mysql');
var connection = require('./lib/db');
require('dotenv').config()
// gereador de uuid
// const uuidv4 = require('uuid/v4'); // não vamos mais usar, pois estamos pegando o id da inserção no banco de dados.
// inicializando express
const app = express();
// setando watson api e auth 
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
// iniciando obj textToSpeech 
const textToSpeech = new TextToSpeechV1({
    authenticator: new IamAuthenticator({
        apikey: 'process.env.apikey',
    }),
    url: 'process.env.url',
    disableSslVerification: true
});

// primeiro a gente configurou o watson, que estava sem as paradas dele...


// passei o bizu que não precisa do bodyParser (mas isso vc vê depois)
// inicializando bodyParser para tratamento de dados
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 


    extended: true
}));

// Aqui, você configura uma pasta que o express vai entender como arquivos públicos
// ou seja, quando vc acessar http://localhost:3000/(algum arquivo), ele vai pegar
// esse algum arquivo da pasta public :)
app.use(express.static(path.join(__dirname, 'public')));


// Aqui eu apaguei a parte do hostname, pois, por padrão, o express já 
// entende esse hostname => localhost ou 127.0.0.1 (são a mesma coisa.)
// const hostname = '127.0.0.1';
// app.listen(3000, hostname, function () {
//     console.log('servidor funcionando na porta 3000')
// })

// ai, fica mais enxuto o código.
app.listen(3000, function () {
    console.log('servidor funcionando na porta 3000')
})

// definindo views -> perfeito. Vc ajusta uma pasta que vai ser sua template engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs') // vc fala que sua template engine é o ejs

// rota index ou seja: http://localhost:3000/
app.get('/', (req, res) => {
    res.render('index.ejs')
})

// Comentei, pois a database já existia. Vc poderia, quem sabe, colocar isso em outro arquivo.
// Mas não precisa. Tá bom aqui rsrs :)
// criar database se nao existir
// app.get('/createtb', (req, res) => {
//     let sql = 'CREATE TABLE IF NOT EXISTS  comentarios';
//     connection.query(sql, (error, res) => {
//         if (error) throw error;
//         res.send('Database criado!');
//     });
// })


// seleciona os inputs salvos no mysql e envia pra rota
app.get("/comentarios", (req, res) => {
    // Pegamos o id e o texto da tabela de comentários, pra usar no front end
    // usamos o id no atributo data-id do nosso botão, pois o id será o nome do 
    // nosso arquivo de audio ( 1.mp3 por exemplo)
    connection.query("SELECT id, texto FROM comentarios;", (error, rows) => {
        if (error) throw error;

        res.send(rows); // envio a resposta (response) para o front
    });
});

// postando no mysql
// var id_comentario; não está em uso. eu ia criar uma forma de criar um nome unico pra cada comentario deopis descobri o uuid. Ah sim.. saquei

app.post('/', (req, res) => {

    // vou te dar uma dica nova.. template literals. um colega falou hoje sobre isso kkk rsrs
    // a template literals ou template string, é usada com duas crases `` e dentro delas
    // a gente pode colocar textos normais, e quando quisermos usar variáveis, usamos assim
    // ${variable} .. exemplo abaixo
    let sql = `INSERT into comentarios(texto) VALUES("${req.body.comentario}")`;
    
    // insere um comentário na tabela comentários
    connection.query(sql, function (error, resultado) {
        if (error) throw error;
        
        // synWatson(req.body.comentario, uuidv4()); // não precisa colocar a inicilização da variável ali. Só passa o valor, que a inicialização fica dentro da função.
        

        // enviamos o resultado.insertId, que é o id desse novo comentário.
        // Vamos usar ele daqui a pouco para criar o nome do nosso arquivos de audio
        // Enviamos, também, o comentário. Esse comentário irá ser lido pelo Watson.
        synWatson(req.body.comentario, resultado.insertId); 

    });
    res.render('index.ejs')
});

// funcao de sintetizador de voz do watson
function synWatson(texto, commentId) {
    textToSpeech.synthesize({
            text: texto,
            accept: 'audio/mp3',
            voice: 'pt-BR_IsabelaVoice'
        }) // esperamos a promesa do Watson
        .then(audio => { 

            // promesa cumprida, então ...
            
            // var nome = uuidv4(); // olha aqui a suposta variável i .. rsrs virou nome aqui dentro.pior rsrs
            
            // usamos o audio para de fato criar o arquivo na pasta public.
            audio.result.pipe(fs.createWriteStream(`./public/${commentId}.mp3`));
            
            console.log('audio feito!');
        })
        .catch(err => { // caso a promesa não seja cumprida.
            console.log('error', err)
        });

}

// essa aqui vc mesmo percebeu que não precisava ...
// função para criar os audios de cada comentario. eu fiz essa funcao pra varrer a array mas tava gerando audio toda vez que atualizava. tendi. to te devendo umas 3 breja pelo menos.
// var sql = function () {
//     connection.query("SELECT texto FROM comentarios;", (error, rows) => {
//         if (error) throw error;
        
//         if (rows.length > 0) {
//             for (i in rows) {
//                 synWatson(rows[i].texto, i);
//             }
//         }
        
//         return console.log('sucesso!');
//     });
// }
// CRIOU! SALVOU EU CHEQUEI - Otimo.. bom.. agora, abre o outro arquivo pra mim, pfv