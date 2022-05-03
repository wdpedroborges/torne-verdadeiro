// let gc = new gameslib.GameConnection();
// git rm -r --cached .


// params.getAll('name') # => ["n1", "n2"]
let params = new URLSearchParams(location.search);
// console.log(params.get('circuitos'));
let conjuntoExterno;
if (params.get('circuitos')) {
    conjuntoExterno = JSON.parse(descomprimeCircuito(params.get('circuitos')));
}

let circuitosFeitos;
const body = document.querySelector('body');
const jogo = document.querySelector('#jogo');
const circuito = document.querySelector('#circuito');
const input = document.querySelector('#input');
const output = document.querySelector('#output');
const btnProximo = document.querySelector('#btnProximo');
const estrelas = document.querySelector('#estrelas');
const comentarioEstrelas = document.querySelector('#comentarioEstrelas');
const btnJogar = document.querySelector('#btnJogar');
const modalInicial = document.querySelector('#modalInicial');
const mensagem = document.querySelector('#mensagem');
const bateria = document.querySelector('#bateria');
const tempo = document.querySelector('#tempo');
const fase = document.querySelector('#fase');
const desempenho = document.querySelector('#desempenho');
const pontuacao = document.querySelector('#pontuacao');
const infoMusica = document.querySelector('#infoMusica');
const play = document.querySelector('#play');
const modalAjuda = document.querySelector('#modalAjuda');
const opcaoAjuda = document.querySelector('#opcaoAjuda');
const opcaoMenu = document.querySelector('#opcaoMenu');
const btnEntendi = document.querySelector('#btnEntendi');
const iconeFecharModalInicial = document.querySelector('#iconeFecharModalInicial');
const btnVoltar = document.querySelector('#btnVoltar');
const checkboxDesativarEfeitosSonoros = document.querySelector('#checkboxDesativarEfeitosSonoros');
const checkboxDesativarMusica = document.querySelector('#checkboxDesativarMusica');
const checkboxDesativarAnimacaoBackground = document.querySelector('#checkboxDesativarAnimacaoBackground');
let desativarEfeitosSonoros = false;
let desativarMusica = false;
let desativarAnimacaoBackground = false;
let limiteFases = 3;

let elementosLinhasPagina = ['linha-central-vertical', 'linha-central-horizontal', 'linha-lateral-direita', 'linha-lateral-esquerda', 'linha-recentralizadora-direita', 'linha-recentralizadora-esquerda', 'primeiro-canto', 'segundo-canto', 'terceiro-canto', 'quarto-canto', 'cruz', 'cruz-quebrada-direita', 'cruz-quebrada-esquerda', 't'];
let elementosPortoesPagina = ['primeiro-and', 'segundo-and', 'primeiro-or', 'segundo-or', 'primeiro-nand', 'segundo-nand', 'primeiro-nor', 'segundo-nor', 'primeiro-xor', 'segundo-xor', 'primeiro-xnor', 'segundo-xnor'];
const elementosPagina = document.querySelector('#elementosPagina');

function uneArrays(lista1, lista2) {
    let uniao = [];

    for (let i = 0; i < lista1.length; i++) {
        uniao.push(lista1[i]);
    }

    for (let i = 0; i < lista2.length; i++) {
        uniao.push(lista2[i]);
    }

    return uniao; 
}

function complementaNomes(lista, complemento) {
    for (let i = 0; i < lista.length; i++) {
        lista[i] = `${lista[i]}${complemento}`;
    }

    return lista;
}

function duplicaNomesComplemento(lista, complemento) {
    let listaComplementada = [];

    for (let i = 0; i < lista.length; i++) {
        listaComplementada.push(`${lista[i]}`);
    }

    for (let i = 0; i < lista.length; i++) {
        listaComplementada.push(`${lista[i]}${complemento}`);
    }

    return listaComplementada;
}

elementosLinhasPagina = duplicaNomesComplemento(elementosLinhasPagina, '-on');
elementosLinhasPagina = complementaNomes(elementosLinhasPagina, '.png');
elementosPortoesPagina = complementaNomes(elementosPortoesPagina, '.png');

let lista_elementosPagina = uneArrays(elementosLinhasPagina, elementosPortoesPagina);

for (let i = 0; i < lista_elementosPagina.length; i++) {
    const img = document.createElement('img');
    img.setAttribute('src', `media/elementos/${lista_elementosPagina[i]}`);
    elementosPagina.append(img);
}

let circuitoAtual = 0;
let circuitosPassados = 0;
let tempoInicial = 31; // segundos
let tempoCorrente;
let qtdeInicialBateria = 0;
let qtdeBateria = 0;
let vitoria = false;
let derrota = false;
let estadoInicial, solucaoPerfeita;
let valorPontuacao = 0;
let valorPontuacaoParaDesempenho = 0;
let totalPerfeitos = 0;
let totalPerfeitosRelativo = 0;
let maximoPerfeitos = 0;
let nomeMusica = 'Cosmic Drift';
let nomeAutor = 'DivKid';
let elementosPorColuna = 10;
let quantidadeElementos = 150;
let dificuldade, modoJogo;
let intervaloTemporizador;
let fimJogo = false;
let primeiraCor = 'seagreen';
let segundaCor = 'tomato';

const musicaFundo = new Audio(`media/efeitos-sonoros/${nomeMusica} - ${nomeAutor}.mp3`);
infoMusica.textContent = `Você está ouvindo "${nomeMusica}" por ${nomeAutor}`;

let perfilJogador = JSON.parse(localStorage.getItem('perfilJogador'));

if (!perfilJogador) {
    perfilJogador = {
        nome: 'Sem Nome',
        genero: 'Masculino',
        nivel: 0,
        expAtual: 0,
        expProximoNivel: 25,
        saldo: 0,
        quantidadePocaoTempo: 0,
        quantidadePocaoBateria: 0,
        itensInventario: [{categoria: 'titulo', titulo: 'Pessoa comum', descricao: 'Título inicial', img: 'media/usuario.png', equipado: true}, {categoria: 'foto', titulo: 'Foto inicial', descricao: 'Foto inicial', img: 'media/usuario.png', equipado: true}],
        quintetosDia: [], 
        conquistas: [],
        recordeFases: [0, 'facil'],
        recordeEstrelas: [0, 'facil'],
        desativarAnimacaoBackground: false,
        desativarMusica: false,
        desativarEfeitosSonoros: false,
        tema: 1,
        dificuldade: 'facil'
    };    
}

if (perfilJogador.desativarBg) {
    desativarAnimacaoBackground = true;
}
if (perfilJogador.desativarMusica) {
    desativarMusica = true;
}
if (perfilJogador.desativarEfeitosSonoros) {
    desativarEfeitosSonoros = true;
}
if (perfilJogador.tema === 1) {
    document.querySelector('body').style.setProperty('background-image', "url(media/bg1.jpg)");
} else if (perfilJogador.tema === 2) {
    document.querySelector('body').style.setProperty('background-image', "url(media/bg2.jpg)");
} else {
    document.querySelector('body').style.setProperty('background-image', "url(media/bg3.jpg)");
}

dificuldade = perfilJogador.dificuldade;

function salvaPerfilJogador() {
    localStorage.setItem('perfilJogador', JSON.stringify(perfilJogador));
}

function lidaNivelJogador(xp) {
    perfilJogador.expAtual += xp;
    if (perfilJogador.expAtual >= perfilJogador.expProximoNivel) {
        let valorSobressalente = 0;
        if (perfilJogador.expAtual > perfilJogador.expProximoNivel) {
            valorSobressalente = perfilJogador.expAtual - perfilJogador.expProximoNivel;
        }
        perfilJogador.nivel++;
        perfilJogador.expProximoNivel = (perfilJogador.nivel + 1) * 25;
        perfilJogador.expAtual = 0 + valorSobressalente;
        const mensagemUpou = document.getElementById('mensagemUpou');
        mensagemUpou.style.setProperty('display', 'block');
        mensagemUpou.innerText = 'Parabéns, você passou de nível!';
        executaEfeitoSonoro('fogo-1');
        setTimeout(() => {
            mensagemUpou.style.setProperty('display', 'none');
        }, 1500);
    }
    salvaPerfilJogador();
    atualizaResumoConfiguracoes();
    atualizaExibicaoPerfilJogador();
}

const btnSalvarPerfil = document.getElementById('btnSalvarPerfil');
btnSalvarPerfil.addEventListener('click', () => {
    atualizaNomeGeneroJogador();
    salvaPerfilJogador();
    atualizaResumoConfiguracoes();
});

const btnExcluirPerfil = document.getElementById('btnExcluirPerfil');
const btnExcluirPerfilCerteza = document.getElementById('btnExcluirPerfilCerteza');
btnExcluirPerfil.addEventListener('click', () => {
    btnExcluirPerfil.style.setProperty('display', 'none');
    btnExcluirPerfilCerteza.style.setProperty('display', 'block');
})

btnExcluirPerfilCerteza.addEventListener('click', () => {
    window.localStorage.clear();
    exibeToast('Perfil excluído com sucesso. A página vai atualizar em 3 segundos.', 0);
    btnExcluirPerfil.style.setProperty('display', 'block');
    btnExcluirPerfilCerteza.style.setProperty('display', 'none');
    setTimeout(() => {
        document.location.reload(true);
    }, 3000);
})

function verificaSeJaTemConquista(conquista) {
    let jaTem = false;
    for (let i = 0; i < perfilJogador.itensInventario.length; i++) {
        if (perfilJogador.itensInventario[i].titulo === conquista) {
            jaTem = true;
        }
    }

    return jaTem;
}

function atualizaNomeGeneroJogador() {
    const inputNome = document.getElementById('inputNome');
    const selectGenero = document.getElementById('selectGenero');
    perfilJogador.nome = inputNome.value;
    if (selectGenero.value == 'm') {
         perfilJogador.genero = 'Masculino';
    } else {
         perfilJogador.genero = 'Feminino';
    }
    inputNome.value = '';
    atualizaExibicaoPerfilJogador();
    exibeToast('Perfil salvo com sucesso.', 0);

    // conquista o nomeado
    if (!verificaSeJaTemConquista('O Nomeado')) {
        perfilJogador.itensInventario.push({categoria: 'titulo', titulo: 'O Nomeado', descricao: 'Você ganhou esta conquista por mudar o seu nome.', img: 'media/conquistas/conquista1.png'});
        atualizaExibicaoPerfilJogador();
        exibeToast('Você obteve uma conquista!', 0);        
    }
}

