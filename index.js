const express = require ("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta');



connection
.authenticate().then(()=>{
    console.log("Conetado ao BD")
}).catch((msgErro)=>{
    console.log(msgErro)
})


app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));



app.get("/", (req,res)=>{
    Pergunta.findAll({raw: true, order: [['id', 'DESC']]}).then(perguntas => {
        res.render("index", {perguntas: perguntas});
    })
    
})


app.get('/perguntar', (req,res)=>{
    res.render("perguntar");
})


app.get("/pergunta/:id", (req, res) => { //abrir uma pergunta específica ao ser clicada
    var id = req.params.id;

    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {

        Resposta.findAll({
            where: {perguntaId: pergunta.id},
            order: [['id', 'DESC']]
        }).then(resposta => {
            res.render('pergunta', {pergunta: pergunta,
                resposta: resposta
        })

        
        })
     
    })

})


app.post('/responder', (req,res)=>{
    var perguntaId = req.body.pergunta;
    var corpo = req.body.answer;

    Resposta.create({
        perguntaId: perguntaId,
        corpo: corpo
    }).then(()=>{
        res.redirect('/pergunta/'+perguntaId)
    })
})



app.post('/saveQuestion', (req,res)=>{
    var title = req.body.title;
    var description = req.body.description;

    Pergunta.create({
        title: title,
        description: description
    }).then(()=>{
        res.redirect('/')
    })

})



app.listen(3000,()=>{console.log("Server running!!")});
