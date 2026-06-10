# Lista de Tarefas

Projeto desenvolvido durante a terceira semana de capacitação da área de Desktop da Asimov Jr., com foco em TypeScript.

## Sobre o projeto

Uma aplicação web de lista de tarefas feita com HTML, CSS e TypeScript puro. A ideia era ir além do básico e entregar algo funcional de verdade, então acabei adicionando algumas funcionalidades extras além do que foi pedido.

## Funcionalidades

- Adicionar tarefas pelo campo de texto ou pressionando Enter
- Marcar tarefas como concluídas clicando no círculo ao lado
- Excluir tarefas individualmente
- Filtrar tarefas por status: todas, pendentes ou concluídas
- Barra de progresso mostrando quantas tarefas foram concluídas
- Data de criação exibida em cada tarefa
- Dados salvos no localStorage (as tarefas persistem ao fechar o navegador)
- Layout responsivo para mobile

## Tecnologias utilizadas

- TypeScript
- HTML5
- CSS3

## Como rodar localmente

**Pré-requisitos:** ter o [Node.js](https://nodejs.org) instalado.

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/lista-de-tarefas.git

# Entre na pasta
cd lista-de-tarefas

# Instale o TypeScript globalmente (caso não tenha)
npm install -g typescript

# Compile o TypeScript
tsc

# Abra o arquivo src/index.html no navegador
```

## Estrutura de pastas

```
├── src/
│   ├── index.html
│   ├── index.ts
│   └── style.css
├── build/
│   └── index.js
└── tsconfig.json
```

---

Desenvolvido por **Isadora Franco**