function atualizaExibicaoPerfilJogador() {
    const nomeJogador = document.getElementById('nomeJogador');
    const generoJogador = document.getElementById('generoJogador');
    const fotoJogador = document.getElementById('fotoJogador');
    const tituloJogador = document.getElementById('tituloJogador');
    const nivelJogador = document.getElementById('nivelJogador');
    const totalConquistasJogador = document.getElementById('totalConquistasJogador');
    const recordeFasesJogador = document.getElementById('recordeFasesJogador');
    const recordeEstrelasJogador = document.getElementById('recordeEstrelasJogador');
    const expAtualJogador = document.getElementById('expAtualJogador');
    const expProximoNivelJogador = document.getElementById('expProximoNivelJogador');
    const barraExpAtual = document.getElementById('barraExpAtual');

    nomeJogador.innerText = perfilJogador.nome;
    generoJogador.innerText = perfilJogador.genero;
    nivelJogador.innerText = perfilJogador.nivel;
    expAtualJogador.innerText = perfilJogador.expAtual;
    expProximoNivelJogador.innerText = perfilJogador.expProximoNivel;
    barraExpAtual.style.setProperty('width', `${(perfilJogador.expAtual / perfilJogador.expProximoNivel) * 100}%`);
    recordeFasesJogador.innerText = `${perfilJogador.recordeFases[0]} (no ${perfilJogador.recordeFases[1]})`;
    recordeEstrelasJogador.innerText = `${perfilJogador.recordeEstrelas[0]} (no ${perfilJogador.recordeEstrelas[1]})`;

    // atualiza foto e título, bem como total de conquistas
    let totalConquistas = 0;
    for (let i = 0; i < perfilJogador.itensInventario.length; i++) {
        if (perfilJogador.itensInventario[i].categoria === 'titulo' && perfilJogador.itensInventario[i].equipado) {
            tituloJogador.innerText = perfilJogador.itensInventario[i].titulo;
        }
        if (perfilJogador.itensInventario[i].categoria === 'foto' && perfilJogador.itensInventario[i].equipado) {
            fotoJogador.setAttribute('src', perfilJogador.itensInventario[i].img);
        }
        if (perfilJogador.itensInventario[i].categoria === 'titulo') {
            totalConquistas++;
        }
    }

    totalConquistasJogador.innerText = totalConquistas - 1; // -1 porque todo jogador já começa com um título

    // saldo
    const saldoJogador = document.querySelectorAll('.saldoJogador');
    saldoJogador.forEach(saldo => {
        saldo.innerText = perfilJogador.saldo;
    });
    // poções
    atualizaSpanPocaoTempo(perfilJogador.quantidadePocaoTempo);
    atualizaSpanPocaoBateria(perfilJogador.quantidadePocaoBateria);

    // atualiza as conquistas
    for (let i = 0; i < perfilJogador.itensInventario.length; i++) {
        let nomeAdaptado;
        switch(perfilJogador.itensInventario[i].titulo) {
            case 'O Nomeado':
                nomeAdaptado = 'conquistaONomeado';
                break;
            case 'O Comprador':
                nomeAdaptado = 'conquistaOComprador';
                break;
            case 'Insatisfeito':
                nomeAdaptado = 'conquistaInsatisfeito';
                break;
            case 'Equipado':
                nomeAdaptado = 'conquistaEquipado';
                break;
            case 'Eu também sei fazer':
                nomeAdaptado = 'conquistaEuTambemSeiFazer';
                break;
            case 'Eu tenho amigos':
                nomeAdaptado = 'conquistaEuTenhoAmigos';
                break;
            case 'O caçador':
                nomeAdaptado = 'conquistaOCacador';
                break;
            case 'O impiedoso':
                nomeAdaptado = 'conquistaOImpiedoso';
                break;
            case 'Colecionador de cabeças':
                nomeAdaptado = 'conquistaColecionadorDeCabecas';
                break;
            case 'Ligeirinho':
                nomeAdaptado = 'conquistaLigeirinho';
                break;
            case 'Nada pode me parar':
                nomeAdaptado = 'conquistaNadaPodeMeParar';
                break;
            case 'Invencível':
                nomeAdaptado = 'conquistaInvencivel';
                break;
            case 'Lógico iniciante':
                nomeAdaptado = 'conquistaLogicoIniciante';
                break;
            case 'Lógico persistente':
                nomeAdaptado = 'conquistaLogicoPersistente';
                break;
            case 'Um verdadeiro lógico':
                nomeAdaptado = 'conquistaUmVerdadeiroLogico';
                break;
            case 'Lógico Mestre':
                nomeAdaptado = 'conquistaLogicoMestre';
                break;
            case 'Lógico Deus':
                nomeAdaptado = 'conquistaLogicoDeus';
                break;
            case 'O caçador divino':
                nomeAdaptado = 'conquistaOCacadorDivino';
                break;
        }


        if (nomeAdaptado) {
            document.querySelector(`#${nomeAdaptado}`).style.setProperty('background-color', primeiraCor);
            document.querySelector(`#${nomeAdaptado}`).style.setProperty('color', '#fff');
            document.querySelector(`#${nomeAdaptado}`).style.setProperty('border', '5px solid orange');
        }
    }

    // lida com a coloração dos montros
    for (let i = 0; i < perfilJogador.itensInventario.length; i++) {
        if (perfilJogador.itensInventario[i].categoria === 'monstro') {
            document.querySelector(`#${perfilJogador.itensInventario[i].titulo}`).classList.remove('bloqueado');
        }
    }

    // atualiza os itens do perfil e remove os itens já comprados da loja
    atualizaEditarPerfil();
    salvaPerfilJogador();
    atualizaResumoConfiguracoes();
}

function temporizador() {
    clearInterval(intervaloTemporizador);
	intervaloTemporizador = setInterval(() => {
		if (tempoCorrente > 0) {
			if (tempoCorrente >= 10) {
				tempo.innerText = `${--tempoCorrente}`;
			} else {
				tempo.innerText = `${--tempoCorrente}`;
			}
		} else {
            lidaDerrota('tempo');
		}
	}, 1000);
}

