const circuito = document.querySelector('#circuito');
const solucaoPerfeita = document.querySelector('#solucaoPerfeita');
const output = document.querySelector('#output');

const DIMENSAO_ELEMENTO = '35px';
const ELEMENTOS_POR_COLUNA = 10;
const QUANTIDADE_ELEMENTOS = 150;

document.documentElement.style.setProperty('--dimensaoElemento', DIMENSAO_ELEMENTO);
document.documentElement.style.setProperty('--elementosPorColuna', ELEMENTOS_POR_COLUNA);

// cria os espaços do circuito
for (let i = 0; i < QUANTIDADE_ELEMENTOS; i++) {
	const espacoElemento = document.createElement('div');
	espacoElemento.setAttribute('title', `${i}`);
	espacoElemento.classList.add('espacoElemento');
	circuito.appendChild(espacoElemento);
}
// coloca os inputs de solução
for (let i = 0; i < ELEMENTOS_POR_COLUNA; i++) {
	const div = document.createElement('div');
	div.classList.add('input-solucao-perfeita', 'input');
	div.innerText = 0;
	solucaoPerfeita.appendChild(div); // input é a div com flexbox
}

const elementos = [... document.querySelectorAll('.elemento')];
const espacosElementos = [... document.querySelectorAll('.espacoElemento')];
const codigo = document.querySelector('#codigo');

let elementoClicado = null;
let elementoCriado = null;
let listaElementos = [];

function arrayQuantidadeColunas() {
	return ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
}

let codigoFinal = {
	listaElementos: [],
	posicaoElementosIniciais: null,
	solucoesPossiveis: []
};

function limpaElementos() {
	elementos.forEach(elemento => {
		elementoClicado = null;
		elementoCriado = null;
		elementoAutomatico = null;
		elemento.style.border = 'none';
	});
}

function objetoElemento() {
	return {
		elemento: null,
		posicao: null,
		conexao: []
	};
}

elementos.forEach(elemento => {
	elemento.addEventListener('click', () => {
		houveElementoAutomatico = false;
		const music = new Audio('media/efeitos-sonoros/0.wav'); music.play(); music.loop = false;
		limpaElementos();
		elementoClicado = elemento.getAttribute('title');
		elementoCriado = objetoElemento();
		elemento.style.border = '2px solid seagreen';
	})
});

document.addEventListener("keypress", function(event) {
	if (event.keyCode === 49) {
		elementos.forEach(elemento => {
			if (elemento.getAttribute('title') === 'linha-central-vertical') {
				houveElementoAutomatico = false;
				const music = new Audio('media/efeitos-sonoros/0.wav'); music.play(); music.loop = false;
				limpaElementos();
				elementoClicado = elemento.getAttribute('title');
				elementoCriado = objetoElemento();
				elemento.style.border = '2px solid seagreen';				
			}
		});		
	}
});

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let elementoAutomatico;
let houveElementoAutomatico = false;
function criaElementoAutomatico(indice) {
	elementoAutomatico = objetoElemento();
	elementoAutomatico['conexao'].push(indice);

	if (getRandomIntInclusive(0, 1) === 1) {
		elementoAutomatico['posicao'] = indice - 10;
		espacosElementos[indice - 10].classList.add('elemento-presente');
		elementoAutomatico['elemento'] = 'linha-recentralizadora-esquerda';
		espacosElementos[indice - 10].style.backgroundImage = "url('media/elementos/linha-recentralizadora-esquerda.png')";
	} else {
		elementoAutomatico['posicao'] = indice+1 - 10;
		espacosElementos[indice+1 - 10].classList.add('elemento-presente');
		elementoAutomatico['elemento'] = 'linha-recentralizadora-direita';
		espacosElementos[indice+1 - 10].style.backgroundImage = "url('media/elementos/linha-recentralizadora-direita.png')";						
	}
	houveElementoAutomatico = true;
}

function criaConexaoElemento(indice, nomeElemento) {
	if (indice < 140) {
		// elementos que se conectam no elemento abaixo e tão somente no elemento abaixo
		if (nomeElemento === 'linha-central-vertical' || nomeElemento === 'cruz' || nomeElemento === 'cruz-quebrada-esquerda' || nomeElemento === 'cruz-quebrada-direita' || nomeElemento === 't' || nomeElemento === 'not') {
			return [indice + 10];
		}
		// elementos que se conectam a algum elemento ao lado
		if (nomeElemento === 'linha-central-horizontal') {
			if (espacosElementos[indice - 1].classList.contains('elemento-presente')) {
				return [indice - 1];
			} else {
				return [indice + 1];
			}
		}

		// elementos que se conectam à esquerda
		if (nomeElemento === 'primeiro-canto' || nomeElemento === 'quarto-canto') {
			return [indice - 1];
		}

		// elementos que se conectam à direita
		if (nomeElemento === 'segundo-canto' || nomeElemento === 'terceiro-canto') {
			return [indice + 1];
		}


		// elementos que se conectam a dois outros elementos imediatamente abaixo (isto é, elementos complexos)
		if (nomeElemento === 'and' || nomeElemento === 'or' || nomeElemento === 'xor' || nomeElemento === 'xnor' || nomeElemento === 'nor' || nomeElemento === 'nand') {
			return [indice + 10, indice + 10 + 1];
		}
	} else {
		return [];
	}
}

