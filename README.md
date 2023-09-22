# api-projeto
Projeto backend criado para integrar API's e retornar os resultados em NODE.JS

Pontos a serem considerados: 

1- Importação de Módulos: O código começa importando os módulos necessários, como fs para lidar com o sistema de arquivos, axios para fazer solicitações HTTP, e readline para interagir com o usuário por meio do terminal.

2- Definição de URLs e Nomes de Arquivos: São definidas as URLs das APIs de mapas e agentes, bem como os nomes dos arquivos onde os dados serão salvos localmente.

3- Funções para Carregar Dados dos Arquivos: loadMapsDataFromFile e loadAgentsDataFromFile são funções para carregar os dados dos mapas e agentes a partir dos arquivos locais. Elas tentam ler os dados dos arquivos e, se bem-sucedidas, retornam os dados em formato JSON. Em caso de erro, elas informam o erro.

4- Mapeamento de Mapas para Agentes Recomendados: É definido um objeto chamado mapAgentRecommendations que mapeia os nomes dos mapas aos nomes dos agentes recomendados para cada mapa. Você deve preencher este objeto com os nomes reais dos agentes que deseja associar a cada mapa.

5- Função para Selecionar Agentes com Base no Mapa: selectAgentsForMap é uma função que recebe o nome de um mapa e os dados dos agentes. Ela consulta o mapeamento mapAgentRecommendations para obter os agentes recomendados para o mapa especificado e retorna uma lista de agentes correspondentes.

6- Interface de Linha de Comando (CLI): Uma interface de linha de comando (CLI) é criada usando o módulo readline. Isso permite que o usuário insira o nome de um mapa.

7- Função Principal main: A função principal main é definida como uma função assíncrona. 

Dentro desta função:
Ela começa carregando os dados dos mapas e agentes a partir dos arquivos locais, ou, se não estiverem disponíveis, faz solicitações para buscar esses dados nas APIs e salvá-los localmente.
Em seguida, solicita ao usuário que insira o nome de um mapa.
Quando o usuário fornece um nome de mapa, a função procura o mapa correspondente nos dados dos mapas.
Se o mapa for encontrado, ela chama a função selectAgentsForMap para obter os agentes recomendados para esse mapa e exibe os resultados no console.
Finalmente, a função encerra a interface de linha de comando (rl.close()).

8- Execução da Função Principal: A função principal main é executada no final do código, iniciando o processo de interação com o usuário.

No geral, este código permite que o usuário insira o nome de um mapa do jogo Valorant, consulta um mapeamento predefinido para obter agentes recomendados para esse mapa e exibe esses agentes no console. Certifique-se de ajustar o mapeamento mapAgentRecommendations de acordo com suas preferências para os agentes recomendados para cada mapa.
