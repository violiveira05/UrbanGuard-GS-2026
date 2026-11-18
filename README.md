
# 🛡️ UrbanGuard
### Plataforma Inteligente de Monitoramento e Prevenção de Riscos Urbanos

**FIAP | Global Solution 2026.2**  
**Disciplina:** Advanced Programming and Mobile Development  
**Tema:** CitizenTech - Tecnologia para Cidades Mais Seguras

---

## 📌 1. Sobre o Projeto

O UrbanGuard é uma solução tecnológica desenvolvida para auxiliar na identificação, no registro e no acompanhamento de riscos urbanos.

A plataforma integra um backend desenvolvido em Java com Spring Boot e um aplicativo mobile construído em React Native com Expo.

O sistema permite que ocorrências sejam registradas pela comunidade, armazenadas em banco de dados e classificadas automaticamente de acordo com seu nível de prioridade.

A proposta é facilitar o acesso a informações sobre situações de risco e apoiar a identificação de ocorrências que merecem maior atenção.

O UrbanGuard foi desenvolvido como um protótipo acadêmico para a Global Solution 2026.2 da FIAP.

---

## 🎯 2. Objetivos

### Objetivo geral

Desenvolver uma plataforma integrada de monitoramento de riscos urbanos, utilizando serviços REST, persistência de dados, aplicativo mobile e classificação automatizada de ocorrências.

### Objetivos específicos

- Permitir o cadastro de ocorrências urbanas.
- Armazenar informações em banco de dados.
- Disponibilizar uma API REST para consulta e gerenciamento.
- Exibir as ocorrências em um aplicativo mobile.
- Classificar automaticamente a prioridade dos riscos.
- Destacar eventos críticos.
- Emitir notificações de alerta.
- Monitorar a disponibilidade do servidor.
- Recuperar automaticamente a comunicação após falhas de conexão.
- Implementar testes automatizados da lógica de negócio.

---

## ⚙️ 3. Tecnologias Utilizadas

### Backend

- Java 21
- Spring Boot 4
- Spring Web
- Spring Data JPA
- Hibernate
- H2 Database
- Maven
- JUnit 5
- Mockito
- Spring Boot Actuator

### Aplicativo Mobile

- React Native
- Expo
- TypeScript
- Expo Notifications
- Fetch API

### Desenvolvimento

- Visual Studio Code
- Git
- GitHub
- PowerShell
- Expo Go

---

## 🏗️ 4. Arquitetura da Solução

O UrbanGuard utiliza uma arquitetura cliente-servidor com separação de responsabilidades.

```text
         USUÁRIO
            |
            v
   APLICATIVO MOBILE
   React Native + Expo
            |
            | HTTP / JSON
            v
       API REST
       Spring Boot
            |
            v
       CONTROLLER
            |
            v
        SERVICE
   Regras de negócio
   Cálculo de prioridade
            |
            v
       REPOSITORY
       Spring Data JPA
            |
            v
       BANCO H2
   Persistência de dados
```

A comunicação entre o aplicativo e o backend ocorre por meio de requisições HTTP, utilizando JSON para transferência de dados.

### Camadas do backend

**Controller:** recebe as requisições HTTP e disponibiliza os endpoints da API.

**Service:** executa as regras de negócio, incluindo o cálculo e a classificação dos riscos.

**Repository:** realiza as operações de persistência e consulta no banco de dados.

**Model:** representa as entidades utilizadas pela aplicação.

Essa organização facilita a manutenção, os testes e a evolução do sistema.

---

## 📱 5. Funcionalidades do Aplicativo

### Dashboard

O aplicativo apresenta um painel com:

- Quantidade total de ocorrências.
- Quantidade de alertas críticos.
- Situação atual da conexão com o servidor.
- Horário da última atualização bem-sucedida.

### Cadastro de ocorrências

O usuário pode registrar uma ocorrência informando:

- Tipo de risco.
- Descrição do problema.
- Localização.
- Gravidade de 1 a 5.

Os relatos cadastrados pelo aplicativo recebem a origem `COMUNIDADE` e um índice inicial de confiabilidade de `0.7`.

Esse índice é uma configuração demonstrativa do protótipo e não representa uma validação independente da informação.

### Consulta de ocorrências

O sistema apresenta uma lista de eventos urbanos com:

- Identificador da ocorrência.
- Tipo de risco.
- Descrição.
- Localização.
- Gravidade e prioridade calculada.
- Classificação do risco.
- Origem da informação.
- Confiabilidade.

### Atualização automática

O aplicativo consulta periodicamente a API, com intervalo aproximado de cinco segundos.

Novas ocorrências podem aparecer no dashboard sem necessidade de reiniciar a aplicação.

### Monitoramento da conexão

O UrbanGuard identifica falhas de comunicação com a API e apresenta um aviso quando o servidor fica indisponível.

Durante a indisponibilidade, as últimas ocorrências recebidas permanecem visíveis enquanto o aplicativo estiver em execução.

Quando o servidor volta a responder, o sistema recupera automaticamente a comunicação.

### Notificações

