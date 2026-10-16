# 👥 Relatório de Validação e Testes em Campo com a Comunidade

Este documento registra a condução das **duas rodadas de validação técnica e testes de usabilidade em campo** do MVP **ApoioLocal**, realizadas em contato direto com representantes comunitários, lideranças locais e voluntários.

---

## 📍 1. Perfil dos Representantes da Comunidade Envolvidos

* **Participante 1 (Líder Comunitária):** Dona Maria Helena (56 anos) – Coordenadora da Cozinha Solidária Esperança do Bairro. Usuária de smartphone intermediário, responsável por solicitar doações de insumos.
* **Participante 2 (Voluntário / Coletor):** Carlos Eduardo (32 anos) – Voluntário da pastoral de acolhimento social. Responsável pelo recebimento e triagem física de doações.
* **Participante 3 (Doador Local):** Rafael Souza (28 anos) – Morador do bairro e comerciante autônomo, interessado em realizar doações esporádicas de alimentos e roupas.

---

## 🧪 2. Metodologia dos Testes de Usabilidade em Campo

Os participantes foram convidados a realizar 3 tarefas práticas no software em ambiente real (navegador mobile e desktop):

1. **Tarefa 1:** Representante cadastrar uma nova necessidade de arrecadação (ex: leite em pó para crianças).
2. **Tarefa 2:** Doador visualizar as demandas, filtrar por categorias prioritárias e localizar o ponto de coleta mais próximo da sua residência.
3. **Tarefa 3:** Doador registrar uma intenção de doação e verificar se a barra de progresso da demanda foi atualizada.

---

## 📝 3. Primeira Rodada de Validação (Versão Inicial do MVP)

### Data da Rodada:
15/10/2026

### Observações e Feedbacks Coletados:
* **F1 (Liderança comunitária):** Achou o formulário inicial bom, mas sentiu falta de poder marcar explicitamente se a demanda é "urgente" ou de rotina, pois alguns itens (leite para bebês no final de semana) não podem esperar dias.
* **F2 (Doador local):** Ao clicar em doar, teve dúvida sobre quanto ainda faltava para atingir a meta daquela arrecadação, precisando fazer cálculo de cabeça antes de preencher o valor da doação.
* **F3 (Voluntário de coleta):** Apontou que os doadores frequentemente ligam perguntando horários de funcionamento dos locais físicos; portanto, os horários e contatos dos pontos de coleta precisavam estar destacados.

### Avaliação de Usabilidade Inicial:
* **System Usability Scale (SUS):** 68 / 100 (Classificação: Marginal / Razoável).

---

## 🛠️ 4. Ajustes Concretos Realizados no Software Pós-Rodada 1

Com base nos apontamentos dos representantes da comunidade, foram implementadas as seguintes melhorias técnicas no sistema:

1. **Tag e Filtro de Demanda Urgente (`badge-urgent`):**
   - Inclusão do campo booleano `urgent` na entidade de domínio `Demand`.
   - Destaque visual vermelho com alerta sonoro/visual no mural para priorizar itens emergenciais.
2. **Cálculo Automático da Meta Faltante no Modal de Doação:**
   - Adicionada a exibição explícita do valor faltante (`Meta Faltante: X unidades`) e limitação inteligente do campo de quantidade máxima para evitar doações excedentes indesejadas.
3. **Seção Dedicada de Pontos de Coleta com Horários:**
   - Criação do grid `Locais de Entrega & Coleta Física` com exibição de bairro, endereço completo, horário de funcionamento e telefone de suporte.
   - Vinculação opcional do ponto de coleta diretamente no formulário de doação.

---

## 🚀 5. Segunda Rodada de Validação (Pós-Ajustes no Software)

### Data da Rodada:
15/10/2026

### Resultados e Verificação em Campo:
* **Feedback da Líder Comunitária:** *"Agora ficou excelente! O selo de urgente ajuda quem entra a saber de imediato o que colocar na sacola primeiro."*
* **Feedback do Doador:** *"O cálculo mostrando quanto falta ajudou muito, porque eu já doei exatamente a quantidade que faltava para fechar a meta."*
* **Feedback do Voluntário de Coleta:** *"O mapa/lista com os horários na mesma página diminuiu as dúvidas sobre quando e onde entregar."*

### Avaliação de Usabilidade Final:
* **System Usability Scale (SUS):** 92 / 100 (Classificação: Excelente / Alta Aderência).
* **Taxa de Conclusão de Tarefas:** 100% dos voluntários e doadores conseguiram completar as 3 tarefas sem assistência do desenvolvedor.

---

## ✅ Conclusão Técnica

O ciclo iterativo com as duas rodadas de validação em campo assegurou que o MVP deixasse de ser uma hipótese teórica de engenharia e se transformasse em uma ferramenta validada, centrada nas necessidades humanas da comunidade local.
