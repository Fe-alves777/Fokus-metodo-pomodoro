
const btnAdicionarTarefa =  document.querySelector('.app__button--add-task');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textArea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const btnCancelarAdicaoTarefa = document.querySelector('.app__form-footer__button--cancel');
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');

const btnRemoverCompletas = document.querySelector('#btn-remover-concluidas');
const btnRemoveTodas = document.querySelector('#btn-remover-todas');

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

let tarefaAtual = null;
let liTarefaAtual = null;

function atualizarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function esconderELimparTextArea() {
    textArea.value = '';
    formAdicionarTarefa.classList.add('hidden');
}

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = `
    
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
        <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
    </svg>

    `

    const paragrafo = document.createElement('p');
    paragrafo.textContent = tarefa.descricao;
    paragrafo.classList.add('app__section-task-list-item-description');
    
    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');

    botao.onclick = () => {
        //debugger
        const novaDescricao = prompt('Digite a nova descrição da tarefa');
        if(novaDescricao) {
            paragrafo.textContent = novaDescricao;
            tarefa.descricao = novaDescricao;
            atualizarTarefas();
        }
        
    }
    
    const imagemBotao = document.createElement('img');
    imagemBotao.setAttribute('src', '/imagens/edit.png');
    botao.append(imagemBotao);

    li.append(svg);
    li.append(paragrafo);
    li.append(botao);

    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete');
        botao.setAttribute('disabled', 'disabled');
        
    } else {
        li.onclick = () => {
            
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(elemento => {
                    elemento.classList.remove('app__section-task-list-item-active')
                    
                 });
            if (tarefaAtual == tarefa) {
                paragrafoDescricaoTarefa.textContent = '';
                tarefaAtual = null;
                liTarefaAtual = null;
                return;
            }
            liTarefaAtual = li;
            tarefaAtual = tarefa;
    
            li.classList.add('app__section-task-list-item-active')
            paragrafoDescricaoTarefa.textContent = tarefa.descricao;
        }

    }


    
    return li
}

btnAdicionarTarefa.addEventListener('click', () =>{
    formAdicionarTarefa.classList.toggle('hidden')
})

btnCancelarAdicaoTarefa.onclick = () => {
    esconderELimparTextArea();
}


formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault();
    // const descricaoTarefa = textArea.value
    const tarefa = {
        descricao: textArea.value
    }
    tarefas.push(tarefa);
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
    atualizarTarefas();
    esconderELimparTextArea();
})

tarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
});

document.addEventListener('focoFinalizado', () => {

    if(tarefaAtual && liTarefaAtual) {
        liTarefaAtual.classList.remove('app__section-task-list-item-active');
        liTarefaAtual.classList.add('app__section-task-list-item-complete');
        liTarefaAtual.querySelector('button').setAttribute('disabled', 'disabled');
        tarefaAtual.completa = true;
        atualizarTarefas();
    }
})


const removerTarefas = (somenteCompletas) => {
    const seletor = somenteCompletas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item' 
    document.querySelectorAll(seletor).forEach (elemento => {
        elemento.remove();
    })
    paragrafoDescricaoTarefa.textContent = '';
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : [];
    atualizarTarefas();

}

btnRemoverCompletas.onclick = () => removerTarefas(true);
btnRemoveTodas.onclick = () => removerTarefas(false);