btnJogar.addEventListener('click', () => {
    executaEfeitoSonoro('1');
    limiteFases = parseInt(document.querySelector('#limiteFases').value);

    if (limiteFases == 0 || !limiteFases) {
        limiteFases = Number.POSITIVE_INFINITY;
    }
    circuitoAtual = 0; 
    circuitosPassados = 0;
    tempoInicial = 0;
    tempoCorrente = 0;
    qtdeInicialBateria = 0;
    qtdeBateria = 0;
    vitoria = false;
    derrota = false;
    valorPontuacao = 0;
    totalPerfeitos = 0;
    maximoPerfeitos = 0;
    mensagem.style.setProperty('display', 'none');
    fimJogo = false;
	modalInicial.style.setProperty('display', 'none');
    dificuldade = document.querySelector('input[name="radioDificuldade"]:checked').value;
    modoJogo = document.querySelector('input[name="radioModoJogo"]:checked').value;
    desempenho.innerText = '0.00%'
    limpaEstrelas();
    limpaCircuito();
    btnProximo.style.setProperty('display', 'none');
    document.querySelector('#pPontuacao').style.setProperty('display', 'block');
    document.querySelector('#pDesempenho').style.setProperty('display', 'block');
    document.querySelector('#pFase').style.setProperty('display', 'block');
    btnVoltar.style.setProperty('display', 'block');

    if (dificuldade === 'facil') {
        tempoInicial = 45;
    } else if (dificuldade === 'normal') {
        tempoInicial = 30;
    } else if (dificuldade === 'dificil') {
        tempoInicial = 20;
    } else {
        tempoInicial = 10;
    }

    perfilJogador.dificuldade = dificuldade;
    salvaPerfilJogador();
    atualizaResumoConfiguracoes();

 	if (modoJogo === 'treino') {
        document.querySelector('#pPontuacao').style.setProperty('display', 'none');
        document.querySelector('#pDesempenho').style.setProperty('display', 'none');

 		tempoInicial = 1000;
 	}

    if (modoJogo === 'infinito' || modoJogo === 'treino') {
        document.querySelector('#pFase').style.setProperty('display', 'none');
    }

    if (modoJogo === 'progressivo' || modoJogo === 'infinito') {
        if (conjuntoExterno) {
            circuitosFeitos = conjuntoExterno;
        } else {
            circuitosFeitos = todosCircuitos;
        }
    } else if (modoJogo === 'treino') {
    	circuitosFeitos = [
    	'{"lista_elementos":[{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"linha-central-vertical","posicao":135,"conexao":[145]},{"elemento":"linha-central-vertical","posicao":125,"conexao":[135]},{"elemento":"linha-central-vertical","posicao":115,"conexao":[125]},{"elemento":"not","posicao":105,"conexao":[115]},{"elemento":"linha-central-vertical","posicao":95,"conexao":[105]},{"elemento":"linha-central-vertical","posicao":85,"conexao":[95]},{"elemento":"linha-central-vertical","posicao":75,"conexao":[85]},{"elemento":"linha-central-vertical","posicao":65,"conexao":[75]},{"elemento":"linha-central-vertical","posicao":55,"conexao":[65]},{"elemento":"linha-central-vertical","posicao":45,"conexao":[55]},{"elemento":"linha-central-vertical","posicao":35,"conexao":[45]},{"elemento":"linha-central-vertical","posicao":25,"conexao":[35]},{"elemento":"linha-central-vertical","posicao":15,"conexao":[25]},{"elemento":"linha-central-vertical","posicao":5,"conexao":[15]}],"posicao_elementos_iniciais":[145],"solucoes_possiveis":[["0","0","0","0","0","0","0","0","0","0"]]}',
		'{"lista_elementos":[{"elemento":"linha-central-vertical","posicao":144,"conexao":[]},{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"and","posicao":134,"conexao":[144,145]},{"elemento":"linha-recentralizadora-direita","posicao":125,"conexao":[134]},{"elemento":"linha-central-vertical","posicao":115,"conexao":[125]},{"elemento":"linha-central-vertical","posicao":105,"conexao":[115]},{"elemento":"linha-central-vertical","posicao":95,"conexao":[105]},{"elemento":"linha-central-vertical","posicao":85,"conexao":[95]},{"elemento":"linha-central-vertical","posicao":75,"conexao":[85]},{"elemento":"linha-central-vertical","posicao":65,"conexao":[75]},{"elemento":"linha-central-vertical","posicao":55,"conexao":[65]},{"elemento":"linha-central-vertical","posicao":45,"conexao":[55]},{"elemento":"linha-central-vertical","posicao":35,"conexao":[45]},{"elemento":"linha-central-vertical","posicao":25,"conexao":[35]},{"elemento":"linha-central-vertical","posicao":15,"conexao":[25]},{"elemento":"linha-central-vertical","posicao":5,"conexao":[15]}],"posicao_elementos_iniciais":[144,145],"solucoes_possiveis":[["0","0","0","0","1","1","0","0","0","0"]]}',
		'{"lista_elementos":[{"elemento":"linha-central-vertical","posicao":144,"conexao":[]},{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"or","posicao":134,"conexao":[144,145]},{"elemento":"linha-recentralizadora-esquerda","posicao":124,"conexao":[134]},{"elemento":"linha-central-vertical","posicao":114,"conexao":[124]},{"elemento":"linha-central-vertical","posicao":104,"conexao":[114]},{"elemento":"linha-central-vertical","posicao":94,"conexao":[104]},{"elemento":"linha-central-vertical","posicao":84,"conexao":[94]},{"elemento":"linha-central-vertical","posicao":74,"conexao":[84]},{"elemento":"linha-central-vertical","posicao":64,"conexao":[74]},{"elemento":"linha-central-vertical","posicao":54,"conexao":[64]},{"elemento":"linha-central-vertical","posicao":44,"conexao":[54]},{"elemento":"linha-central-vertical","posicao":34,"conexao":[44]},{"elemento":"linha-central-vertical","posicao":24,"conexao":[34]},{"elemento":"linha-central-vertical","posicao":14,"conexao":[24]},{"elemento":"linha-central-vertical","posicao":4,"conexao":[14]}],"posicao_elementos_iniciais":[144,145],"solucoes_possiveis":[["0","0","0","0","0","1","0","0","0","0"],["0","0","0","0","1","0","0","0","0","0"],["0","0","0","0","1","1","0","0","0","0"]]}',
		'{"lista_elementos":[{"elemento":"linha-central-vertical","posicao":144,"conexao":[]},{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"nand","posicao":134,"conexao":[144,145]},{"elemento":"linha-recentralizadora-direita","posicao":125,"conexao":[134]},{"elemento":"linha-central-vertical","posicao":115,"conexao":[125]},{"elemento":"linha-central-vertical","posicao":105,"conexao":[115]},{"elemento":"linha-central-vertical","posicao":95,"conexao":[105]},{"elemento":"linha-central-vertical","posicao":85,"conexao":[95]},{"elemento":"linha-central-vertical","posicao":75,"conexao":[85]},{"elemento":"linha-central-vertical","posicao":65,"conexao":[75]},{"elemento":"linha-central-vertical","posicao":55,"conexao":[65]},{"elemento":"linha-central-vertical","posicao":45,"conexao":[55]},{"elemento":"linha-central-vertical","posicao":35,"conexao":[45]},{"elemento":"linha-central-vertical","posicao":25,"conexao":[35]},{"elemento":"linha-central-vertical","posicao":15,"conexao":[25]},{"elemento":"linha-central-vertical","posicao":5,"conexao":[15]}],"posicao_elementos_iniciais":[144,145],"solucoes_possiveis":[["0","0","0","0","1","0","0","0","0","0"],["0","0","0","0","0","1","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0"]]}',
		'{"lista_elementos":[{"elemento":"linha-central-vertical","posicao":144,"conexao":[]},{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"xor","posicao":134,"conexao":[144,145]},{"elemento":"linha-recentralizadora-direita","posicao":125,"conexao":[134]},{"elemento":"linha-central-vertical","posicao":115,"conexao":[125]},{"elemento":"linha-central-vertical","posicao":105,"conexao":[115]},{"elemento":"linha-central-vertical","posicao":95,"conexao":[105]},{"elemento":"linha-central-vertical","posicao":85,"conexao":[95]},{"elemento":"linha-central-vertical","posicao":75,"conexao":[85]},{"elemento":"linha-central-vertical","posicao":65,"conexao":[75]},{"elemento":"linha-central-vertical","posicao":55,"conexao":[65]},{"elemento":"linha-central-vertical","posicao":45,"conexao":[55]},{"elemento":"linha-central-vertical","posicao":35,"conexao":[45]},{"elemento":"linha-central-vertical","posicao":25,"conexao":[35]},{"elemento":"linha-central-vertical","posicao":15,"conexao":[25]},{"elemento":"linha-central-vertical","posicao":5,"conexao":[15]}],"posicao_elementos_iniciais":[144,145],"solucoes_possiveis":[["0","0","0","0","0","1","0","0","0","0"],["0","0","0","0","1","0","0","0","0","0"]]}',
		'{"lista_elementos":[{"elemento":"linha-central-vertical","posicao":144,"conexao":[]},{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"nor","posicao":134,"conexao":[144,145]},{"elemento":"linha-recentralizadora-direita","posicao":125,"conexao":[134]},{"elemento":"linha-central-vertical","posicao":115,"conexao":[125]},{"elemento":"linha-central-vertical","posicao":105,"conexao":[115]},{"elemento":"linha-central-vertical","posicao":95,"conexao":[105]},{"elemento":"linha-central-vertical","posicao":85,"conexao":[95]},{"elemento":"linha-central-vertical","posicao":75,"conexao":[85]},{"elemento":"linha-central-vertical","posicao":65,"conexao":[75]},{"elemento":"linha-central-vertical","posicao":55,"conexao":[65]},{"elemento":"linha-central-vertical","posicao":45,"conexao":[55]},{"elemento":"linha-central-vertical","posicao":35,"conexao":[45]},{"elemento":"linha-central-vertical","posicao":25,"conexao":[35]},{"elemento":"linha-central-vertical","posicao":15,"conexao":[25]},{"elemento":"linha-central-vertical","posicao":5,"conexao":[15]}],"posicao_elementos_iniciais":[144,145],"solucoes_possiveis":[["0","0","0","0","0","0","0","0","0","0"]]}',
		'{"lista_elementos":[{"elemento":"linha-central-vertical","posicao":144,"conexao":[]},{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"xnor","posicao":134,"conexao":[144,145]},{"elemento":"linha-recentralizadora-esquerda","posicao":124,"conexao":[134]},{"elemento":"linha-central-vertical","posicao":114,"conexao":[124]},{"elemento":"linha-central-vertical","posicao":104,"conexao":[114]},{"elemento":"linha-central-vertical","posicao":94,"conexao":[104]},{"elemento":"linha-central-vertical","posicao":84,"conexao":[94]},{"elemento":"linha-central-vertical","posicao":74,"conexao":[84]},{"elemento":"linha-central-vertical","posicao":64,"conexao":[74]},{"elemento":"linha-central-vertical","posicao":54,"conexao":[64]},{"elemento":"linha-central-vertical","posicao":44,"conexao":[54]},{"elemento":"linha-central-vertical","posicao":34,"conexao":[44]},{"elemento":"linha-central-vertical","posicao":24,"conexao":[34]},{"elemento":"linha-central-vertical","posicao":14,"conexao":[24]},{"elemento":"linha-central-vertical","posicao":4,"conexao":[14]}],"posicao_elementos_iniciais":[144,145],"solucoes_possiveis":[["0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","1","1","0","0","0","0"]]}'
	];
    }

    play.classList.remove('bi-play');
    play.classList.add('bi-pause');
   
    if (!desativarMusica) {
         musicaFundo.play(); musicaFundo.loop = true;
    }

	infoMusica.style.setProperty('display', 'block');
	setTimeout(() => {
		infoMusica.style.setProperty('display', 'none');
	}, 3000);

    // lida com as poções
    function lidaPocoes(e) {
        switch(e.keyCode) {
            case 49: // tecla 1
                if (perfilJogador.quantidadePocaoTempo > 0) {
                    tempoCorrente += 5;
                    perfilJogador.quantidadePocaoTempo--;
                    atualizaSpanPocaoTempo(perfilJogador.quantidadePocaoTempo);
                }
                break;
            case 50: // tecla 2
                if (perfilJogador.quantidadePocaoBateria > 0) {
                    atualizaBateria(1);
                    perfilJogador.quantidadePocaoBateria--;
                    atualizaSpanPocaoBateria(perfilJogador.quantidadePocaoBateria);
                }
                break;
        }
    }

    document.removeEventListener('keypress', lidaPocoes);
    document.addEventListener('keypress', lidaPocoes);

	if (conjuntoExterno) {
        leCircuito(conjuntoExterno[circuitoAtual]);
    } else {
        leCircuito(JSON.parse(circuitosFeitos[circuitoAtual]));
    }
	fase.innerText = circuitoAtual + 1;
	temporizador();
});

play.addEventListener('click', () => {
	if (play.classList.contains('bi-pause')) {
		play.classList.remove('bi-pause');
		play.classList.add('bi-play');
		musicaFundo.pause();
	} else {
		play.classList.remove('bi-play');
		play.classList.add('bi-pause');
        if (!desativarMusica) {
            musicaFundo.play();
        }
	}
});

