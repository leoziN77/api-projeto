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

// Função para obter os mapas com agentes aleatórios
async function obterMapasEAgentesAleatorios() {
    try {
        const respostaMapas = await axios.get(urlApiMapas);
        const mapas = respostaMapas.data.data;

        // Nomes de exibição dos mapas a serem excluídos
        const mapasExcluidos = ["Piazza", "District", "The Range", "Kasbah"];

        const mapasComAgentes = await Promise.all(mapas.map(async mapa => {
            try {
                const nomeExibicaoMapa = mapa.displayName;

                // Verifica se o nome de exibição do mapa está na lista de mapas excluídos
                if (mapasExcluidos.includes(nomeExibicaoMapa)) {
                    return null; // Ignora este mapa
                }

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

                const agentesAleatorios = await obterAgentesAleatorios();

                return `${nomeExibicaoMapa}: ${agentesAleatorios.join(', ')}`;
            } catch (error) {
                return `Erro ao buscar informações para o mapa ${nomeExibicaoMapa}`;
            }
        }));

        // Filtra e remove mapas nulos (excluídos)
        const mapasFiltrados = mapasComAgentes.filter(mapa => mapa !== null);

        return mapasFiltrados;
    } catch (error) {
        throw new Error('Erro ao buscar mapas da API.');
    }
}

app.get('/api/mapas', async (req, res) => {
    try {
        const mapasComAgentes = await obterMapasEAgentesAleatorios();

        res.json({
            mapas: mapasComAgentes
        });
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro ao buscar dados da API.' });
    }
});
