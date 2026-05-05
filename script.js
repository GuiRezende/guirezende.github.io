// ==============================
// Tema claro/escuro
// ==============================

const html = document.documentElement;
const botaoTema = document.querySelector('#theme-toggle');
const iconeTema = document.querySelector('#theme-toggle-icon');

const temaSalvo = localStorage.getItem('tema');

if (temaSalvo === 'escuro') {
  html.classList.add('dark');
  iconeTema.innerHTML = '☀️';
  botaoTema.setAttribute('aria-label', 'Ativar tema claro');
} else {
  html.classList.remove('dark');
  iconeTema.innerHTML = '🌙';
  botaoTema.setAttribute('aria-label', 'Ativar tema escuro');
}

botaoTema.addEventListener('click', () => {
  const modoEscuroAtivo = html.classList.toggle('dark');

  localStorage.setItem('tema', modoEscuroAtivo ? 'escuro' : 'claro');

  iconeTema.innerHTML = modoEscuroAtivo ? '☀️' : '🌙';

  botaoTema.setAttribute(
    'aria-label',
    modoEscuroAtivo ? 'Ativar tema claro' : 'Ativar tema escuro'
  );
});


// ==============================
// Seletores principais
// ==============================

const formularioContato = document.querySelector('#contact-form');
const formularioIdeia = document.querySelector('#idea-form');

const opcoesTipoPessoa = document.querySelectorAll('input[name="personType"]');
const campoDocumentoContainer = document.querySelector('#document-field-wrapper');
const labelDocumento = document.querySelector('#document-label');
const campoDocumento = document.querySelector('#document-number');


// ==============================
// Configuração dos campos
// ==============================

function configurarCampos() {
  const campoNomeContato = document.querySelector('#contact-name');
  const campoEmailContato = document.querySelector('#contact-email');
  const campoMensagemContato = document.querySelector('#contact-message');

  const campoNomeIdeia = document.querySelector('#idea-name');
  const campoEmailIdeia = document.querySelector('#idea-email');
  const campoTipoProjeto = document.querySelector('#project-type');
  const campoPrazo = document.querySelector('#deadline');
  const campoDescricao = document.querySelector('#idea-description');
  const campoTermos = document.querySelector('#terms');

  campoNomeContato.setAttribute('required', true);
  campoNomeContato.setAttribute('minlength', '3');

  campoEmailContato.setAttribute('required', true);
  campoEmailContato.setAttribute('minlength', '4');

  campoMensagemContato.setAttribute('required', true);
  campoMensagemContato.setAttribute('minlength', '10');

  campoNomeIdeia.setAttribute('required', true);
  campoNomeIdeia.setAttribute('minlength', '3');

  campoEmailIdeia.setAttribute('required', true);
  campoEmailIdeia.setAttribute('minlength', '4');

  campoTipoProjeto.setAttribute('required', true);
  campoPrazo.setAttribute('required', true);

  campoDescricao.setAttribute('required', true);
  campoDescricao.setAttribute('minlength', '10');

  campoTermos.setAttribute('required', true);

  opcoesTipoPessoa.forEach((opcao) => {
    opcao.setAttribute('required', true);
  });

  const opcoesOrcamento = document.querySelectorAll('input[name="budget"]');

  opcoesOrcamento.forEach((opcao) => {
    opcao.setAttribute('required', true);
  });
}

configurarCampos();


// ==============================
// Mensagens de erro
// ==============================

const tiposDeErro = [
  'valueMissing',
  'typeMismatch',
  'patternMismatch',
  'tooShort',
  'customError'
];