let circuitoAnterior;
btnProximo.addEventListener('click', () => {
    tempo.innerText = tempoInicial;
    if (modoJogo === 'progressivo') {
        if (circuitoAtual < circuitosFeitos.length - 1 && circuitoAtual < limiteFases - 1) {
            if (derrota) {
                if (dificuldade === 'facil') {
                    circuitoAtual = circuitoAtual;
                } else if (dificuldade === 'normal') {
                    if (circuitoAtual > 0) {
                        circuitoAtual--;
                    } else {
                        circuitoAtual = 0;
                    }
                } else if (dificuldade === 'dificil') {
                     if (circuitoAtual > 3) {
                        circuitoAtual -= 3;
                    } else {
                        circuitoAtual = 0;
                    }                   
                } else if (dificuldade === 'impossivel') {
                     if (circuitoAtual > 5) {
                        circuitoAtual -= 5;
                    } else {
                        circuitoAtual = 0;
                    }    
                }
            } else {
                circuitoAtual++;
                if (circuitoAtual > perfilJogador.recordeFases[0]) {
                    perfilJogador.recordeFases[0] = circuitoAtual;
                    perfilJogador.recordeFases[1] = dificuldade;
                }

                // conquistas de nível
                if (dificuldade === 'facil') {
                    if (circuitoAtual === 10) {
                        if (!verificaSeJaTemConquista('Lógico iniciante')) {
                            perfilJogador.itensInventario.push({categoria: 'titulo', titulo: 'Lógico iniciante', descricao: 'Por atingir a fase 10 no nível fácil.', img: 'media/conquistas/conquista9.png'});
                            atualizaExibicaoPerfilJogador();
                            exibeToast('Você obteve uma conquista!', 0);        
                        }
                    }
                } else if (dificuldade === 'normal' || dificuldade === 'dificil' || dificuldade === 'impossivel') {
                    if (circuitoAtual === 25) {
                        if (!verificaSeJaTemConquista('Lógico persistente')) {
                            perfilJogador.itensInventario.push({categoria: 'titulo', titulo: 'Lógico persistente', descricao: 'Por atingir a fase 25 no nível normal ou mais.', img: 'media/conquistas/conquista10.png'});
                            atualizaExibicaoPerfilJogador();
                            exibeToast('Você obteve uma conquista!', 0);        
                        }
                    }
                    if (circuitoAtual === 50) {
                        if (!verificaSeJaTemConquista('Um verdadeiro lógico')) {
                            perfilJogador.itensInventario.push({categoria: 'titulo', titulo: 'Um verdadeiro lógico', descricao: 'Por atingir a fase 50 no nível normal ou mais.', img: 'media/conquistas/conquista11.png'});
                            atualizaExibicaoPerfilJogador();
                            exibeToast('Você obteve uma conquista!', 0);        
                        }
                    }
                    if (circuitoAtual === 100) {
                        if (!verificaSeJaTemConquista('Lógico Mestre')) {
                            perfilJogador.itensInventario.push({categoria: 'titulo', titulo: 'Lógico Mestre', descricao: 'Por atingir a fase 100 no nível normal ou mais.', img: 'media/conquistas/conquista12.png'});
                            atualizaExibicaoPerfilJogador();
                            exibeToast('Você obteve uma conquista!', 0);        
                        }
                    }
                    if (circuitoAtual === 1000) {
                        if (!verificaSeJaTemConquista('Lógico Deus')) {
                            perfilJogador.itensInventario.push({categoria: 'titulo', titulo: 'Lógico Deus', descricao: 'Por atingir a fase 1000 no nível normal ou mais.', img: 'media/conquistas/conquista13.png'});
                            atualizaExibicaoPerfilJogador();
                            exibeToast('Você obteve uma conquista!', 0);        
                        }
                    }

                    // captura de monstros
                    let monstroAtual = 1;
                    for (let i = 10; i <= 330; i += 10) {
                        if (circuitoAtual === i) {
                            if (!verificaSeJaTemConquista(`monstro${monstroAtual}`)) {
                                perfilJogador.itensInventario.push({categoria: 'monstro', titulo: `monstro${monstroAtual}`, descricao: '', img: ''});
                                exibeCapturaMonstro(`monstro${monstroAtual}`);
                                atualizaExibicaoPerfilJogador();        
                            }
                        }
                        monstroAtual++;
                    }
                }
            }
            fase.innerText = circuitoAtual + 1;
        } else {
            if (!fimJogo) {
                lidaTotalPerfeitos(false);
                let valorDesempenho = parseFloat((desempenho.innerText).split('%')[0]);
                let textoFinal;

                if (valorDesempenho <= 33.33) {
                    mensagem.style.setProperty('background-color', 'teal');
                    textoFinal = `Você chegou ao fim com certa dificuldade, mas não desanime. Seu desempenho foi de ${desempenho.innerText}, com o máximo obtido de ${maximoPerfeitos} perfeito(s) seguidos.`;
                    executaEfeitoSonoro('fracasso');
                } else if (valorDesempenho > 33.33 && valorDesempenho <= 66.66) {
                    mensagem.style.setProperty('background-color', 'teal');
                    textoFinal = `Olha, você não foi mal! Continue praticando! Seu desempenho foi de ${desempenho.innerText}, com o máximo obtido de ${maximoPerfeitos} perfeitos seguidos.`;
                    executaEfeitoSonoro('fogo-0');
                } else if (valorDesempenho > 66.66 && valorDesempenho < 99.99) {
                    mensagem.style.setProperty('background-color', 'teal');
                    textoFinal = `Impressionante! Seu desempenho foi de ${desempenho.innerText}, com o máximo obtido de ${maximoPerfeitos} perfeitos seguidos.`;
                    executaEfeitoSonoro('super-sucesso');
                } else {
                    mensagem.style.setProperty('background-color', 'darkgreen');
                    mensagem.style.setProperty('box-shadow', '0 0 100px green');
                    textoFinal = `Você é mesmo humano? Seu desempenho foi de ${desempenho.innerText}, com o máximo obtido de ${maximoPerfeitos} perfeitos seguidos.`;
                    executaEfeitoSonoro('fogo-2');
                }

                mensagem.innerText = textoFinal;
                mensagem.style.setProperty('display', 'block');
                fimJogo = true;
            }
        }
    } else {
        let circuitoSorteado;
        if (circuitosFeitos.length > 1) {
            do {
                circuitoSorteado = getRandomIntInclusive(0, circuitosFeitos.length - 1);
            } while(circuitoSorteado === circuitoAnterior);
        } else {
            circuitoSorteado = getRandomIntInclusive(0, circuitosFeitos.length - 1);
        }
        circuitoAtual = circuitoSorteado;
        circuitoAnterior = circuitoSorteado;
    }

    if (!fimJogo) {
        vitoria = false;
        derrota = false;
        mensagem.style.setProperty('display', 'none');
        btnProximo.style.setProperty('display', 'none');
        limpaEstrelas();
        if (conjuntoExterno) {
            leCircuito(conjuntoExterno[circuitoAtual]);
        } else {
            leCircuito(JSON.parse(circuitosFeitos[circuitoAtual]));
        }
        temporizador(); 
    }

});

function exibeBtnProximo() {
	btnProximo.style.setProperty('animation', 'pulso infinite 1s');
	btnProximo.style.setProperty('display', 'block');
}

function limpaEstrelas() {
    estrelas.style.setProperty('display', 'none');
	const listaEstrelas = document.querySelectorAll('.estrela');
	for (let i = 0; i < listaEstrelas.length; i++) {
		listaEstrelas[i].remove();
	}
}

function colocaEstrelas(qtde, vazias = false) {
	if (!vazias) {
		for (let i = 0; i < qtde; i++) {
			let icone = document.createElement('i');
			icone.classList.add('estrela', 'bi', 'bi-star-fill');
			estrelas.appendChild(icone);
		}
	} else {
		for (let i = 0; i < qtde; i++) {
			let icone = document.createElement('i');
			icone.classList.add('estrela', 'bi', 'bi-star');
			estrelas.appendChild(icone);
		}
	}
}

function exibeEstrelas() {
	let qtdeCliques = qtdeInicialBateria - qtdeBateria;
	let totalEstrelas = 0;

	let percentual = (tempoCorrente / tempoInicial) * 100;

	if (percentual >= 30) {
		totalEstrelas += 1;
	} if (percentual >= 40) {
		totalEstrelas += 1;
	} if (percentual >= 50) {
		totalEstrelas += 1;
	} if (percentual >= 75) {
		totalEstrelas += 1;
	} if (percentual >= 90) {
		totalEstrelas += 1;
	}

	if (dificuldade == 'normal' || dificuldade == 'facil') {
		if (qtdeCliques >= qtdeInicialBateria) {
			totalEstrelas--;
		}
	} else {
		if (qtdeCliques > qtdeInicialBateria) {
			totalEstrelas--;
		}
	}

	if (totalEstrelas === 5) {
		comentarioEstrelas.innerText = 'Perfeito!';
		colocaEstrelas(5);
	} else if (totalEstrelas === 4) {
		colocaEstrelas(4);
		colocaEstrelas(1, true);
		comentarioEstrelas.innerText = 'Bom!';
	} else if (totalEstrelas === 3) {
		colocaEstrelas(3);
		colocaEstrelas(2, true);
		comentarioEstrelas.innerText = 'Razoável';
	} else if (totalEstrelas === 2) {
		colocaEstrelas(2);
		colocaEstrelas(3, true);
		comentarioEstrelas.innerText = 'Ruim';
	} else if (totalEstrelas === 1) {
		colocaEstrelas(1);
		colocaEstrelas(4, true);
		comentarioEstrelas.innerText = 'Muito ruim!';
	} else {
        colocaEstrelas(5, true);
        comentarioEstrelas.innerText = 'Horrível.';
    }

	if (totalEstrelas < 5) {
		lidaTotalPerfeitos();
	}

	if (totalEstrelas >= 3) {
        executaEfeitoSonoro('completou');

	} else {
        executaEfeitoSonoro('gelo', 'mp3');
	}

    let bonusPontuacao = 0;
    if (dificuldade === 'normal') {
        bonusPontuacao = 2;
    } else if (dificuldade === 'dificil') {
        bonusPontuacao = 3;
    } else if (dificuldade === 'impossivel') {
        bonusPontuacao = 5;
    }

    valorPontuacao += totalEstrelas + bonusPontuacao;
    valorPontuacaoParaDesempenho += totalEstrelas;

    if (modoJogo !== 'treino') {
        perfilJogador.saldo += totalEstrelas;
        if (valorPontuacao > perfilJogador.recordeEstrelas[0]) {
            perfilJogador.recordeEstrelas[0] = valorPontuacao;
            perfilJogador.recordeEstrelas[1] = dificuldade;
        }
    }

    // gc.sendScore(valorPontuacao);
	pontuacao.innerText = valorPontuacao;
	estrelas.style.setProperty('display', 'block');

    return totalEstrelas + bonusPontuacao;
}

