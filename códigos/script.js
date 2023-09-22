const fs = require('fs');
const axios = require('axios');
const readline = require('readline');

const mapsApiUrl = 'https://valorant-api.com/v1/maps';
const agentsApiUrl = 'https://valorant-api.com/v1/agents';

// Arquivo onde os nomes serão salvos localmente
const mapsDataFileName = 'valorant-maps.json';
const agentsDataFileName = 'valorant-agents.json';

const mapAgentRecommendations = {
  Ascent: ['Jett', 'Phoenix', 'Sova', 'Cypher', 'Brimstone'],
  Ascent: ['Raze', 'Reyna', 'Fade', 'Chamber', 'Brimstone'],
  Bind: ['Sage', 'Breach', 'Viper', 'Killjoy', 'Omen'],
};

// Busca local pelos arquivos 
function loadMapsDataFromFile() {
  try {
    const data = fs.readFileSync(mapsDataFileName, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Ocorreu um erro ao carregar os dados dos maps do arquivo:', error.message);
    return null;
  }
}

function loadAgentsDataFromFile() {
  try {
    const data = fs.readFileSync(agentsDataFileName, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Ocorreu um erro ao carregar os dados dos agentes do arquivo:', error.message);
    return null;
  }
}

// Função para selecionar os agentes com base no mapa
function selectAgentsForMap(mapName, agentsData) {
  const recommendedAgents = mapAgentRecommendations[mapName] || [];
  const selectedAgents = [];

  for (const agentName of recommendedAgents) {
    const agent = agentsData.data.find(agent => agent.displayName === agentName);
    if (agent) {
      selectedAgents.push(agent);
    }
  }

  return selectedAgents;
}

// Input feito pelo usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  // Carregar os dados (ou buscar da API se não estiverem disponíveis localmente)
  let mapsData = loadMapsDataFromFile();
  if (!mapsData) {
    await fetchAndSaveMapsData();
    mapsData = loadMapsDataFromFile();
  }

  let agentsData = loadAgentsDataFromFile();
  if (!agentsData) {
    await fetchAndSaveAgentsData();
    agentsData = loadAgentsDataFromFile();
  }

  // Input do usuário para selecionar um mapa
  rl.question('Digite o nome de um mapa (por exemplo, "Ascent"): ', mapName => {
    const map = mapsData.data.find(map => map.displayName.toLowerCase() === mapName.toLowerCase());

    if (!map) {
      console.error('Mapa não encontrado.');
      rl.close();
    } else {
      console.log('Nome do Mapa:', map.displayName);
      console.log();

      // Seleção dos agentes, com base no mapa
      const recommendedAgents = selectAgentsForMap(mapName, agentsData);

      if (recommendedAgents.length === 0) {
        console.log('Nenhum agente recomendado para este mapa.');
      } else {
        console.log('Agentes Recomendados para este Mapa:');
        console.log();
        recommendedAgents.forEach(agent => {
          console.log('Nome do Agente:', agent.displayName);
          console.log();
        });
      }

      rl.close();
    }
  });
}

main();
