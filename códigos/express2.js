// Não esquecer de alterar o package json, pois está startando o servidor do primeiro script

const express = require("express");
const axios = require("axios");
const app = express();
const porta = 3000;

app.use(express.json());

app.listen(porta, () => {
    console.log(`Iniciando servidor na porta: ${porta}`);
});

const urlApiMapas = 'https://valorant-api.com/v1/maps';
const urlApiAgentes = 'https://valorant-api.com/v1/agents';

// Função para obter agentes aleatórios
async function obterAgentesAleatorios() {
    try {
        const respostaAgentes = await axios.get(urlApiAgentes);
        const agentes = respostaAgentes.data.data;
        const agentesEmbaralhados = agentes.sort(() => Math.random() - 0.5);
        return agentesEmbaralhados.slice(0, 5).map(agente => agente.displayName);
    } catch (error) {
        throw new Error('Erro ao buscar agentes da API.');
    }
}

app.get('/api/mapas', async (req, res) => {
    try {
        const mapaEspecificado = req.query.mapa; // Obtém o valor do parâmetro "mapa" da URL

        // Verifica se o parâmetro "mapa" foi especificado
        if (!mapaEspecificado) {
            res.status(400).json({ erro: 'Você deve especificar um nome de mapa na URL.' });
            return;
        }

        const respostaMapas = await axios.get(urlApiMapas);
        const mapas = respostaMapas.data.data;

        // Converte o valor do parâmetro "mapa" para maiúsculas
        const mapaEspecificadoEmMaiusculas = mapaEspecificado.toUpperCase();

        // Verifica se o mapa especificado existe na lista de mapas (comparação insensível a maiúsculas/minúsculas)
        const mapa = mapas.find(map => map.displayName.toUpperCase() === mapaEspecificadoEmMaiusculas);

        if (!mapa) {
            res.status(404).json({ erro: 'Mapa não encontrado.' });
            return;
        }

        const agentesAleatorios = await obterAgentesAleatorios();

        const composicao = `${mapa.displayName}: ${agentesAleatorios.join(', ')}`;

        res.json({
            mapas: [composicao]
        });
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro ao buscar dados da API.' });
    }
});