function lidaTotalPerfeitos(reseta = true) {
	if (totalPerfeitos > maximoPerfeitos) {
		maximoPerfeitos = totalPerfeitos;
	}

	if (reseta) {
		totalPerfeitos = 0;
	} else {
		totalPerfeitos++;
	}
}

function atualizaSpanPocaoTempo(valor) {
    const spanQuantidadePocaoTempo = document.querySelector('#quantidadePocaoTempo');
    spanQuantidadePocaoTempo.innerText = valor;
}

function atualizaSpanPocaoBateria(valor) {
    const spanQuantidadePocaoBateria = document.querySelector('#quantidadePocaoBateria');
    spanQuantidadePocaoBateria.innerText = valor;
}

function atualizaBateria(valor = 0) {
    if (!vitoria && !derrota) {
         if (valor === 0) {
            if (qtdeBateria >= 0) {
                bateria.innerText = --qtdeBateria;
            }
        } else {
            qtdeBateria += valor;
            bateria.innerText = qtdeBateria;
        }       
    }
}

function defineBateria(estadoInicial, solucaoPerfeita) {
	// ao notar cada diferença entre o estadoInicial e a solucaoPerfeita é que se encontra a quantidade de cliques necessária para finalizar o circuito em questão
	let total = 0;
	for (let i = 0; i < estadoInicial.length; i++) {
		if (estadoInicial[i] !== solucaoPerfeita[i]) {
			total++;
		}
	}

    let bonus;
    if (dificuldade === 'facil') {
        bonus = 2;
    } else if (dificuldade === 'normal') {
        bonus = 1;
    } else if (dificuldade === 'dificil' || dificuldade === 'impossivel') {
        bonus = 0;
    }

    if (modoJogo === 'treino') {
    	bonus += 100;
    }

	return total + bonus;
}

// cria os espaços do circuito
function criaEspacosCircuito() {
	for (let i = 0; i < quantidadeElementos; i++) {
		const espacoElemento = document.createElement('div');
		espacoElemento.setAttribute('title', `${i}`);
		espacoElemento.classList.add('espacoElemento');
		circuito.appendChild(espacoElemento);
	}
}
// coloca os inputs
function criaInputsCircuito() {
	for (let i = 0; i < elementosPorColuna; i++) {
		const div = document.createElement('div');
		div.classList.add('input');
		div.innerText = 0;
		input.appendChild(div); // input é a div com flexbox
	}
}

function defineInputsCircuito(estadoInicial = '[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]') {
	// também serve para resetá-los
	estadoInicial = JSON.parse(estadoInicial);
	const inputs = [... document.querySelectorAll('.input')];
	inputs.forEach((input, index) => {
		if (estadoInicial[index] === '0') {
			input.style.setProperty('color', segundaCor);
		} else {
			input.style.setProperty('color', primeiraCor);
			if (espacosElementos[index + 140].classList.contains('elementoPresente')) {
				espacosElementos[index + 140].classList.add('on');
				espacosElementos[index + 140].style.backgroundImage = 'url("media/elementos/linha-central-vertical-on.png")';
			}
		}
		input.innerText = estadoInicial[index];
	});
}

criaEspacosCircuito();
criaInputsCircuito();

const espacosElementos = [... document.querySelectorAll('.espacoElemento')];

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function estadosIguais(estadoInicial, solucaoPerfeita) {
    let iguais = true;
    for (let i = 0; i < estadoInicial.length; i++) {
        if (estadoInicial[i] !== solucaoPerfeita[i]) {
            iguais = false;
            break;
        }
    }
    return iguais;
}

function pegaMenorValor(lista) {
	let menor = Number.POSITIVE_INFINITY;

	for (let i = 0; i < lista.length; i++) {
		if (lista[i] < menor) {
			menor = lista[i];
		}
	}

	return menor;
}

function criaEstadoInicial(solucoes_possiveis, posicao_elementos_iniciais) {
    let estadoInicial = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];

    let fim = false;
    while (!fim) {
        for (let i = 0; i < posicao_elementos_iniciais.length; i++) {
            estadoInicial[posicao_elementos_iniciais[i] - 140] = getRandomIntInclusive(0, 1).toString();
        }

        let igual = false;
        for (let i = 0; i < solucoes_possiveis.length; i++) {
            if (estadosIguais(estadoInicial, solucoes_possiveis[i])) {
                igual = true;
            }
        }

        if (!igual) {
            fim = true;
        }
    }


    let quantidadesBaterias = [];
    for (let i = 0; i < solucoes_possiveis.length; i++) {
    	quantidadesBaterias.push(defineBateria(estadoInicial, solucoes_possiveis[i]));
    }

    let quantidadeBateria = pegaMenorValor(quantidadesBaterias);

    return [estadoInicial, quantidadeBateria];
}

function limpaCircuito() {
	for (let i = 0; i < espacosElementos.length; i++) {
		espacosElementos[i].style.backgroundImage = "none";
		espacosElementos[i].classList.remove('elementoPresente');
		espacosElementos[i].classList.remove('on');
	}
}

// apenas lê o array com os objetos do circuito e insere os backgrounds nas devidas posições
function leCircuito(circuitoJSON) {
	circuitosPassados++;
	limpaCircuito();
	tempoCorrente = tempoInicial;
	let resultadoCriacaoEstadoInicial = criaEstadoInicial(circuitoJSON.solucoes_possiveis, circuitoJSON.posicao_elementos_iniciais);
    let estadoInicial = resultadoCriacaoEstadoInicial[0];
    qtdeBateria = resultadoCriacaoEstadoInicial[1]
    defineInputsCircuito(JSON.stringify(estadoInicial));
	qtdeInicialBateria = qtdeBateria;
	bateria.innerText = qtdeBateria;
	circuitoJSON = circuitoJSON.lista_elementos;

	for (let i = 0; i < circuitoJSON.length; i++) {
		let simples = false;
		if (circuitoJSON[i].elemento === 'and') {
			espacosElementos[circuitoJSON[i].posicao].style.backgroundImage = "url('media/elementos/primeiro-and.png')";
			espacosElementos[circuitoJSON[i].posicao + 1].style.backgroundImage = "url('media/elementos/segundo-and.png')";
		} else if (circuitoJSON[i].elemento === 'or') {
			espacosElementos[circuitoJSON[i].posicao].style.backgroundImage = "url('media/elementos/primeiro-or.png')";
			espacosElementos[circuitoJSON[i].posicao + 1].style.backgroundImage = "url('media/elementos/segundo-or.png')";
		} else if (circuitoJSON[i].elemento === 'nand') {
            espacosElementos[circuitoJSON[i].posicao].style.backgroundImage = "url('media/elementos/primeiro-nand.png')";
            espacosElementos[circuitoJSON[i].posicao + 1].style.backgroundImage = "url('media/elementos/segundo-nand.png')";
        } else if (circuitoJSON[i].elemento === 'nor') {
            espacosElementos[circuitoJSON[i].posicao].style.backgroundImage = "url('media/elementos/primeiro-nor.png')";
            espacosElementos[circuitoJSON[i].posicao + 1].style.backgroundImage = "url('media/elementos/segundo-nor.png')";
        } else if (circuitoJSON[i].elemento === 'xor') {
            espacosElementos[circuitoJSON[i].posicao].style.backgroundImage = "url('media/elementos/primeiro-xor.png')";
            espacosElementos[circuitoJSON[i].posicao + 1].style.backgroundImage = "url('media/elementos/segundo-xor.png')";
        } else if (circuitoJSON[i].elemento === 'xnor') {
            espacosElementos[circuitoJSON[i].posicao].style.backgroundImage = "url('media/elementos/primeiro-xnor.png')";
            espacosElementos[circuitoJSON[i].posicao + 1].style.backgroundImage = "url('media/elementos/segundo-xnor.png')";
        } else {
			espacosElementos[circuitoJSON[i].posicao].style.backgroundImage = `url('media/elementos/${circuitoJSON[i].elemento}.png')`;
			simples = true;
		}

		if (simples) {
			espacosElementos[circuitoJSON[i].posicao].classList.add('elementoPresente');
		} else {
			espacosElementos[circuitoJSON[i].posicao].classList.add('elementoPresente');
			espacosElementos[circuitoJSON[i].posicao + 1].classList.add('elementoPresente');
		}
	}
	propaga(circuitoJSON);
	alteraOutput();
}

