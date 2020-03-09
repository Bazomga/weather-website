const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const herokuPort = process.env.PORT || 3000
//Se o process.env.port não existir, o valor fica 3000

//Define o caminho para configurações do express
const publicPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Configurando o handlebar/hbs, para que seja o motor de html e também o local dos hbs
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup diretorio estatico para o servidor
app.use(express.static(publicPath))

//req no callback é os parametros que ele vai pegar, enquanto res a resposta que ele envia
app.get('', (req, res) => { //get serve para declarar o que ele vai fazer quando chegar uma requisição
    //res.send('<h1>Hello express!</h1>') //o primeiro parametro '' é o endereço, vazio significa a home
    res.render('index', {
        title: 'Home',
        name: 'Jordhan',
        info: 'Digite o nome de uma cidade, opcionalmente pode ser especificado o estado ou país:'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        text: 'Não tem nada aqui, somente um Ovo de Páscoa.'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'Sobre',
        text: 'App criado para o curso de NodeJS.'
    })
})

app.get('/previsao', (req,ret) => {
    if (!req.query.address){
        return ret.send({
            error: 'Erro: Não foi informado nenhum endereço.'
        })
    }
    
    geocode.getGeocode(req.query.address, (err, res) => {
        if (!res)
            return ret.send({error:err, log: 'Linha 57'})
            
        const { longitude, latitude, local, geoLocal } = res

        forecast.getPrevisao(geoLocal, (err, res) => {
            if (!res)
                return ret.send({error:err, log: 'Linha 62', geoLocal})

            ret.send({
                address: req.query.adress,
                local,
                geoLocation: {
                    longitude,
                    latitude,
                },
                clima: {
                    celsius: res.celsius,
                    probchuva: res.probChuva,
                    resumo: res.resumo,
                    tempMax: res.tempMax,
                    tempMin: res.tempMin,
                    infoResumo: res.infoResumo,
                    infoChuva: res.infoChuva,
                    infoTemp: res.infoTemp
                }
            })
        })
    })
    

})

app.get('/products', (req, res) => {
    if (!req.query.search){
        return res.send({
            error:'No search term detected.'
        })    
    }
            
    console.log(req.query)
    res.send({
        products: req.query.search
    })


})

app.get('/testJSON', (req, res) => {
    res.send({
        name: 'Jordhan',
        age: 24
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 404,
        textoRodape: 'Página de ajuda não encontrada'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 404,
        textoRodape: 'Não encontrado :('
    })
})



// @@@@ USAR BLOCO ABAIXO QUANDO RODAR O SERVIDOR LOCALMENTE E COMENTAR O BLOCO ACIMA@@@@
/*const port = 3000
app.listen((port), () => {
    console.log('Server is up on port ' + port)
})*/
app.listen((herokuPort), () => {
    console.log('Server is up on port ' + herokuPort)
})