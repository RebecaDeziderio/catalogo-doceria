// 1. O LINK VEM AQUI (Sempre no topo)
const urlPlanilha = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5bycypBZ4P2-r6FQ3HNnOPqHUfUq-CbDYIt2BCuG7uu-r5hVo6pGtWh6dUipdGqR_36nRXBmkYH4G/pub?output=csv";

// 2. PROTEÇÃO PARA CARREGAR O HTML
document.addEventListener('DOMContentLoaded', () => {
    carregarDadosDaPlanilha();
});

// 3. FUNÇÃO PARA LER A PLANILHA
async function carregarDadosDaPlanilha() {
    try {
        const resposta = await fetch(urlPlanilha);
        const csvText = await resposta.text();
        
        // Limpa aspas e divide as linhas
        const linhas = csvText.split('\n').map(l => l.replace(/"/g, '').trim());
        
        const dados = linhas.slice(1).map(linha => {
            const colunas = linha.split(',');
            if (colunas.length < 2) return null; 

            return {
                id: colunas[0],
                nome: colunas[1],
                preco: parseFloat(colunas[2]) || 0,
                descricao: colunas[3] || "",
                categoria: colunas[4],
                sabores: colunas[5] ? colunas[5].split(';').map(s => s.trim()) : [],
                disponivel: colunas[6]?.trim().toLowerCase() === 'sim'
            };
        }).filter(item => item !== null);

        // Filtra e Renderiza
        const produtosAtivos = dados.filter(p => p.disponivel);
        renderizarCatalogo(produtosAtivos);

    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
    }
}

// 4. FUNÇÃO PARA DESENHAR NA TELA
function renderizarCatalogo(produtos) {
    const container = document.getElementById('catalogo-container');
    if (!container) return;

    container.innerHTML = ""; 

    produtos.forEach(doce => {
        const card = `
            <div class="card-doce">
                <h3>${doce.nome}</h3>
                <p class="categoria"><strong>${doce.categoria}</strong></p>
                <p>${doce.descricao || "Delícia artesanal feita com carinho."}</p>
                <p class="preco">R$ ${doce.preco.toFixed(2).replace('.', ',')}</p>
                
                <div class="sabores">
                    <strong>Sabores:</strong> ${doce.sabores.join(", ")}
                </div>
                
                <button class="btn-pedido" onclick="window.open('https://wa.me/11992825255?text=Olá! Gostaria de pedir: ${doce.nome}', '_blank')">
                    Pedir no WhatsApp
                </button>
            </div>
        `;
        container.innerHTML += card;
    });
}