let posicaoElementosIniciais = [];
for (let i = 0; i < espacosElementos.length; i++) {
	espacosElementos[i].addEventListener('click', () => {
		if (elementoClicado) {
			const music = new Audio('media/efeitos-sonoros/1.wav'); music.play(); music.loop = false;
			let conexao = criaConexaoElemento(i, elementoClicado);
			switch(elementoClicado) {
				case 'and':
					espacosElementos[i].style.backgroundImage = "url('media/elementos/primeiro-and.png')";
					espacosElementos[i+1].style.backgroundImage = "url('media/elementos/segundo-and.png')";
					criaElementoAutomatico(i);
					break;
				case 'or':
					espacosElementos[i].style.backgroundImage = "url('media/elementos/primeiro-or.png')";
					espacosElementos[i+1].style.backgroundImage = "url('media/elementos/segundo-or.png')";
					criaElementoAutomatico(i);
					break;
				case 'xor':
					espacosElementos[i].style.backgroundImage = "url('media/elementos/primeiro-xor.png')";
					espacosElementos[i + 1].style.backgroundImage = "url('media/elementos/segundo-xor.png')";
					criaElementoAutomatico(i);
					break;
				case 'xnor':
					espacosElementos[i].style.backgroundImage = "url('media/elementos/primeiro-xnor.png')";
					espacosElementos[i + 1].style.backgroundImage = "url('media/elementos/segundo-xnor.png')";
					criaElementoAutomatico(i);
					break;
				case 'nor':
					espacosElementos[i].style.backgroundImage = "url('media/elementos/primeiro-nor.png')";
					espacosElementos[i + 1].style.backgroundImage = "url('media/elementos/segundo-nor.png')";
					criaElementoAutomatico(i);
					break;
				case 'nand':
					espacosElementos[i].style.backgroundImage = "url('media/elementos/primeiro-nand.png')";
					espacosElementos[i + 1].style.backgroundImage = "url('media/elementos/segundo-nand.png')";
					criaElementoAutomatico(i);
					break;
				case 'not':
					espacosElementos[i].style.backgroundImage = "url('media/elementos/not.png')";
					break;
				case 'linha-central-vertical':
					espacosElementos[i].style.backgroundImage = "url('media/elementos/linha-central-vertical.png')";
					break;
				case 'primeiro-canto':
					espacosElementos[i].style.backgroundImage = "url('media/elementos/primeiro-canto.png')";
					break;
				case 'segundo-canto':
					espacosElementos[i].style.backgroundImage = "url('media/elementos/segundo-canto.png')";
					break;	
				case 'terceiro-canto':
					espacosElementos[i].style.backgroundImage = "url('media/elementos/terceiro-canto.png')";
					break;	
				case 'quarto-canto':
					espacosElementos[i].style.backgroundImage = "url('media/elementos/quarto-canto.png')";
					break;	
				case 'linha-central-horizontal':
					espacosElementos[i].style.backgroundImage = "url('media/elementos/linha-central-horizontal.png')";
					break;
				case 'cruz':
					espacosElementos[i].style.backgroundImage = "url('media/elementos/cruz.png')";
					break;
				case 'cruz-quebrada-esquerda':
					espacosElementos[i].style.backgroundImage = "url('media/elementos/cruz-quebrada-esquerda.png')";
					break;
				case 'cruz-quebrada-direita':
					espacosElementos[i].style.backgroundImage = "url('media/elementos/cruz-quebrada-direita.png')";
					break;
				case 't':
					espacosElementos[i].style.backgroundImage = "url('media/elementos/t.png')";
					break;
				case 'remove':
					espacosElementos[i].style.backgroundImage = "none";
					for (let j = 0; j < listaElementos.length; j++) {
						if (listaElementos[j].posicao === i) {
							listaElementos.splice(j, 1);
						}
					}
					break;
			}
			espacosElementos[i].classList.add('elemento-presente');
			elementoCriado.elemento = elementoClicado;
			elementoCriado.posicao = i;
			elementoCriado.conexao = conexao;
			if (elementoClicado !== 'remove') {
				listaElementos.push(elementoCriado);

				if (houveElementoAutomatico) {
					listaElementos.push(elementoAutomatico);
				}

				if (i >= 140) {
					posicaoElementosIniciais.push(i);
				}				
			}
			limpaElementos();
			exibeToast('Elemento inserido e conexão informada com sucesso.', 'purple');
			verificarSolucoesPossiveis();
		} else {
			const music = new Audio('media/efeitos-sonoros/1.wav'); music.play(); music.loop = false;
			exibeToast('Primeiro selecione um elemento para inserir no espaço vazio.', 'brown');
		}
		codigoFinal.listaElementos = listaElementos;
		codigoFinal.posicaoElementosIniciais = posicaoElementosIniciais;
		codigo.value = JSON.stringify(codigoFinal);
	})
}