function propaga(circuitoJSON) {
	const inputs = document.querySelectorAll('.input');
	for (let i = 0; i < inputs.length; i++) {
		if (inputs[i].innerText === '1' && espacosElementos[i + 140].classList.contains('elementoPresente')) {
			espacosElementos[i + 140].classList.add('on');
			if (dificuldade !== 'impossivel') {
                espacosElementos[i + 140].style.backgroundImage = 'url("media/elementos/linha-central-vertical-on.png")';
            }
		} else if (espacosElementos[i + 140].classList.contains('elementoPresente')) {
			espacosElementos[i + 140].classList.remove('on');
			espacosElementos[i + 140].style.backgroundImage = 'url("media/elementos/linha-central-vertical.png")';
		}		
	}

	for (let i = 0; i < circuitoJSON.length; i++) {
		let nomeElemento = circuitoJSON[i].elemento.split('-');
		// linhas normais
		if (nomeElemento.includes('linha') || nomeElemento.includes('canto') || nomeElemento.includes('cruz') || nomeElemento.includes('t')) {
			// se tem conexão 0, é porque é um dos primeiros elementos
			if (circuitoJSON[i].conexao.length !== 0) {
                if (espacosElementos[circuitoJSON[i].conexao[0]].classList.contains('on')) {
                    espacosElementos[circuitoJSON[i].posicao].classList.add('on');
                    if (dificuldade !== 'impossivel') {
                        espacosElementos[circuitoJSON[i].posicao].style.backgroundImage = `url(media/elementos/${circuitoJSON[i].elemento}-on.png)`;
                    }
                } else {
                    espacosElementos[circuitoJSON[i].posicao].classList.remove('on');
                    espacosElementos[circuitoJSON[i].posicao].style.backgroundImage = `url(media/elementos/${circuitoJSON[i].elemento}.png)`;
                }
			}
		}
		// not: inverte
		if (circuitoJSON[i].elemento === 'not') {
			if (espacosElementos[circuitoJSON[i].conexao[0]].classList.contains('on')) {
				espacosElementos[circuitoJSON[i].posicao].classList.remove('on');
			} else {
				espacosElementos[circuitoJSON[i].posicao].classList.add('on');
			}
		}
		// and: ambas devem ser verdadeiras
		if (circuitoJSON[i].elemento === 'and') {
			if (espacosElementos[circuitoJSON[i].conexao[0]].classList.contains('on') && espacosElementos[circuitoJSON[i].conexao[1]].classList.contains('on')) {
				espacosElementos[circuitoJSON[i].posicao].classList.add('on');
			} else {
				espacosElementos[circuitoJSON[i].posicao].classList.remove('on');
			}
		}
		// or: pelo menos uma deve ser verdadeira
		if (circuitoJSON[i].elemento === 'or') {
			if (espacosElementos[circuitoJSON[i].conexao[0]].classList.contains('on') || espacosElementos[circuitoJSON[i].conexao[1]].classList.contains('on')) {
				espacosElementos[circuitoJSON[i].posicao].classList.add('on');
			} else {
				espacosElementos[circuitoJSON[i].posicao].classList.remove('on');
			}
		}
        // nand: falsa se ambas verdadeiras
        if (circuitoJSON[i].elemento === 'nand') {
            if (espacosElementos[circuitoJSON[i].conexao[0]].classList.contains('on') && espacosElementos[circuitoJSON[i].conexao[1]].classList.contains('on')) {
                espacosElementos[circuitoJSON[i].posicao].classList.remove('on');
            } else {
                espacosElementos[circuitoJSON[i].posicao].classList.add('on');
            }
        }
        // nor: nenhuma deve ser verdadeira
        if (circuitoJSON[i].elemento === 'nor') {
            if (!espacosElementos[circuitoJSON[i].conexao[0]].classList.contains('on') && !espacosElementos[circuitoJSON[i].conexao[1]].classList.contains('on')) {
                espacosElementos[circuitoJSON[i].posicao].classList.add('on');
            } else {
                espacosElementos[circuitoJSON[i].posicao].classList.remove('on');
            }
        }
        // xor: só uma pode ser verdadeira
        if (circuitoJSON[i].elemento === 'xor') {
            if ((espacosElementos[circuitoJSON[i].conexao[0]].classList.contains('on') && !espacosElementos[circuitoJSON[i].conexao[1]].classList.contains('on')) || (!espacosElementos[circuitoJSON[i].conexao[0]].classList.contains('on') && espacosElementos[circuitoJSON[i].conexao[1]].classList.contains('on'))) {
                espacosElementos[circuitoJSON[i].posicao].classList.add('on');
            } else {
                espacosElementos[circuitoJSON[i].posicao].classList.remove('on');
            }
        }
        // xnor: ou ambas falsas ou ambas verdadeiras
        if (circuitoJSON[i].elemento === 'xnor') {
            if ((!espacosElementos[circuitoJSON[i].conexao[0]].classList.contains('on') && !espacosElementos[circuitoJSON[i].conexao[1]].classList.contains('on')) || (espacosElementos[circuitoJSON[i].conexao[0]].classList.contains('on') && espacosElementos[circuitoJSON[i].conexao[1]].classList.contains('on'))) {
                espacosElementos[circuitoJSON[i].posicao].classList.add('on');
            } else {
                espacosElementos[circuitoJSON[i].posicao].classList.remove('on');
            }
        }
        // fim
	}
}

function calculaDesempenho() {
	desempenho.innerText = `${ (( valorPontuacaoParaDesempenho / (circuitosPassados * 5)) * 100).toFixed(2) }%`;
}

function lidaVitoria() {
    jogo.style.setProperty('box-shadow', '2px 2px 100px seagreen');
    btnProximo.style.setProperty('background-color', primeiraCor);
    vitoria = true;
    clearInterval(intervaloTemporizador);
    exibeBtnProximo();
    if (modoJogo !== 'treino') {
        let xp = exibeEstrelas();
        lidaNivelJogador(xp);
        calculaDesempenho();
        lidaTotalPerfeitos(false);

        let elogios = ['Uau!', 'Incrível!', 'Fabuloso!', 'Impressionante.', 'Estou sem palavras.', 'Você é mesmo humano?'];
        if (totalPerfeitos % 5 === 0) {
            let elogio = elogios[getRandomIntInclusive(0, elogios.length - 1)];
            exibeToast(`${elogio} ${totalPerfeitos} perfeitos seguidos!`, totalPerfeitos);
            // conquistas de streak
            if (dificuldade === 'facil') {
                if (!verificaSeJaTemConquista('Ligeirinho')) {
                    perfilJogador.itensInventario.push({categoria: 'titulo', titulo: 'Ligeirinho', descricao: 'Por conseguir uma streak no nível fácil.', img: 'media/conquistas/conquista5.png'});
                    atualizaExibicaoPerfilJogador();
                    exibeToast('Você obteve uma conquista!', 0);        
                }
            } else if (dificuldade === 'normal') {
                if (!verificaSeJaTemConquista('Pegando fogo!')) {
                    perfilJogador.itensInventario.push({categoria: 'titulo', titulo: 'Pegando fogo!', descricao: 'Por conseguir uma streak no nível normal.', img: 'media/conquistas/conquista6.png'});
                    atualizaExibicaoPerfilJogador();
                    exibeToast('Você obteve uma conquista!', 0);        
                }
            } else if (dificuldade === 'dificil') {
                if (!verificaSeJaTemConquista('Nada pode me parar')) {
                    perfilJogador.itensInventario.push({categoria: 'titulo', titulo: 'Nada pode me parar', descricao: 'Por conseguir uma streak no nível difícil.', img: 'media/conquistas/conquista7.png'});
                    atualizaExibicaoPerfilJogador();
                    exibeToast('Você obteve uma conquista!', 0);        
                }
            } else if (dificuldade === 'impossivel') {
                if (!verificaSeJaTemConquista('Invencível')) {
                    perfilJogador.itensInventario.push({categoria: 'titulo', titulo: 'Invencível', descricao: '', img: 'media/conquistas/conquista8.png'});
                    atualizaExibicaoPerfilJogador();
                    exibeToast('Você obteve uma conquista!', 0);        
                }
            }
        }

       
    }
}

function lidaDerrota(tipo) {
    if (tipo === 'bateria') {
        mensagem.innerText = 'A sua bateria acabou :(';
        executaEfeitoSonoro('bateria', 'mp3');
    } else if (tipo === 'tempo') {
        mensagem.innerText = 'O seu tempo acabou :(';
        executaEfeitoSonoro('fracasso');
    }

    mensagem.style.setProperty('background-color', 'brown');
    mensagem.style.setProperty('box-shadow', 'none');
    mensagem.style.setProperty('display', 'block');
    clearInterval(intervaloTemporizador);
    derrota = true;
    lidaTotalPerfeitos();
    calculaDesempenho();
    exibeBtnProximo();
}

function alteraOutput() {
	let verdadeiro = true;
	for (let i = 0; i < 10; i++) {
		if (espacosElementos[i].classList.contains('elementoPresente') || espacosElementos[i].classList.contains('elemento-presente')) {
			if (!espacosElementos[i].classList.contains('on')) {
				verdadeiro = false;
			}
		}
	}

	if (verdadeiro) {
		output.innerText = 'Verdadeiro';
		output.style.backgroundColor = primeiraCor;
        lidaVitoria();
	} else {
		output.innerText = 'Falso';
		output.style.backgroundColor = segundaCor;
		jogo.style.setProperty('box-shadow', '2px 2px 100px tomato');
		btnProximo.style.setProperty('background-color', segundaCor);
	}
}

// event listeners nos inputs, bem como ativação do elemento imediatamente superior a cada um
const inputs = document.querySelectorAll('.input');
for (let i = 0; i < inputs.length; i++) {
	inputs[i].addEventListener('click', () => {
		if ((qtdeBateria > 0 && !vitoria && !derrota) || modoJogo === 'treino') {
			if (inputs[i].innerText === '0') {
                executaEfeitoSonoro('1');
				inputs[i].innerText = '1';
				inputs[i].style.setProperty('color', primeiraCor);
			} else if (inputs[i].innerText === '1') {
                executaEfeitoSonoro('0');
				inputs[i].style.setProperty('color', segundaCor);
				inputs[i].innerText = '0';
			}
			atualizaBateria();
			if (conjuntoExterno) {
                propaga(conjuntoExterno[circuitoAtual].lista_elementos);
            } else {
                propaga(JSON.parse(circuitosFeitos[circuitoAtual]).lista_elementos);
            }
			alteraOutput();
		} else if (qtdeBateria === 0 && !derrota && !vitoria && modoJogo !== 'treino') {
            lidaDerrota('bateria');
		}
	});
}

function exibeCapturaMonstro(monstro) {
    const capturouMonstro = document.getElementById('capturouMonstro');
    const imgMonstroCapturado = document.getElementById('imgMonstroCapturado');  

    imgMonstroCapturado.setAttribute('src', `media/monstros/${monstro}.png`); 
    capturouMonstro.style.setProperty('display', 'block');
    setTimeout(() => {
        capturouMonstro.style.setProperty('display', 'none');
    }, 2000);
}

function exibeToast(mensagem, valor = -1) {
	const toast = document.getElementById('toast');
	toast.style.setProperty('display', 'block');
	toast.innerText = mensagem;

	let imagem = 'media/fogo.png';;

    if (valor > 0) {
        executaEfeitoSonoro('fogo-0');
    } else if (valor < 0) {
        executaEfeitoSonoro('1');
    }

    if (valor > 10) {
        valor = 10;
    }

	for (let i = 0; i < valor; i++) {
		let img = document.createElement('img');
		img.setAttribute('src', imagem);
		toast.append(img);
	}

	setTimeout(() => {
		toast.style.setProperty('display', 'none');
	}, 5000);
}

iconeFecharModalInicial.addEventListener('click', () => {
    modalInicial.style.setProperty('display', 'none');
    temporizador();
});

