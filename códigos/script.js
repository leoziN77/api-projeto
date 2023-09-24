const fs = require('fs');
const axios = require('axios');
const readline = require('readline');

const mapsApiUrl = 'https://valorant-api.com/v1/maps';
const agentsApiUrl = 'https://valorant-api.com/v1/agents';

const mapsDataFileName = 'valorant-maps.json';
const agentsDataFileName = 'valorant-agents.json';

const mapAgentRecommendations = {
  Ascent: [
    ['Jett', 'Phoenix', 'Sova', 'Cypher', 'Brimstone'],
    ['Sage', 'Breach', 'Viper', 'Killjoy', 'Omen'],
  ],
};

const availableMaps = [
  'Ascent',
  'Split',
  'Fracture',
  'Bind',
  'Breeze',
  'Lotus',
  'Sunset',
  'Pearl',
  'Icebox',
  'Haven'
];

// Funções de carregamento de dados
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

function displaySelectedAgents(agents) {
  console.log('\nAgentes Selecionados:');
  console.log();
  agents.forEach(agent => {
    console.log(agent.displayName);
    console.log();
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function fetchAndSaveMapsData() {
  try {
    const response = await axios.get(mapsApiUrl);
    fs.writeFileSync(mapsDataFileName, JSON.stringify(response.data, null, 2));
    console.log('Dados dos mapas salvos localmente.');
  } catch (error) {
    console.error('Ocorreu um erro ao buscar os dados dos mapas:', error.message);
  }
}

async function fetchAndSaveAgentsData() {
  try {
    const response = await axios.get(agentsApiUrl);
    fs.writeFileSync(agentsDataFileName, JSON.stringify(response.data, null, 2));
    console.log('Dados dos agentes salvos localmente.');
  } catch (error) {
    console.error('Ocorreu um erro ao buscar os dados dos agentes:', error.message);
  }
}

async function main() {
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

  console.log();
  console.log('Selecione como deseja escolher os agentes:');
  console.log('1. Seleção aleatória de agentes');
  console.log('2. Seleção de agentes recomendados para o mapa');
  console.log();

  rl.question('Digite o número da opção desejada: ', choice => {
    if (choice === '1') {
      console.log();
      availableMaps.forEach((map, index) => {
        console.log(`${index + 1}. ${map}`);
      });
      console.log();

      rl.question('Digite o número do mapa desejado: ', mapIndex => {
        mapIndex = parseInt(mapIndex) - 1;

        if (mapIndex >= 0 && mapIndex < availableMaps.length) {
          const selectedMap = availableMaps[mapIndex];
          console.log(`Mapa selecionado: ${selectedMap}`);
          const randomAgents = selectRandomAgents(agentsData);
          displaySelectedAgents(randomAgents);
          rl.close();
        } else {
          console.error('Opção de mapa inválida.');
          rl.close();
        }
      });
    } else if (choice === '2') {
      console.log();
      availableMaps.forEach((map, index) => {
        console.log(`${index + 1}. ${map}`);
      });
      console.log();

      rl.question('Digite o número do mapa desejado: ', mapIndex => {
        mapIndex = parseInt(mapIndex) - 1;

        if (mapIndex >= 0 && mapIndex < availableMaps.length) {
          const selectedMap = availableMaps[mapIndex];
          console.log(`Mapa selecionado: ${selectedMap}`);
          console.log('\nComposição recomendada para o mapa:');
          const recommendedCompositions = mapAgentRecommendations[selectedMap] || [];
          if (recommendedCompositions.length > 0) {
            const randomIndex = Math.floor(Math.random() * recommendedCompositions.length);
            const randomComposition = recommendedCompositions[randomIndex];
            console.log(randomComposition.join(', '));
          } else {
            console.log('Nenhuma composição recomendada encontrada para este mapa.');
          }
          rl.close();
        } else {
          console.error('Opção de mapa inválida.');
          rl.close();
        }
      });
    } else {
      console.error('Opção inválida.');
      rl.close();
    }
  });
}

main();