const mensagens = {
  name: {
    valueMissing: 'O campo de nome não pode estar vazio.',
    tooShort: 'Por favor, preencha um nome com pelo menos 3 caracteres.'
  },

  email: {
    valueMissing: 'O campo de e-mail não pode estar vazio.',
    typeMismatch: 'Por favor, preencha um e-mail válido.',
    tooShort: 'Por favor, preencha um e-mail válido.'
  },

  message: {
    valueMissing: 'O campo de mensagem não pode estar vazio.',
    tooShort: 'A mensagem precisa ter pelo menos 10 caracteres.'
  },

  personType: {
    valueMissing: 'Selecione se você é pessoa física ou pessoa jurídica.'
  },

  documentNumber: {
    valueMissing: 'O campo de documento não pode estar vazio.',
    patternMismatch: 'Por favor, preencha o documento no formato correto.',
    customError: 'O documento digitado não é válido.'
  },

  projectType: {
    valueMissing: 'Selecione o tipo de projeto.'
  },

  deadline: {
    valueMissing: 'Informe o prazo desejado para o projeto.'
  },

  budget: {
    valueMissing: 'Selecione uma opção de orçamento.'
  },

  description: {
    valueMissing: 'O campo de descrição não pode estar vazio.',
    tooShort: 'A descrição precisa ter pelo menos 10 caracteres.'
  },

  terms: {
    valueMissing: 'Você precisa confirmar as informações antes de enviar.'
  }
};


// ==============================
// Máscara CPF/CNPJ
// ==============================

let tipoPessoaSelecionado = '';

opcoesTipoPessoa.forEach((opcao) => {
  opcao.addEventListener('change', () => {
    tipoPessoaSelecionado = opcao.value;

    campoDocumentoContainer.classList.remove('hidden');
    campoDocumento.value = '';
    campoDocumento.setCustomValidity('');

    campoDocumento.setAttribute('required', true);

    if (tipoPessoaSelecionado === 'fisica') {
      labelDocumento.innerHTML = 'CPF';
      campoDocumento.setAttribute('placeholder', '000.000.000-00');
      campoDocumento.setAttribute('maxlength', '14');
      campoDocumento.setAttribute('minlength', '14');
      campoDocumento.setAttribute('pattern', '\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}');
    }

    if (tipoPessoaSelecionado === 'juridica') {
      labelDocumento.innerHTML = 'CNPJ';
      campoDocumento.setAttribute('placeholder', '00.000.000/0000-00');
      campoDocumento.setAttribute('maxlength', '18');
      campoDocumento.setAttribute('minlength', '18');
      campoDocumento.setAttribute('pattern', '\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}');
    }

    verificaCampo(campoDocumento);
  });
});

campoDocumento.addEventListener('input', () => {
  const apenasNumeros = campoDocumento.value.replace(/\D/g, '');

  if (tipoPessoaSelecionado === 'fisica') {
    campoDocumento.value = aplicarMascaraCpf(apenasNumeros);
  }

  if (tipoPessoaSelecionado === 'juridica') {
    campoDocumento.value = aplicarMascaraCnpj(apenasNumeros);
  }
});

