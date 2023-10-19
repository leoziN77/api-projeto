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


app.get('/mapas', async (req, res) => {
    try {
      const respostaMapas = await axios.get(urlApiMapas);
      const mapas = respostaMapas.data.data;
  
      const mapasFormatados = mapas.map(mapa => ({
        label: mapa.displayName,
        value: mapa.displayName
      }));
  
      res.json(mapasFormatados);
    } catch (error) {
      res.status(500).json({ erro: 'Ocorreu um erro ao buscar mapas da API.' });
    }
  });

app.get('/comps', async (req, res) => { 
    try {
        const modo = req.query.modo; 
        const mapaEspecificado = req.query.mapa; 

        if (!modo) {
            res.status(400).json({ erro: 'Você deve especificar um modo na URL (todos ou especifico).' });
            return;
        }

        if (modo === 'todos') { // http://localhost:3000/comps?modo=todos
            const mapsWithAgents = await getMapsAndAgents();

            if (mapsWithAgents) {
                res.json({
                    mapas: mapsWithAgents
                });
            } else {
                res.status(500).json({ erro: 'Ocorreu um erro ao buscar dados da API de mapas.' });
            }
        } else if (modo === 'especifico' && mapaEspecificado) { // http://localhost:3000/api/mapas?modo=especifico&mapa=bind
            const respostaMapas = await axios.get(urlApiMapas);
            const mapas = respostaMapas.data.data;

            // Converte o valor do parâmetro "mapa" para maiúsculas
            const mapaEspecificadoEmMaiusculas = mapaEspecificado.toUpperCase();

            const mapa = mapas.find(map => map.displayName.toUpperCase() === mapaEspecificadoEmMaiusculas);

            if (!mapa) {
                res.status(404).json({ erro: 'Mapa não encontrado.' });
                return;
            }

            const agentesAleatorios = await obterAgentesAleatorios();

            const map = `${mapa.displayName}`;
            const agentes = `${agentesAleatorios.join(', ')}`;

            res.json({
                mapas: [map],
                agente: [agentes]
            });
        } else {
            res.status(400).json({ erro: 'Modo inválido ou parâmetros ausentes.' });
        }
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro ao processar a solicitação.' });
    }
});


// Função para obter os mapas com agentes aleatórios
async function getMapsAndAgents() {
    try {
        const mapsResponse = await axios.get(urlApiMapas);
        const maps = mapsResponse.data.data;

        // Mapas excluídos
        const excludedMaps = ["Piazza", "District", "The Range", "Kasbah"];

        const mapsWithAgents = await Promise.all(maps.map(async map => {
            try {
                const mapDisplayName = map.displayName;

                if (excludedMaps.includes(mapDisplayName)) {
                    return null;
                }

                const randomAgents = await obterAgentesAleatorios();

                return `${mapDisplayName}: ${randomAgents.join(', ')}`;
            } catch (error) {
                return `Erro ao buscar informações para o mapa ${mapDisplayName}`;
            }
        }));

        const filteredMaps = mapsWithAgents.filter(map => map !== null);

        return filteredMaps;
    } catch (error) {
        throw new Error('Erro ao buscar mapas da API.');
    }
}
