//Seleção de elementos
const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const musicaFocoInput = document.querySelector('#alternar-musica');
const startPauseBt = document.querySelector('#start-pause');
const iniciarOuPausarBt = document.querySelector('#start-pause span');
const imagemBt = document.querySelector('.app__card-primary-butto-icon');
const tempoNaTela = document.querySelector('#timer');

//Lista de elementos
const botoes = document.querySelectorAll('.app__card-button');

//Objeto Audio
const musica = new Audio ('/sons/luna-rise-part-one.mp3'); // Instância objeto Audio
const somPlay = new Audio ('/sons/play.wav');
const somPause = new Audio ('/sons/pause.mp3');
const somFinalizadaContagem = new Audio ('/sons/beep.mp3');

musica.loop = true; //Chama a função para tocar audio em looping

//Variaveis de tempo/ interval
let tempoDeCorridoEmSegundos = 1500; 
let intervaloId = null;



musicaFocoInput.addEventListener('change', () => {
    if(musica.paused) {
        musica.play()  //Função de reprodução do audio
    } else {
        musica.pause() //Função do objeto que pausa o aúdio
    }
})

focoBt.addEventListener('click', () =>  {
    tempoDeCorridoEmSegundos = 1500;
    alterarContexto('foco');
    focoBt.classList.add('active'); // Adiciona a classe 'active' quando o botão é clicado
});

curtoBt.addEventListener('click' , () => {
    tempoDeCorridoEmSegundos = 300;
    alterarContexto('descanso-curto');
    curtoBt.classList.add('active');
});

longoBt.addEventListener('click', () => {
    tempoDeCorridoEmSegundos = 900;
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');
});

function alterarContexto (contexto) {
    mostrarTempo();
    
    botoes.forEach(function (contexto) {
        contexto.classList.remove('active');  //ForEach para os botões, remove a classe 'active' de todos os botões
    });

    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `/imagens/${contexto}.png`);

    switch (contexto) {
        case 'foco':
            titulo.innerHTML = 
            `
            Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>
            `
            break;
    
        case 'descanso-curto':
            titulo.innerHTML =
            `
            Que tal dar uma respirada?<br>
            <strong class="app__title-strong">Faça uma pausa curta!.</strong>
            `
            break;

        case 'descanso-longo':
            titulo.innerHTML = 
            `
            Hora de voltar á superfície.<br>
            <strong class="app__title-strong">Faça uma pausa longa.</strong>
            `
            break;
        default:
            break;
    }
}

const contagemRegressiva = () => {
    if(tempoDeCorridoEmSegundos <= 0) {

        somFinalizadaContagem.play()
        alert('Tempo finalizado');

        const focoAtivo = html.getAttribute('data-contexto') == 'foco';
        if (focoAtivo) {
            const evento = new CustomEvent('focoFinalizado');
            document.dispatchEvent(evento);
            
        }
        
        zerar();
        return
    }
    tempoDeCorridoEmSegundos -= 1;
    mostrarTempo();
} 

startPauseBt.addEventListener('click', iniciarOuPausar); 

function iniciarOuPausar() {
    
    if(intervaloId) {
        zerar()
        return
    } 

    imagemBt.setAttribute('src', '/imagens/pause.png');
    somPlay.play();
    intervaloId = setInterval(contagemRegressiva, 1000);
    iniciarOuPausarBt.textContent = 'Pausar';
}

function zerar() {
    imagemBt.setAttribute('src', '/imagens/play_arrow.png');
    iniciarOuPausarBt.textContent = 'Começar';
    somPause.play();
    clearInterval(intervaloId);
    intervaloId  = null;
}

function mostrarTempo() {
    const tempo = new Date(tempoDeCorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-br', {minute: '2-digit', second: '2-digit'});
    tempoNaTela.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();