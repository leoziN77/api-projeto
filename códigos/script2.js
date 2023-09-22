const fs = require('fs');
const axios = require('axios');
const readline = require('readline');

// URL da API de maps
const mapsApiUrl = 'https://valorant-api.com/v1/maps';
// URL da API de agentes
const agentsApiUrl = 'https://valorant-api.com/v1/agents';

// Nome do arquivo onde os dados dos maps serão salvos localmente
const mapsDataFileName = 'valorant-maps.json';
// Nome do arquivo onde os dados dos agentes serão salvos localmente
const agentsDataFileName = 'valorant-agents.json';

// Função para carregar os dados dos maps a partir do arquivo local
function loadMapsDataFromFile() {
  try {
    const data = fs.readFileSync(mapsDataFileName, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Ocorreu um erro ao carregar os dados dos maps do arquivo:', error.message);
    return null;
  }
}

// Função para carregar os dados dos agentes a partir do arquivo local
function loadAgentsDataFromFile() {
  try {
    const data = fs.readFileSync(agentsDataFileName, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Ocorreu um erro ao carregar os dados dos agentes do arquivo:', error.message);
    return null;
  }
}

// Função para selecionar aleatoriamente 5 agentes sem repetições
function selectRandomAgents(agentsData, count = 5) {
  const selectedAgents = [];
  const totalAgents = agentsData.data.length;

  while (selectedAgents.length < count) {
    const randomIndex = Math.floor(Math.random() * totalAgents);
    const randomAgent = agentsData.data[randomIndex];
    if (!selectedAgents.some(agent => agent.displayName === randomAgent.displayName)) {
      selectedAgents.push(randomAgent);
    }
  }

  return selectedAgents;
}

// Interface para leitura de entrada do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função principal
async function main() {
  // Carregar os dados dos maps (ou buscar da API se não estiverem disponíveis localmente)
  let mapsData = loadMapsDataFromFile();
  if (!mapsData) {
    await fetchAndSaveMapsData();
    mapsData = loadMapsDataFromFile();
  }

  // Carregar os dados dos agentes (ou buscar da API se não estiverem disponíveis localmente)
  let agentsData = loadAgentsDataFromFile();
  if (!agentsData) {
    await fetchAndSaveAgentsData();
    agentsData = loadAgentsDataFromFile();
  }

  // Obter entrada do usuário para selecionar um mapa
  rl.question('Digite o nome de um mapa (por exemplo, "Ascent"): ', mapName => {
    const map = mapsData.data.find(map => map.displayName.toLowerCase() === mapName.toLowerCase());

    if (!map) {
      console.error('Mapa não encontrado.');
      rl.close();
    } else {
      console.log('Nome do Mapa:', map.displayName);
      console.log();

      // Selecionar aleatoriamente 5 agentes
      const randomAgents = selectRandomAgents(agentsData);

      // Exibir informações dos agentes selecionados
      console.log('Agentes Selecionados:');
      console.log();
      randomAgents.forEach(agent => {
        console.log('Nome do Agente:', agent.displayName);
        console.log();
      });

      rl.close();
    }
  });
}

// Executar a função principal
main();
