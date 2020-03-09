console.log('Client side javascript file is loaded!')
const puzzleURL = 'http://puzzle.mead.io/puzzle'

fetch(puzzleURL).then((response) => {
    response.json().then((data) => {
        console.log(data.puzzle)
    })
})





const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const message1 = document.querySelector('#message-1')
const message2 = document.querySelector('#message-2')
const messageLoad = document.querySelector('#message-load')
message1.textContent, message2.textContent, messageLoad.textContent  = ' '

weatherForm.addEventListener('submit', (e) => { //e é abraviação para event
    e.preventDefault() //se nao botar esse código, a pagina da reload no submit
    messageLoad.textContent += 'Procurando...'
    fetch("http://localhost:3000/previsao?address="+encodeURIComponent(search.value)).then((response) => {
    response.json().then((data) => {
            messageLoad.textContent = ' '
        if (data.error){
            message1.textContent = data.error
            message2.textContent = ''
        } else {
            message1.textContent = data.local
            message2.textContent = data.clima.infoResumo + ' ' + data.clima.infoChuva + String.fromCharCode(13) + data.clima.infoTemp
        }
    })
})
})