O projeto utiliza Expo Notifications para gerar alertas locais referentes a novas ocorrências classificadas como críticas.

O funcionamento das notificações depende das permissões concedidas pelo dispositivo e do ambiente de execução.

---

## 🧠 6. Classificação Inteligente de Riscos

O UrbanGuard utiliza um algoritmo determinístico de pontuação que combina a gravidade da ocorrência e a confiabilidade da informação.

A fórmula implementada no backend é:

**Prioridade = arredondar(100 × (0.8 × Gravidade Normalizada + 0.2 × Confiabilidade))**

Onde:

- Gravidade Normalizada = Gravidade / 5.
- Confiabilidade = valor entre 0 e 1.
- A gravidade possui peso de 80%.
- A confiabilidade possui peso de 20%.

O resultado é uma pontuação de prioridade de 0 a 100 para valores de entrada válidos.

### Faixas de classificação

| Pontuação | Classificação |
|-----------|---------------|
| 0 a 39 | BAIXO |
| 40 a 59 | MODERADO |
| 60 a 79 | ALTO |
| 80 a 100 | CRITICO |

### Exemplos

| Gravidade | Confiabilidade | Pontuação | Classificação |
|-----------|----------------|-----------|---------------|
| 1 | 0.50 | 26 | BAIXO |
| 2 | 0.70 | 46 | MODERADO |
| 4 | 0.70 | 78 | ALTO |
| 5 | 0.90 | 98 | CRITICO |

Esse mecanismo permite priorizar ocorrências de maneira consistente e transparente.

**Observação:** a implementação atual utiliza regras matemáticas explícitas, não um modelo de inteligência artificial treinado com dados reais.

---

## 🌐 7. API REST

A API disponibiliza endpoints para cadastrar, consultar, filtrar e excluir ocorrências.

URL base:

```text
http://localhost:8080
```

### Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/ocorrencias | Lista todas as ocorrências |
| GET | /api/ocorrencias/{id} | Consulta por identificador |
| GET | /api/ocorrencias/tipo/{tipo} | Filtra pelo tipo |
| GET | /api/ocorrencias/alertas | Lista por prioridade |
| GET | /api/ocorrencias/{id}/prioridade | Consulta prioridade |
| POST | /api/ocorrencias | Cadastra ocorrência |
| DELETE | /api/ocorrencias/{id} | Exclui ocorrência |
| GET | /actuator/health | Consulta a saúde do backend |

### Exemplo de cadastro

Requisição:

```http
POST /api/ocorrencias
Content-Type: application/json
```

Corpo JSON:

```json
{
  "tipo": "ALAGAMENTO",
  "descricao": "Rua alagada apos chuva intensa",
  "localizacao": "Santo Andre - SP",
  "gravidade": 4,
  "origem": "COMUNIDADE",
  "confiabilidade": 0.7
}
```

Após o cadastro, o registro fica disponível para consulta pela API e pelo aplicativo mobile.

---

## 🗄️ 8. Persistência de Dados

O projeto utiliza H2 Database integrado ao Spring Data JPA.

O banco principal é configurado para persistência em arquivo local.

As ocorrências permanecem armazenadas mesmo após o encerramento normal da aplicação.

### Informações armazenadas

- ID.
- Tipo da ocorrência.
- Descrição.
- Localização.
- Gravidade.
- Origem.
- Confiabilidade.
- Data e hora do registro.

Os arquivos locais do banco não são enviados ao GitHub.

Para execução dos testes automatizados, o projeto utiliza uma configuração independente com banco H2 em memória.

---

## 🧪 9. Testes e Validação

O UrbanGuard possui testes automatizados com JUnit e Mockito.

### Testes automatizados

Foram implementadas verificações para:

- Inicialização do contexto Spring Boot.
- Cálculo da prioridade crítica.
- Cálculo da prioridade alta.
- Cálculo da prioridade moderada.
- Cálculo da prioridade baixa.
- Pontuação máxima.
- Operação de salvamento na camada de serviço.

### Executar os testes

No terminal:

```powershell
cd backend
.\mvnw.cmd test
```

Em sistemas Linux e macOS, utilizar:

```bash
cd backend
./mvnw test
```

Os testes de serviço utilizam objetos simulados com Mockito, permitindo verificar a lógica sem depender do banco principal.

### Validações manuais

Também foram realizados testes funcionais envolvendo:

1. Inicialização do backend.
2. Consulta da API REST.
3. Cadastro de ocorrências.
4. Persistência dos registros no H2.
5. Consulta dos dados pelo aplicativo.
6. Atualização automática do dashboard.
7. Classificação dos eventos por prioridade.
8. Notificações de ocorrências críticas.
9. Interrupção do backend.
10. Exibição do estado desconectado.
11. Reinicialização do backend.
12. Reconexão automática do aplicativo.

Esses testes demonstram a integração entre as principais partes da solução.

---

## 🚀 10. Como Executar o Projeto

### Pré-requisitos

- Java JDK 21.
- Node.js e npm.
- Git.
- Expo Go instalado no celular.
- Computador e celular conectados à mesma rede local.