btnVoltar.addEventListener('click', () => {
    executaEfeitoSonoro('1');
    modalInicial.style.setProperty('display', 'none');
    temporizador();
});

opcaoMenu.addEventListener('click', () => {
    executaEfeitoSonoro('1');
    modalInicial.style.setProperty('display', 'flex');
    atualizaExibicaoPerfilJogador();
    salvaPerfilJogador();
    atualizaResumoConfiguracoes();
    clearInterval(intervaloTemporizador);
});

// checkbox limites configuração
checkboxDesativarEfeitosSonoros.addEventListener('click', () => {
    if (desativarEfeitosSonoros) {
        desativarEfeitosSonoros = false;
    } else {
        desativarEfeitosSonoros = true;
    }
    perfilJogador.desativarEfeitosSonoros = desativarEfeitosSonoros;
    salvaPerfilJogador();
    atualizaResumoConfiguracoes();
});

checkboxDesativarMusica.addEventListener('click', () => {
    if (desativarMusica) {
        desativarMusica = false;
        musicaFundo.play();
    } else {
        desativarMusica = true;
        musicaFundo.pause();
    }
    perfilJogador.desativarMusica = desativarMusica;
    salvaPerfilJogador();
    atualizaResumoConfiguracoes();
});

checkboxDesativarAnimacaoBackground.addEventListener('click', () => {
    if (desativarAnimacaoBackground) {
        desativarAnimacaoBackground = false;
        document.querySelector('body').style.setProperty('animation', 'moveBg 10s infinite;');
    } else {
        desativarAnimacaoBackground = true;
        document.querySelector('body').style.setProperty('animation', 'none');
    }
    perfilJogador.desativarAnimacaoBackground = desativarAnimacaoBackground;
    salvaPerfilJogador();
    atualizaResumoConfiguracoes();
});

const novaDificuldade = [... document.querySelectorAll('.nova-dificuldade')];
novaDificuldade.forEach(dificuldade => { 
    dificuldade.addEventListener('click', () => {
        dificuldade = document.querySelector('input[name="radioDificuldade"]:checked').value;
        perfilJogador.dificuldade = dificuldade;
        atualizaResumoConfiguracoes();
        salvaPerfilJogador();
        if (!verificaSeJaTemConquista('Insatisfeito')) {
            perfilJogador.itensInventario.push({categoria: 'titulo', titulo: 'Insatisfeito', descricao: 'Você ganhou esta conquista por alterar a dificuldade do jogo.', img: 'media/conquistas/conquista3.png'});
            atualizaExibicaoPerfilJogador();
            exibeToast('Você obteve uma conquista!', 0);        
        }    
    });
});

const abrirComoJogar = document.querySelector('#abrirComoJogar');
const abrirConfiguracoes = document.querySelector('#abrirConfiguracoes');
const abrirLoja = document.querySelector('#abrirLoja');
const abrirEditarPerfil = document.querySelector('#abrirEditarPerfil');
const abrirConquista = document.querySelector('#abrirConquista');
const abrirCriador = document.querySelector('#abrirCriador');
const abrirMonstrosCapturados = document.querySelector('#abrirMonstrosCapturados');

const divsAbertura = [... document.querySelectorAll('.divsAbertura')];
const abridores = [... document.querySelectorAll('.abridores')];

const divComoJogar = document.querySelector('#divComoJogar');
const divConfiguracoes = document.querySelector('#divConfiguracoes');
const divLoja = document.querySelector('#divLoja');
const divEditarPerfil = document.querySelector('#divEditarPerfil');
const divConquistas = document.querySelector('#divConquistas');
const divMonstrosCapturados = document.querySelector('#divMonstrosCapturados');

function fechaDivsAbertura(excecao) {
    divsAbertura.forEach(div => {
        if (div != excecao) {
            div.classList.add('esconde');
        }
    });
}

function executaEfeitoSonoro(nome, extensao = 'wav', loop = false) {
    if (!desativarEfeitosSonoros) {
        const efeitoSonoro = new Audio(`media/efeitos-sonoros/${nome}.${extensao}`);
        efeitoSonoro.loop = loop;
        efeitoSonoro.play();
    }
}

abridores.forEach(abridor => {
    abridor.addEventListener('click', () => {
        executaEfeitoSonoro('1');
    })
});

abrirCriador.addEventListener('click', () => {
    window.location.href = "criador.html";
});

abrirComoJogar.addEventListener('click', () => {
    fechaDivsAbertura(divComoJogar);
    divComoJogar.classList.toggle('esconde');
});

abrirConfiguracoes.addEventListener('click', () => {
    fechaDivsAbertura(divConfiguracoes);
    divConfiguracoes.classList.toggle('esconde');
});

abrirLoja.addEventListener('click', () => {
    fechaDivsAbertura(divLoja);
    divLoja.classList.toggle('esconde');
});

abrirEditarPerfil.addEventListener('click', () => {
    fechaDivsAbertura(divEditarPerfil);
    divEditarPerfil.classList.toggle('esconde');
});

abrirConquistas.addEventListener('click', () => {
    fechaDivsAbertura(divConquistas);
    divConquistas.classList.toggle('esconde');
});

abrirMonstrosCapturados.addEventListener('click', () => {
    fechaDivsAbertura(divMonstrosCapturados);
    divMonstrosCapturados.classList.toggle('esconde');
});

// Loja
const btnComprar = document.querySelectorAll('.btnComprar');
btnComprar.forEach(btn => {
    btn.addEventListener('click', () => {
        let compraFeita = false;
        switch(btn.getAttribute('title')) {
            case 'pocao-tempo':
                if (perfilJogador.saldo >= 250) {
                    perfilJogador.saldo -= 250;
                    perfilJogador.quantidadePocaoTempo++;
                    compraFeita = true;
                } 
                break;
            case 'pocao-bateria':
                if (perfilJogador.saldo >= 250) {
                    perfilJogador.saldo -= 250;
                    perfilJogador.quantidadePocaoBateria++;
                    compraFeita = true;
                }
                break;
            case 'foto-guerreiro':
                if (perfilJogador.saldo >= 500) {
                    perfilJogador.saldo -= 500;
                    perfilJogador.itensInventario.push({categoria: 'foto', titulo: btn.getAttribute('title'), descricao: btn.getAttribute('title'), img: 'media/itens-loja/personagens/con1.png', equipado: false});
                    compraFeita = true;
                }
                break;
            case 'foto-bruxa':
                if (perfilJogador.saldo >= 500) {
                    perfilJogador.saldo -= 500;
                    perfilJogador.itensInventario.push({categoria: 'foto', titulo: btn.getAttribute('title'), descricao: btn.getAttribute('title'), img: 'media/itens-loja/personagens/con2.png', equipado: false});
                    compraFeita = true;
                }
                break;
            case 'foto-ladrao':
                if (perfilJogador.saldo >= 500) {
                    perfilJogador.saldo -= 500;
                    perfilJogador.itensInventario.push({categoria: 'foto', titulo: btn.getAttribute('title'), descricao: btn.getAttribute('title'), img: 'media/itens-loja/personagens/con3.png', equipado: false});
                    compraFeita = true;
                }
                break;
            case 'foto-ferreiro':
                if (perfilJogador.saldo >= 500) {
                    perfilJogador.saldo -= 500;
                    perfilJogador.itensInventario.push({categoria: 'foto', titulo: btn.getAttribute('title'), descricao: btn.getAttribute('title'), img: 'media/itens-loja/personagens/con4.png', equipado: false});
                    compraFeita = true;
                }
                break;
            case 'foto-ladra':
                if (perfilJogador.saldo >= 500) {
                    perfilJogador.saldo -= 500;
                    perfilJogador.itensInventario.push({categoria: 'foto', titulo: btn.getAttribute('title'), descricao: btn.getAttribute('title'), img: 'media/itens-loja/personagens/con5.png', equipado: false});
                    compraFeita = true;
                }
                break;
            case 'foto-arqueiro':
                if (perfilJogador.saldo >= 500) {
                    perfilJogador.saldo -= 500;
                    perfilJogador.itensInventario.push({categoria: 'foto', titulo: btn.getAttribute('title'), descricao: btn.getAttribute('title'), img: 'media/itens-loja/personagens/con6.png', equipado: false});
                    compraFeita = true;
                }
                break;
            case 'foto-homem-areia':
                if (perfilJogador.saldo >= 500) {
                    perfilJogador.saldo -= 500;
                    perfilJogador.itensInventario.push({categoria: 'foto', titulo: btn.getAttribute('title'), descricao: btn.getAttribute('title'), img: 'media/itens-loja/personagens/con7.png', equipado: false});
                    compraFeita = true;
                }
                break;
            case 'foto-fada':
                if (perfilJogador.saldo >= 500) {
                    perfilJogador.saldo -= 500;
                    perfilJogador.itensInventario.push({categoria: 'foto', titulo: btn.getAttribute('title'), descricao: btn.getAttribute('title'), img: 'media/itens-loja/personagens/con8.png', equipado: false});
                    compraFeita = true;
                }
                break;
            case 'foto-ninja':
                if (perfilJogador.saldo >= 500) {
                    perfilJogador.saldo -= 500;
                    perfilJogador.itensInventario.push({categoria: 'foto', titulo: btn.getAttribute('title'), descricao: btn.getAttribute('title'), img: 'media/itens-loja/personagens/con9.png', equipado: false});
                    compraFeita = true;
                }
                break;
        }

        if (!compraFeita) {
            exibeToast('Saldo insuficiente!', 0);
        } else {
            atualizaEditarPerfil();
            atualizaExibicaoPerfilJogador();
            exibeToast('Item adquirido com sucesso.', 0);

            if (!verificaSeJaTemConquista('O Comprador')) {
                perfilJogador.itensInventario.push({categoria: 'titulo', titulo: 'O Comprador', descricao: 'Você ganhou esta conquista por comprar um item na loja.', img: 'media/conquistas/conquista2.png'});
                atualizaExibicaoPerfilJogador();
                exibeToast('Você obteve uma conquista!', 0);        
            }

        }
        
    });
});

// Editar perfil
function desequipa(categoria) {
    for (let i = 0; i < perfilJogador.itensInventario.length; i++) {
        if (perfilJogador.itensInventario[i].categoria === categoria) {
            perfilJogador.itensInventario[i].equipado = false;
        }
    }
}

