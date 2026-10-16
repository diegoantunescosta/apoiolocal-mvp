# 🤝 ApoioLocal - MVP de Conexão e Apoio Comunitário

[![CI Pipeline](https://github.com/diegoantunescosta/apoiolocal-mvp/actions/workflows/ci.yml/badge.svg)](https://github.com/diegoantunescosta/apoiolocal-mvp/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v22-green.svg)](https://nodejs.org/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-yellow.svg)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-lightgrey.svg)](LICENSE)

> **Projeto de Engenharia de Software:** Desenvolvimento de MVP com foco em qualidade técnica, versionamento estruturado, testes automatizados (unitários e de integração), Integração Contínua (CI) e validação em campo com a comunidade local.

---

## 📌 1. Contexto e Problema Diagnosticado

Nas comunidades e bairros periféricos, pequenas entidades assistenciais, cozinhas comunitárias, abrigos e famílias em vulnerabilidade enfrentam carências pontuais e emergenciais (alimentos não perecíveis, agasalhos, materiais de higiene e escolares).

Simultaneamente, moradores e comércios locais têm interesse em doar e ajudar, mas enfrentam barreiras como:
- Falta de visibilidade em tempo real sobre quais itens são realmente necessários e urgentes.
- Desconfiança ou burocracia excessiva em grandes plataformas.
- Dificuldade logística para identificar pontos de coleta próximos.

O **ApoioLocal** surge como um MVP leve, ágil e acessível para conectar de forma transparente e direta os **pontos de demanda comunitária** com os **doadores locais**.

---

## 🎯 2. Escopo do MVP e Requisitos

### Requisitos Funcionais (RF)
- **RF01 - Cadastro de Demandas:** Representantes comunitários/ONGs podem cadastrar demandas urgentes especificando categoria, quantidade pretendida, descrição e prazo.
- **RF02 - Mural Comunitário:** Visualização pública de demandas ativas, filtradas por categoria (Alimentos, Roupas, Higiene, Outros) e status.
- **RF03 - Registro de Intenção de Doação:** Cidadãos doadores podem registrar intenções de doação para abater demandas ativas.
- **RF04 - Atualização de Status:** Controle de ciclo de vida das demandas (`ABERTA`, `EM_ANDAMENTO`, `CONCLUIDA`).
- **RF05 - Pontos de Coleta:** Mapeamento simples com endereço e horários de funcionamento para entrega física.

### Requisitos Não Funcionais (RNF)
- **RNF01 - Usabilidade:** Interface responsiva, limpa e acessível em dispositivos móveis populares.
- **RNF02 - Desempenho:** Tempo de resposta da API inferior a 200ms para consultas locais.
- **RNF03 - Confiabilidade:** Cobertura de testes automatizados (unitários e de integração) garantindo integridade das regras de negócio.
- **RNF04 - CI/CD:** Execução automática de validação de tipagem, linting e testes a cada Push e Pull Request.

---

## 🏗️ 3. Arquitetura e Tecnologias

A aplicação segue uma arquitetura modular em camadas, priorizando desacoplamento, testabilidade e simplicidade de manutenção:

```
├── .github/
│   ├── workflows/
│   │   └── ci.yml               # Pipeline de CI (Lint + Build + Testes Unitários e Integração)
│   └── pull_request_template.md # Template para revisão padronizada de código por PR
├── src/
│   ├── domain/                  # Entidades de negócio e regras de validação (Domain Layer)
│   ├── services/                # Casos de uso e orquestração de lógica (Service Layer)
│   ├── repositories/            # Camada de acesso e persistência a dados (Data Layer)
│   ├── server/                  # Rotas HTTP, middlewares e controladores da API
│   └── public/                  # Frontend Web responsivo e interativo
├── tests/
│   ├── unit/                    # Testes automatizados unitários
│   └── integration/             # Testes automatizados de integração de rotas e banco
└── docs/
    └── validacao-campo.md       # Documentação das rodadas de testes com a comunidade
```

* **Linguagem & Runtime:** Node.js (v20+) com TypeScript
* **Servidor HTTP:** Fastify / Express com tipagem estrita
* **Banco de Dados:** SQLite (persistente e in-memory para testes isolados)
* **Framework de Testes:** Vitest + Supertest
* **CI/CD:** GitHub Actions

---

## 🚀 4. Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js 20+ ou 22+
- npm (ou pnpm/yarn)
- Git

### Instalação

```bash
# 1. Clone o repositório público
git clone https://github.com/diegoantunescosta/apoiolocal-mvp.git

# 2. Acesse a pasta do projeto
cd apoiolocal-mvp

# 3. Instale as dependências
npm install
```

### Executando em Modo Desenvolvimento

```bash
npm run dev
```
Acesse a aplicação no seu navegador em: `http://localhost:3000`.

### Executando a Suíte de Testes Automatizados

```bash
# Executar todos os testes (unitários e de integração)
npm test

# Executar com relatório de cobertura de código
npm run test:coverage

# Executar apenas testes unitários
npm run test:unit

# Executar apenas testes de integração
npm run test:integration
```

---

## 🔄 5. Práticas de Engenharia e Integração Contínua (CI)

1. **Git Flow Simplificado:** O desenvolvimento ocorre por meio de feature branches (`feature/nome-da-funcionalidade`).
2. **Pull Requests (PR):** Toda alteração passa por PR com template padronizado ([pull_request_template.md](.github/pull_request_template.md)).
3. **Pipeline Automatizado (GitHub Actions):**
   - Validação de formatação e tipagem (`tsc --noEmit`).
   - Execução obrigatória de 100% dos testes unitários e de integração.
   - Bloqueio de merge se algum teste quebrar.

---

## 👥 6. Validação e Testes em Campo com a Comunidade

O projeto incorpora **duas rodadas planejadas de validação com representantes comunitários**:

* **Rodada 1 (Validação de Usabilidade do MVP Inicial):**
  - Teste guiado com lideranças de bairro e voluntários para cadastro de necessidades e facilidade de localização dos pontos de entrega.
  - Registro de gargalos de navegação, termos confusos e sugestões de melhoria.
* **Rodada 2 (Verificação dos Ajustes Pós-Feedback):**
  - Aplicação dos ajustes refinados no software e reavaliação de campo com os mesmos participantes para aferição do ganho de usabilidade e impacto.
* Os relatórios completos de feedback e alterações realizadas estão documentados em [`docs/validacao-campo.md`](docs/validacao-campo.md).

---

## 📄 Licença

Distribuído sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para obter mais detalhes.