function aplicarMascaraCpf(valor) {
  return valor
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function aplicarMascaraCnpj(valor) {
  return valor
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}


// ==============================
// Validação de CPF
// ==============================

function ehUmCpfValido(cpf) {
  const cpfLimpo = cpf.replace(/\.|-/g, '');

  if (validaNumerosRepetidos(cpfLimpo)) {
    return false;
  }

  if (validaPrimeiroDigitoCpf(cpfLimpo)) {
    return false;
  }

  if (validaSegundoDigitoCpf(cpfLimpo)) {
    return false;
  }

  return true;
}

function validaNumerosRepetidos(documento) {
  const numerosRepetidos = [
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999',
    '00000000000000',
    '11111111111111',
    '22222222222222',
    '33333333333333',
    '44444444444444',
    '55555555555555',
    '66666666666666',
    '77777777777777',
    '88888888888888',
    '99999999999999'
  ];

  return numerosRepetidos.includes(documento);
}

function validaPrimeiroDigitoCpf(cpf) {
  let soma = 0;
  let multiplicador = 10;

  for (let tamanho = 0; tamanho < 9; tamanho++) {
    soma += cpf[tamanho] * multiplicador;
    multiplicador--;
  }

  soma = (soma * 10) % 11;

  if (soma === 10 || soma === 11) {
    soma = 0;
  }

  return soma !== Number(cpf[9]);
}

function validaSegundoDigitoCpf(cpf) {
  let soma = 0;
  let multiplicador = 11;

  for (let tamanho = 0; tamanho < 10; tamanho++) {
    soma += cpf[tamanho] * multiplicador;
    multiplicador--;
  }

  soma = (soma * 10) % 11;

  if (soma === 10 || soma === 11) {
    soma = 0;
  }

  return soma !== Number(cpf[10]);
}


// ==============================
// Validação de CNPJ
// ==============================

function ehUmCnpjValido(cnpj) {
  const cnpjLimpo = cnpj.replace(/\D/g, '');

  if (cnpjLimpo.length !== 14 || validaNumerosRepetidos(cnpjLimpo)) {
    return false;
  }

  const pesosPrimeiroDigito = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesosSegundoDigito = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  let soma = 0;

  for (let contador = 0; contador < 12; contador++) {
    soma += Number(cnpjLimpo[contador]) * pesosPrimeiroDigito[contador];
  }

  let primeiroDigito = soma % 11;
  primeiroDigito = primeiroDigito < 2 ? 0 : 11 - primeiroDigito;

  if (primeiroDigito !== Number(cnpjLimpo[12])) {
    return false;
  }

  soma = 0;

  for (let contador = 0; contador < 13; contador++) {
    soma += Number(cnpjLimpo[contador]) * pesosSegundoDigito[contador];
  }

  let segundoDigito = soma % 11;
  segundoDigito = segundoDigito < 2 ? 0 : 11 - segundoDigito;

  return segundoDigito === Number(cnpjLimpo[13]);
}


// ==============================
// Validação com Validity State
// ==============================

const camposDosFormularios = document.querySelectorAll('input, select, textarea');

camposDosFormularios.forEach((campo) => {
  campo.addEventListener('blur', () => verificaCampo(campo));

  campo.addEventListener('invalid', (evento) => {
    evento.preventDefault();
  });
});

function verificaCampo(campo) {
  campo.setCustomValidity('');

  if (campo.name === 'documentNumber' && campo.value !== '') {
    if (tipoPessoaSelecionado === 'fisica' && !ehUmCpfValido(campo.value)) {
      campo.setCustomValidity('O CPF digitado não existe.');
    }

    if (tipoPessoaSelecionado === 'juridica' && !ehUmCnpjValido(campo.value)) {
      campo.setCustomValidity('O CNPJ digitado não existe.');
    }
  }

  let mensagem = '';

  tiposDeErro.forEach((erro) => {
    if (campo.validity[erro] && mensagens[campo.name]) {
      mensagem = mensagens[campo.name][erro];
    }
  });

  const mensagemErro = buscarMensagemErro(campo);
  const campoValido = campo.checkValidity();

  if (!campoValido && mensagemErro) {
    mensagemErro.innerHTML = mensagem;
    campo.classList.add('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
    campo.setAttribute('aria-invalid', 'true');
  } else if (mensagemErro) {
    mensagemErro.innerHTML = '';
    campo.classList.remove('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
    campo.setAttribute('aria-invalid', 'false');
  }
}

function buscarMensagemErro(campo) {
  if (campo.type === 'radio') {
    return campo.parentNode.parentNode.parentNode.querySelector('.error-message');
  }

  if (campo.type === 'checkbox') {
    return campo.parentNode.parentNode.querySelector('.error-message');
  }

  return campo.parentNode.querySelector('.error-message');
}

function formularioEstaValido(formulario) {
  const campos = formulario.querySelectorAll('input, select, textarea');
  let estaValido = true;

  campos.forEach((campo) => {
    verificaCampo(campo);

    if (!campo.checkValidity()) {
      estaValido = false;
    }
  });

  return estaValido;
}


// ==============================
// Câmera e captura de foto
// ==============================

const botaoAbrirCamera = document.querySelector('#open-camera');
const botaoTirarFoto = document.querySelector('#take-photo');
const videoCamera = document.querySelector('#camera-preview');
const canvasFoto = document.querySelector('#photo-canvas');
const resultadoFoto = document.querySelector('#photo-result');
const imagemCapturada = document.querySelector('#captured-photo');

let imagemUrl = '';
let cameraAberta = null;
let fotoCapturada = false;

botaoAbrirCamera.addEventListener('click', async function () {
  try {
    const iniciarVideo = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });

    cameraAberta = iniciarVideo;

    videoCamera.srcObject = iniciarVideo;
    videoCamera.classList.remove('hidden');

    botaoTirarFoto.disabled = false;
    botaoAbrirCamera.innerHTML = 'Câmera aberta';

    buscarMensagemErroFoto().innerHTML = '';
  } catch (erro) {
    buscarMensagemErroFoto().innerHTML =
      'Não foi possível acessar a câmera. Verifique a permissão do navegador.';
  }
});

botaoTirarFoto.addEventListener('click', function () {
  canvasFoto.width = videoCamera.videoWidth;
  canvasFoto.height = videoCamera.videoHeight;

  canvasFoto
    .getContext('2d')
    .drawImage(videoCamera, 0, 0, canvasFoto.width, canvasFoto.height);

  imagemUrl = canvasFoto.toDataURL('image/jpeg');

  imagemCapturada.setAttribute('src', imagemUrl);
  resultadoFoto.classList.remove('hidden');

  fotoCapturada = true;

  if (cameraAberta) {
    videoCamera.srcObject.getTracks().forEach((track) => track.stop());
  }

  videoCamera.classList.add('hidden');
  botaoTirarFoto.disabled = true;
  botaoAbrirCamera.innerHTML = 'Tirar outra foto';

  buscarMensagemErroFoto().innerHTML = '';
});

function buscarMensagemErroFoto() {
  return resultadoFoto.parentNode.querySelector('.error-message');
}


// ==============================
// Envio do formulário de contato
// ==============================

formularioContato.addEventListener('submit', function (evento) {
  evento.preventDefault();

  if (!formularioEstaValido(formularioContato)) {
    return;
  }

  const dadosContato = {
    nome: evento.target.elements['name'].value,
    email: evento.target.elements['email'].value,
    mensagem: evento.target.elements['message'].value
  };

  localStorage.setItem('contato', JSON.stringify(dadosContato));

  formularioContato.innerHTML = `
    <div class="rounded-2xl border border-green-300 bg-green-50 p-6 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
      <h4 class="text-lg font-semibold">Mensagem enviada com sucesso!</h4>
      <p class="mt-2">Obrigado pelo contato. Recebemos sua mensagem e retornaremos em breve.</p>
    </div>
  `;
});


// ==============================
// Envio do formulário Compartilhe sua ideia
// ==============================

formularioIdeia.addEventListener('submit', function (evento) {
  evento.preventDefault();

  const mensagemErroFoto = buscarMensagemErroFoto();

  if (!formularioEstaValido(formularioIdeia)) {
    return;
  }

  if (!fotoCapturada) {
    mensagemErroFoto.innerHTML = 'Tire uma foto antes de enviar o formulário.';
    return;
  }

  mensagemErroFoto.innerHTML = '';

  const tipoPessoa = formularioIdeia.querySelector('input[name="personType"]:checked');
  const orcamento = formularioIdeia.querySelector('input[name="budget"]:checked');

  const dadosIdeia = {
    tipoPessoa: tipoPessoa.value,
    documento: evento.target.elements['documentNumber'].value,
    nomeOuRazaoSocial: evento.target.elements['name'].value,
    email: evento.target.elements['email'].value,
    tipoProjeto: evento.target.elements['projectType'].value,
    prazoDesejado: evento.target.elements['deadline'].value,
    orcamento: orcamento.value,
    descricao: evento.target.elements['description'].value,
    aceitouTermos: evento.target.elements['terms'].checked,
    imagem: imagemUrl
  };

  localStorage.setItem('ideia', JSON.stringify(dadosIdeia));

  formularioIdeia.innerHTML = `
    <div class="md:col-span-2 rounded-2xl border border-green-300 bg-green-50 p-6 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
      <h4 class="text-lg font-semibold">Ideia enviada com sucesso!</h4>
      <p class="mt-2">Obrigado pelo envio. Suas informações foram recebidas e em breve entraremos em contato para entender melhor a sua ideia.</p>
    </div>
  `;
});