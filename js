script.js
const tabela = document.getElementById('tabela').getElementsByTagName('tbody')[0];
const investimentoInput = document.getElementById('investimento');
const lucroSpan = document.getElementById('lucro');
const retornoTotalSpan = document.getElementById('retornoTotal');
const btnAdd = document.getElementById('btnAdd');
const btnReset = document.getElementById('btnReset');

function criarLinha(oddValue = 2.0) {
  const row = tabela.insertRow();
  const indexCell = row.insertCell(0);
  const oddCell = row.insertCell(1);
  const investimentoCell = row.insertCell(2);
  const retornoCell = row.insertCell(3);
  const actionCell = row.insertCell(4);

  indexCell.innerText = tabela.rows.length;

  const oddInput = document.createElement('input');
  oddInput.type = 'number';
  oddInput.value = oddValue;
  oddInput.min = 1.01;
  oddInput.addEventListener('input', atualizar);
  oddCell.appendChild(oddInput);

  investimentoCell.innerText = '0.00';
  retornoCell.innerText = '0.00';

  const removeBtn = document.createElement('button');
  removeBtn.innerText = '❌';
  removeBtn.className = 'btn-remove';
  removeBtn.addEventListener('click', () => {
    row.remove();
    atualizarIndices();
    atualizar();
  });
  actionCell.appendChild(removeBtn);

  atualizar();
}

function atualizarIndices() {
  Array.from(tabela.rows).forEach((row, i) => {
    row.cells[0].innerText = i + 1;
  });
}

function atualizar() {
  const totalInvestimento = parseFloat(investimentoInput.value) || 0;
  const odds = Array.from(tabela.rows).map(row => parseFloat(row.cells[1].firstChild.value) || 0);
  const validOdds = odds.filter(o => o > 1);

  if (validOdds.length === 0) return;

  const denom = validOdds.reduce((sum, o) => sum + (1 / o), 0);
  const apostas = validOdds.map(o => (totalInvestimento / o) / denom);
  const retorno = apostas.map((a, i) => a * validOdds[i]);
  const lucro = retorno[0] - totalInvestimento;

  let apostaIndex = 0;
  Array.from(tabela.rows).forEach(row => {
    const odd = parseFloat(row.cells[1].firstChild.value);
    if (odd > 1) {
      row.cells[2].innerText = apostas[apostaIndex].toFixed(2);
      row.cells[3].innerText = retorno[apostaIndex].toFixed(2);
      apostaIndex++;
    } else {
      row.cells[2].innerText = '0.00';
      row.cells[3].innerText = '0.00';
    }
  });

  lucroSpan.innerText = lucro.toFixed(2);
  retornoTotalSpan.innerText = (totalInvestimento + lucro).toFixed(2);
}

btnAdd.addEventListener('click', () => criarLinha());
btnReset.addEventListener('click', () => {
  tabela.innerHTML = '';
  investimentoInput.value = 100;
  criarLinha(2.2);
  criarLinha(7);
  criarLinha(3.43);
});

investimentoInput.addEventListener('input', atualizar);

// Inicializa com algumas linhas
btnReset.click();
