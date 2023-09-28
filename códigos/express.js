const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
    console.log(`Iniciando servidor na porta: ${port}`);
});

const mapsApi = 'https://valorant-api.com/v1/maps';
const agentsApi = 'https://valorant-api.com/v1/agents';

// Função para obter os mapas com agentes aleatórios
async function getMapsAndAgents() {
    try {
        const mapsResponse = await axios.get(mapsApi);
        const maps = mapsResponse.data.data;

        // Nomes de exibição dos mapas a serem excluídos
        const excludedMaps = ["Piazza", "District", "The Range", "Kasbah"];

        const mapsWithAgents = await Promise.all(maps.map(async map => {
            try {
                const mapDisplayName = map.displayName;

                // Verifica se o nome de exibição do mapa está na lista de mapas excluídos
                if (excludedMaps.includes(mapDisplayName)) {
                    return null; // Ignora este mapa
                }

                // Função para obter agentes aleatórios
                async function getRandomAgents() {
                    try {
                        const agentResponse = await axios.get(agentsApi);
                        const agents = agentResponse.data.data;
                        const shuffledAgents = agents.sort(() => Math.random() - 0.5);
                        return shuffledAgents.slice(0, 5).map(agent => agent.displayName);
                    } catch (error) {
                        throw new Error('Erro ao buscar agentes da API.');
                    }
                }

                const randomAgents = await getRandomAgents();

                return `${mapDisplayName}: ${randomAgents.join(', ')}`;
            } catch (error) {
                return `Erro ao buscar informações para o mapa ${mapDisplayName}`;
            }
        }));

        // Filtra e remove mapas nulos (excluídos)
        const filteredMaps = mapsWithAgents.filter(map => map !== null);

        return filteredMaps;
    } catch (error) {
        throw new Error('Erro ao buscar mapas da API.');
    }
}

app.get('/api/mapas', async (req, res) => {
    try {
        const mapsWithAgents = await getMapsAndAgents();

        res.json({
            mapas: mapsWithAgents
        });
    } catch (error) {
        res.status(500).json({ error: 'Ocorreu um erro ao buscar dados da API.' });
    }
});