### 10.1. Clonar o repositório

```bash
git clone https://github.com/violiveira05/UrbanGuard-GS-2026.git
```

Entrar na pasta:

```bash
cd UrbanGuard-GS-2026
```

### 10.2. Executar o backend

No Windows:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

A API será iniciada na porta `8080`.

Para verificar o funcionamento no computador:

```text
http://localhost:8080/actuator/health
```

Para listar ocorrências:

```text
http://localhost:8080/api/ocorrencias
```

### 10.3. Configurar a conexão do aplicativo

Abra o arquivo:

```text
mobile/services/api.ts
```

Localize a constante:

```typescript
export const API_URL = 'http://192.168.15.81:8080';
```

Substitua o endereço IP pelo IP local do computador que está executando o backend.

Exemplo:

```typescript
export const API_URL = 'http://SEU_IP_LOCAL:8080';
```

No Windows, o endereço pode ser identificado pelo comando:

```powershell
ipconfig
```

O celular precisa conseguir acessar o backend pela rede local.

Caso a comunicação não funcione, verificar as configurações de rede e as permissões do firewall do Windows.

### 10.4. Executar o aplicativo mobile

Abra outro terminal e entre na pasta:

```bash
cd mobile
```

Instale as dependências:

```bash
npm install
```

Inicie o Expo:

```bash
npx expo start
```

Se necessário, utilize:

```bash
npx expo start --tunnel
```

Abra o Expo Go no celular e leia o QR Code exibido no terminal.

O aplicativo deverá carregar o dashboard do UrbanGuard e consultar os dados da API.

**Importante:** o túnel do Expo disponibiliza o aplicativo, mas não torna automaticamente a API Spring Boot acessível pela internet. O endereço configurado em `api.ts` ainda precisa ser alcançável pelo celular.

---

## 📂 11. Estrutura do Repositório

```text
UrbanGuard-GS-2026/
|
|-- backend/
|   |-- src/
|   |   |-- main/
|   |   |   |-- java/
|   |   |   |   `-- br/com/urbanguard/backend/
|   |   |   |       |-- controller/
|   |   |   |       |-- model/
|   |   |   |       |-- repository/
|   |   |   |       `-- service/
|   |   |   `-- resources/
|   |   |       `-- application.properties
|   |   `-- test/
|   |       |-- java/
|   |       `-- resources/
|   |-- pom.xml
|   `-- mvnw.cmd
|
|-- mobile/
|   |-- services/
|   |   |-- api.ts
|   |   `-- notificacoes.ts
|   |-- assets/
|   |-- App.tsx
|   |-- app.json
|   |-- package.json
|   `-- tsconfig.json
|
|-- .gitignore
`-- README.md
```

---

## 🔒 12. Segurança, Privacidade e Limitações

O UrbanGuard foi desenvolvido para fins acadêmicos e de demonstração.

### Cuidados adotados

- Separação entre camadas de apresentação, negócio e persistência.
- Comunicação estruturada por API REST.
- Validação de dados no cadastro.
- Banco de testes independente.
- Exclusão de arquivos locais do banco no controle de versão.
- Tratamento de falhas de comunicação no aplicativo.

### Limitações do protótipo

- A implementação utiliza banco H2 local, adequado para desenvolvimento e testes.
- A API ainda não possui autenticação e autorização de usuários.
- A confiabilidade dos relatos comunitários utiliza um valor inicial fixo.
- A classificação utiliza regras matemáticas, sem aprendizado de máquina.
- O endereço da API é configurado manualmente no aplicativo.
- O sistema não realiza validação independente dos relatos recebidos.
- O monitoramento atual utiliza dados cadastrados ou simulados, sem integração contínua com sensores físicos ou bases públicas.
- O projeto não deve ser utilizado como sistema oficial de resposta a emergências.

Para uma implantação real, seriam necessários controles adicionais de segurança, autenticação, proteção de dados, infraestrutura, observabilidade e verificação das informações recebidas.

---

## 📈 13. Possibilidades de Evolução

O projeto poderá ser ampliado com:

- Integração com APIs públicas de clima e desastres.
- Sensores IoT para monitoramento ambiental.
- Geolocalização e mapas interativos.
- Autenticação e perfis de usuários.
- Moderação e validação de relatos comunitários.
- Modelos preditivos de inteligência artificial.
- Histórico e análise temporal dos riscos.
- Notificações push por região.
- Banco de dados PostgreSQL.
- Implantação em infraestrutura de nuvem.
- Testes automatizados de integração e carga.

Essas funcionalidades representam possibilidades futuras e não fazem parte da implementação atual.

---

## 🎓 14. Contexto Acadêmico

**Instituição:** FIAP  
**Projeto:** Global Solution 2026.2  
**Disciplina:** Advanced Programming and Mobile Development  
**Solução:** UrbanGuard

O desenvolvimento aplica conceitos de programação Java, arquitetura em camadas, APIs REST, desenvolvimento mobile, persistência de dados, testes automatizados e integração de sistemas.

---
## 15. Video 
LINK: https://youtu.be/xXzpKk07j-8