function formataNomes(nome) {
	nome = nome.replaceAll('-', ' ');
	nome = nome.toUpperCase();

	return nome;
}

// event listeners nos inputs de solução perfeita
const inputsSolucaoPerfeita = document.querySelectorAll('.input-solucao-perfeita');
for (let i = 0; i < inputsSolucaoPerfeita.length; i++) {
	inputsSolucaoPerfeita[i].addEventListener('click', () => {
		if (inputsSolucaoPerfeita[i].innerText === '0') {
			inputsSolucaoPerfeita[i].innerText = '1';
			inputsSolucaoPerfeita[i].style.setProperty('background-color', 'seagreen');
			const music = new Audio('media/efeitos-sonoros/1.wav'); music.play(); music.loop = false;
		} else {
			inputsSolucaoPerfeita[i].innerText = '0';
			inputsSolucaoPerfeita[i].style.setProperty('background-color', 'tomato');

			const music = new Audio('media/efeitos-sonoros/0.wav'); music.play(); music.loop = false;
		}
		propaga(listaElementos);
	});
}

function exibeToast(conteudo, bg = 'seagreen') {
	const toast = document.querySelector('.toast');
	toast.style.setProperty('background-color', bg);
	toast.style.setProperty('display', 'block');
	toast.innerText = conteudo;
	setTimeout(() => {
		toast.style.setProperty('display', 'none');
	}, 3000);
}

function estadosIguais(estado1, estado2) {
    let iguais = true;
    for (let i = 0; i < estado1.length; i++) {
        if (estado1[i] !== estado2[i]) {
            iguais = false;
            break;
        }
    }
    return iguais;
}

function criaTodasPossibilidadesSolucao(posicaoElementosIniciais) {
	let quantidadeNecessaria = Math.pow(2, posicaoElementosIniciais.length);
	let respostasPossiveisValidas = [];
	
	do {
		let estadoInicial = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
	    for (let i = 0; i < posicaoElementosIniciais.length; i++) {
	        estadoInicial[posicaoElementosIniciais[i] - 140] = getRandomIntInclusive(0, 1).toString();
	    }

		let jaTem = false;
		for (let j = 0; j < respostasPossiveisValidas.length; j++) {
			if (estadosIguais(respostasPossiveisValidas[j], estadoInicial)) {
				jaTem = true;
			}
		}

		if (!jaTem) {
			respostasPossiveisValidas.push(estadoInicial);
		}
	} while(respostasPossiveisValidas.length < quantidadeNecessaria);

    return respostasPossiveisValidas;
}

function defineInputsCircuito(estadoInicial) {
	const inputs = [... document.querySelectorAll('.input')];
	inputs.forEach((input, index) => {
		if (estadoInicial[index] === '0') {
			input.style.setProperty('background-color', 'tomato');
		} else {
			input.style.setProperty('background-color', 'seagreen');
		}
		input.innerText = estadoInicial[index];
	});
}

function verificarSolucoesPossiveis() {
	let respostasPossiveisValidas = criaTodasPossibilidadesSolucao(posicaoElementosIniciais);
	let solucoesPossiveis = [];
	for (let i = 0; i < respostasPossiveisValidas.length; i++) {
		defineInputsCircuito(respostasPossiveisValidas[i]);
		let r = propaga(listaElementos);
		if (r) {
			let jaTem = false;
			for (let j = 0; j < solucoesPossiveis.length; j++) {
				if (estadosIguais(solucoesPossiveis[j], respostasPossiveisValidas[i])) {
					jaTem = true;
				}
			}

			if (!jaTem) {
				solucoesPossiveis.push(respostasPossiveisValidas[i]);
			}
		}
	}

	codigoFinal.solucoesPossiveis = solucoesPossiveis;
	codigo.value = JSON.stringify(codigoFinal);
}

function propaga(circuitoJSON) {
	const inputs = [... document.querySelectorAll('.input')];
	for (let i = 0; i < inputs.length; i++) {
		if (inputs[i].innerText === '1' && (espacosElementos[i + 140].classList.contains('elementoPresente') || espacosElementos[i + 140].classList.contains('elemento-presente'))) {
			espacosElementos[i + 140].classList.add('on');
			espacosElementos[i + 140].style.backgroundImage = 'url("media/elementos/linha-central-vertical-on.png")';
		} else if (espacosElementos[i + 140].classList.contains('elemento-presente')) {
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
                    espacosElementos[circuitoJSON[i].posicao].style.backgroundImage = `url(media/elementos/${circuitoJSON[i].elemento}-on.png)`;
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

    let resultado = alteraOutput();

    return resultado;
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
		output.style.setProperty('background-color', 'seagreen');
		output.innerText = 'Verdadeiro';
	} else {
		output.style.setProperty('background-color', 'tomato');
		output.innerText = 'Falso';
	}

	return verdadeiro;
}