function equipa(titulo) {
    console.log(titulo);
    for (let i = 0; i < perfilJogador.itensInventario.length; i++) {
        if (perfilJogador.itensInventario[i].titulo === titulo) {
            perfilJogador.itensInventario[i].equipado = true;
        }
    }
}

function atualizaEditarPerfil() {
    let grid = [... divEditarPerfil.children][1];
    grid.innerHTML = '';
    perfilJogador.itensInventario.forEach(item => {
        if (item.categoria === 'foto' || item.categoria === 'titulo') {
            if (item.categoria === 'foto') {
                if (item.titulo !== 'Foto inicial') {
                    let removerItemLoja = document.querySelector(`#${item.titulo}`);
                    removerItemLoja.style.setProperty('display', 'none');               
                }
            }

            let divItem = document.createElement('div');
            divItem.classList.add('item');
            let titulo = document.createElement('h4');
            titulo.classList.add('titulo-item');
            let img = document.createElement('img');
            img.classList.add('img-item');
            
            let descricao = document.createElement('p');
            descricao.classList.add('descricao-item');
            let botao = document.createElement('button');
            botao.classList.add('botao-item', 'btnEquipar');
            botao.setAttribute('title', item.titulo);
            botao.setAttribute('categoria', item.categoria);

            titulo.innerText = item.titulo.replaceAll('-', ' do ');
            img.setAttribute('src', item.img);
            descricao.innerText = item.descricao.replaceAll('-', ' do ');
            botao.innerText = 'Equipar';

            divItem.appendChild(titulo);
            divItem.appendChild(img);
            divItem.appendChild(descricao);
            divItem.appendChild(botao);
            grid.appendChild(divItem);
        }
    });

    const btnEquipar = [... document.querySelectorAll('.btnEquipar')];
    btnEquipar.forEach(btn => {
        btn.addEventListener('click', () => {
            let equipou = false;
            switch(btn.getAttribute('categoria')) {
                case 'foto':
                    desequipa(btn.getAttribute('categoria'));
                    equipa(btn.getAttribute('title'));
                    exibeToast('Item equipado com sucesso.', 0);
                    equipou = true;
                    break;
                case 'titulo':
                    desequipa(btn.getAttribute('categoria'));
                    equipa(btn.getAttribute('title'));
                    exibeToast('Item equipado com sucesso.', 0);
                    equipou = true;
                    break;
            }
            if (equipou) {
                if (!verificaSeJaTemConquista('Equipado')) {
                    perfilJogador.itensInventario.push({categoria: 'titulo', titulo: 'Equipado', descricao: 'Você ganhou esta conquista por equipar um item pela primeira vez.', img: 'media/conquistas/conquista4.png'});
                    atualizaExibicaoPerfilJogador();
                    exibeToast('Você obteve uma conquista!', 0);        
                }                 
            }
            atualizaExibicaoPerfilJogador();
        })
    });
}

atualizaExibicaoPerfilJogador(perfilJogador);

const btnCompartilharPerfil = document.querySelector('#btnCompartilharPerfil');
btnCompartilharPerfil.addEventListener('click', () => {

    let tituloEquipado;
    for (let i = 0; i < perfilJogador.itensInventario.length; i++) {
        if (perfilJogador.itensInventario[i].categoria === 'titulo' && perfilJogador.itensInventario[i].equipado) {
            tituloEquipado = perfilJogador.itensInventario[i].titulo;
        }
    }

    navigator.clipboard.writeText(`Perfil - Jogo TORNE VERDADEIRO\n\n• Nome: ${perfilJogador.nome}\n• Título: ${tituloEquipado}\n• Nível: ${perfilJogador.nivel}\n• Recorde de fases: ${perfilJogador.recordeFases[0]} (no ${perfilJogador.recordeFases[1]})\n• Recorde de estrelas: ${perfilJogador.recordeEstrelas[0]} (no ${perfilJogador.recordeEstrelas[1]})`);
    exibeToast('Perfil copiado para a área de transferência.', 0)
});

// mudança de tema
const tema1 = document.querySelector('#tema1');
const tema2 = document.querySelector('#tema2');
const tema3 = document.querySelector('#tema3');

tema1.addEventListener('click', () => {
    document.querySelector('body').style.setProperty('background-image', "url(media/bg1.jpg)");
    perfilJogador.tema = 1;
    salvaPerfilJogador();
    atualizaResumoConfiguracoes();
})
tema2.addEventListener('click', () => {
    document.querySelector('body').style.setProperty('background-image', "url(media/bg2.jpg)");
    perfilJogador.tema = 1;
    salvaPerfilJogador();
    atualizaResumoConfiguracoes();
})
tema3.addEventListener('click', () => {
    document.querySelector('body').style.setProperty('background-image', "url(media/bg3.jpg)");
    perfilJogador.tema = 1;
    salvaPerfilJogador();
    atualizaResumoConfiguracoes();
})

function descomprimeCircuito(circuitoJSON) {
    return circuitoJSON
        .replaceAll('^', '"lista_elementos":')
        .replaceAll('~', '"posicao_elementos_iniciais":')
        .replaceAll('=', '"solucoes_possiveis":')
        .replaceAll('A', '{"elemento":"linha-central-vertical","posicao":')
        .replaceAll('B', '{"elemento":"linha-recentralizadora-esquerda","posicao":')
        .replaceAll('C', '{"elemento":"linha-recentralizadora-direita","posicao":')
        .replaceAll('D', '{"elemento":"linha-central-horizontal","posicao":')
        .replaceAll('E', '{"elemento":"primeiro-canto","posicao":')
        .replaceAll('F', '{"elemento":"segundo-canto","posicao":')
        .replaceAll('G', '{"elemento":"terceiro-canto","posicao":')
        .replaceAll('H', '{"elemento":"quarto-canto","posicao":')
        .replaceAll('I', '{"elemento":"cruz","posicao":')
        .replaceAll('J', '{"elemento":"cruz-quebrada-esquerda","posicao":')
        .replaceAll('K', '{"elemento":"cruz-quebrada-direita","posicao":')
        .replaceAll('L', '{"elemento":"t","posicao":')
        .replaceAll('M', '{"elemento":"not","posicao":')
        .replaceAll('N', '{"elemento":"and","posicao":')
        .replaceAll('O', '{"elemento":"or","posicao":')
        .replaceAll('P', '{"elemento":"nand","posicao":')
        .replaceAll('Q', '{"elemento":"xor","posicao":')
        .replaceAll('R', '{"elemento":"nor","posicao":')
        .replaceAll('S', '{"elemento":"xnor","posicao":')
        .replaceAll('T', ',"conexao":')
        .replaceAll('U', '},')
        .replaceAll('V', '],')
        .replaceAll('W', '"0","0"')
        .replaceAll('X', '"1","1"')
        .replaceAll('Y', '"0","1"')
        .replaceAll('Z', '"1","0"')
        .replaceAll('@', '[]')
        .replaceAll('$', '[[')
        .replaceAll('*', '144,145')
        .replaceAll(')', ']}');
}

function atualizaResumoConfiguracoes() {
    const resumoConfiguracoes = document.getElementById('resumoConfiguracoes');

    let msgs = ['', '', ''];
    if (perfilJogador.desativarAnimacaoBackground) {
        msgs[0] = 'sem animação no background';
    } else {
        msgs[0] = 'com animação no background';
    }
    if (perfilJogador.desativarEfeitosSonoros) {
        msgs[1] = 'sem efeitos sonoros';
    } else {
        msgs[1] = 'com efeitos sonoros';
    }
    if (perfilJogador.desativarMusica) {
        msgs[2] = 'sem música'
    } else {
        msgs[2] = 'com música'
    }

    switch(perfilJogador.dificuldade) {
        case 'facil':
            document.getElementById('dificuldadeFacil').setAttribute('checked', 'true');
            break;
        case 'normal':
            document.getElementById('dificuldadeNormal').setAttribute('checked', 'true');
            break;
        case 'dificil':
            document.getElementById('dificuldadeDificil').setAttribute('checked', 'true');
            break;
        case 'impossivel':
            document.getElementById('dificuldadeImpossivel').setAttribute('checked', 'true');
            break;
    }

    resumoConfiguracoes.innerText = `Você está configurado para jogar no nível ${perfilJogador.dificuldade}; tema ${perfilJogador.tema}; ${msgs[0]}; ${msgs[1]}; ${msgs[2]}.`;
}

atualizaResumoConfiguracoes();

// conquista eu também sei fazer
if (params.get('autor') === perfilJogador.nome) {
    if (!verificaSeJaTemConquista('Eu também sei fazer')) {
        perfilJogador.itensInventario.push({categoria: 'titulo', titulo: 'Eu também sei fazer', descricao: 'Você ganhou esta conquista por criar um circuito.', img: 'media/conquistas/conquista14.png'});
        atualizaExibicaoPerfilJogador();
        exibeToast('Você obteve uma conquista!', 0);        
    }
}

// conquista eu tenho amigos
if (params.get('autor') !== null && params.get('autor') !== perfilJogador.nome) {
    if (!verificaSeJaTemConquista('Eu tenho amigos')) {
        perfilJogador.itensInventario.push({categoria: 'titulo', titulo: 'Eu tenho amigos', descricao: 'Você ganhou esta conquista por criar um circuito.', img: 'media/conquistas/conquista15.png'});
        atualizaExibicaoPerfilJogador();
        exibeToast('Você obteve uma conquista!', 0);        
    }
}

const data = new Date();
const ano = data.getFullYear();
const dia = data.getDate();
const mes = data.getMonth() + 1; 
const horas = data.getHours();
const minutos = data.getMinutes();

let diaMaisAtual = 3, mesMaisAtual = 5, anoMaisAtual = 2022;

if (dia < diaMaisAtual && mes <= mesMaisAtual && ano <= anoMaisAtual) {
    window.localStorage.clear();
    exibeToast('O localStorage foi limpo pois a versão do Torne Verdadeiro estava desatualizada. Reiniciando em 3...2...1...', 0);
    setTimeout(() => {
        document.location.reload(true);
    }, 3000);
}