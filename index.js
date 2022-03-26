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


app.get('/pergunta/:id', (req,res)=>{ //pergunta no exemplo
    var id = req.params.id;

    Pergunta.findOne({
        where: {id:id}
    }).then(pergunta =>{
        res.render('pergunta', {
        pergunta: pergunta.title,
        description: pergunta.description
    })
    })



    // Pergunta.findOne({
    //     where: {id: id}
    // }).then(pergunta => {
    //     if(pergunta != undefined){
    //         Resposta.findAll({
    //             where: {perguntaId: pergunta.id},
    //             order: [['id', 'DESC']]

    //         }).then(resposta => {
    //             res.render("/responder",{
    //                 pergunta: pergunta,
    //                 resposta: resposta
    //             })
    //         })
    //     }else{
    //         res.redirect("/")
    //     }

    // })
    
    
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
