# api-projeto
Projeto backend criado para integrar API's e retornar os resultados em NODE.JS

Pontos a serem considerados: 

Este é um projeto em JavaScript que permite aos jogadores do jogo Valorant selecionar agentes de maneira aleatória.

## Funcionalidades

- **Seleção Aleatória de Agentes**: Escolha aleatória de até 5 agentes entre os disponíveis no jogo.

- **Exibição de Agentes Selecionados**: Após a seleção, o programa exibirá na tela informações sobre os agentes escolhidos, incluindo seus nomes.

## Instruções de Uso

Para executar o servidor, siga estas etapas:

1. Certifique-se de ter o Node.js instalado em sua máquina. Você pode baixá-lo em [nodejs.org](https://nodejs.org/).

2. Clone este repositório para o seu computador:

   ```shell
   git clone https://github.com/seu-usuario/seu-repositorio.git

4. Navegue até a pasta do projeto:
- **cd nome-da-pasta-do-projeto**

5. Instale as dependências do projeto:
- **npm install**

6. Inicie o servidor:
- **npm start**

## Rotas da API

O servidor fornece uma única rota:
- **GET /api/mapas**: Retorna uma lista de mapas com agentes aleatórios do Valorant. Os mapas são obtidos da API oficial do Valorant, e alguns mapas específicos são excluídos da lista.

## Configurações
- **Porta do servidor**: A porta padrão do servidor é 3000. Você pode alterá-la no arquivo server.js se desejar.


