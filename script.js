async function carregarDadosDaPlanilha() {
    try {
        const resposta = await fetch(urlPlanilha);
        const csvText = await resposta.text();
        
        // Divide as linhas, mas remove as aspas que o Google Sheets coloca automaticamente
        const linhas = csvText.split('\n').map(l => l.replace(/"/g, ''));
        
        const dados = linhas.slice(1).map(linha => {
            const colunas = linha.split(',');
            if (colunas.length < 2) return null; // Ignora linhas vazias

            return {
                id: colunas[0],
                nome: colunas[1],
                preco: parseFloat(colunas[2]),
                descricao: colunas[3] || "",
                categoria: colunas[4],
                // Agora ele vai limpar os espaços e quebras de linha dos sabores
                sabores: colunas[5] ? colunas[5].split(';').map(s => s.trim()) : [],
                disponivel: colunas[6]?.trim().toLowerCase() === 'sim'
            };
        }).filter(item => item !== null);

        const produtosAtivos = dados.filter(p => p.disponivel);
        renderizarCatalogo(produtosAtivos);

    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        // Opcional: mostrar uma mensagem de erro na tela para o usuário
    }
}