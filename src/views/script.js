// Função para criar uma nova despesa
async function criarDespesa(descricao, valor, data) {
    const response = await fetch('/api/despesas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ descricao, valor: valor.toFixed(2), data }), // Formatar para 2 casas decimais
    });

    if (!response.ok) {
        alert('Erro ao criar despesa');
        return null;
    }

    const novaDespesa = await response.json();
    return novaDespesa;
}

// Função para obter todas as despesas
async function obterDespesas() {
    const response = await fetch('/api/despesas');
    if (!response.ok) {
        alert('Erro ao obter despesas');
        return [];
    }

    const despesas = await response.json();
    return despesas;
}

// Função para atualizar uma despesa
async function atualizarDespesa(id, descricao, valor, data) {
    const response = await fetch(`/api/despesas/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ descricao, valor: valor.toFixed(2), data }), // Formatar para 2 casas decimais
    });

    if (!response.ok) {
        alert('Erro ao atualizar despesa');
        return null;
    }

    const despesaAtualizada = await response.json();
    alert('Despesa atualizada com sucesso!');
    carregarDespesas();  // Recarregar a lista de despesas
    return despesaAtualizada;
}

// Função para excluir uma despesa
async function excluirDespesa(id) {
    const response = await fetch(`/api/despesas/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        alert('Erro ao excluir despesa');
        return;
    }

    alert('Despesa excluída com sucesso!');
    carregarDespesas(); // Recarregar a lista de despesas
}

// Função para carregar todas as despesas e exibi-las na página
async function carregarDespesas() {
    const despesas = await obterDespesas();
    const despesasList = document.getElementById('despesasList');
    const totalDespesas = document.getElementById('totalDespesas');

    // Limpar a lista de despesas antes de exibir novamente
    despesasList.innerHTML = '';
    let total = 0;

    despesas.forEach(despesa => {
        total += despesa.valor;
        const despesaElement = document.createElement('div');
        despesaElement.classList.add('despesaItem');
        despesaElement.innerHTML = `
            <p><strong>Descrição:</strong> ${despesa.descricao}</p>
            <p><strong>Valor:</strong> R$ ${despesa.valor.toFixed(2)}</p>
            <p><strong>Data:</strong> ${new Date(despesa.data).toLocaleDateString()}</p>
            <button onclick="excluirDespesa('${despesa._id}')">Excluir</button>
            <button onclick="mostrarModalEditar('${despesa._id}', '${despesa.descricao}', ${despesa.valor}, '${despesa.data}')">Editar</button>
        `;
        despesasList.appendChild(despesaElement);
    });

    totalDespesas.innerText = `Total de Despesas: R$ ${total.toFixed(2)}`;
}

// Função para mostrar o modal de edição
function mostrarModalEditar(id, descricao, valor, data) {
    const modal = document.getElementById('modalEditar');
    const descricaoInput = document.getElementById('descricaoEditar');
    const valorInput = document.getElementById('valorEditar');
    const dataInput = document.getElementById('dataEditar');

    descricaoInput.value = descricao;

    // Garantir que o valor seja inserido corretamente (com ponto para decimais)
    valorInput.value = valor.toFixed(2); // Forçar duas casas decimais

    // Ajuste para garantir que a data seja no formato correto (yyyy-mm-dd)
    const dataFormatada = new Date(data);
    const ano = dataFormatada.getFullYear();
    const mes = String(dataFormatada.getMonth() + 1).padStart(2, '0');
    const dia = String(dataFormatada.getDate()).padStart(2, '0');
    dataInput.value = `${ano}-${mes}-${dia}`; // Formatar data no formato adequado

    modal.style.display = 'block';

    const formEditarDespesa = document.getElementById('formEditarDespesa');
    formEditarDespesa.onsubmit = async (e) => {
        e.preventDefault();
        const descricao = descricaoInput.value;
        const valor = parseFloat(valorInput.value);  // Garantir que o valor é um número
        const data = dataInput.value; // A data não pode ser alterada

        if (isNaN(valor) || valor <= 0) {
            alert('Por favor, insira um valor válido.');
            return;
        }

        await atualizarDespesa(id, descricao, valor, data);
        modal.style.display = 'none'; // Fechar o modal após salvar
    };
}

// Fechar o modal de edição
document.getElementById('closeModal').onclick = () => {
    document.getElementById('modalEditar').style.display = 'none';
};

// Preencher a lista de despesas ao carregar a página
window.onload = () => {
    carregarDespesas();
};

// Lidar com o envio do formulário de criação de despesa
document.getElementById('formDespesa').onsubmit = async (e) => {
    e.preventDefault();

    const descricao = document.getElementById('descricao').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const data = document.getElementById('data').value;

    if (isNaN(valor) || valor <= 0) {
        alert('Por favor, insira um valor válido.');
        return;
    }

    await criarDespesa(descricao, valor, data);
    carregarDespesas(); // Recarregar a lista de despesas
    e.target.reset(); // Limpar o formulário
};
