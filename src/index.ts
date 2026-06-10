interface Tarefa {
  id: number;
  texto: string;
  concluida: boolean;
  criadaEm: string;
}

const listaEl = document.getElementById("lista-tarefas") as HTMLUListElement;
const inputEl = document.getElementById("task-input") as HTMLInputElement;
const btnAdicionar = document.getElementById("add-button") as HTMLButtonElement;
const retornoEl = document.getElementById("feedback") as HTMLParagraphElement;
const barraProgresso = document.getElementById("progress-bar") as HTMLDivElement;
const textoProgresso = document.getElementById("progress-text") as HTMLSpanElement;
const pctProgresso = document.getElementById("progress-pct") as HTMLSpanElement;
const botoesFiltrо = document.querySelectorAll<HTMLButtonElement>(".btn-filtro");

const CHAVE_STORAGE = "@listagem_tarefas_v2";

let tarefas: Tarefa[] = [];
let filtroAtivo: "all" | "pending" | "done" = "all";
let proximoId = 1;

function carregarDados(): void {
  const salvo = localStorage.getItem(CHAVE_STORAGE);
  if (salvo) {
    const parsed = JSON.parse(salvo) as { tarefas: Tarefa[]; proximoId: number };
    tarefas = parsed.tarefas ?? [];
    proximoId = parsed.proximoId ?? tarefas.length + 1;
  }
}

function salvarDados(): void {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify({ tarefas, proximoId }));
}

function mostrarRetorno(mensagem: string, tipo: "erro" | "sucesso" = "erro"): void {
  retornoEl.textContent = mensagem;
  retornoEl.className = `retorno retorno--${tipo}`;
  setTimeout(() => {
    retornoEl.textContent = "";
    retornoEl.className = "retorno";
  }, 2500);
}

function atualizarProgresso(): void {
  const total = tarefas.length;
  const concluidas = tarefas.filter((t) => t.concluida).length;
  const pct = total === 0 ? 0 : Math.round((concluidas / total) * 100);

  textoProgresso.textContent = `${concluidas} de ${total} concluída${total !== 1 ? "s" : ""}`;
  pctProgresso.textContent = `${pct}%`;
  barraProgresso.style.width = `${pct}%`;
}

function tarefasFiltradas(): Tarefa[] {
  if (filtroAtivo === "pending") return tarefas.filter((t) => !t.concluida);
  if (filtroAtivo === "done") return tarefas.filter((t) => t.concluida);
  return tarefas;
}

function listarTarefas(): void {
  listaEl.innerHTML = "";
  const lista = tarefasFiltradas();

  if (lista.length === 0) {
    const msg = document.createElement("li");
    msg.className = "lista-vazia";
    const textos: Record<string, string> = {
      all: "Nenhuma tarefa cadastrada ainda.",
      pending: "Nenhuma tarefa pendente.",
      done: "Nenhuma tarefa concluída ainda.",
    };
    msg.textContent = textos[filtroAtivo];
    listaEl.appendChild(msg);
    atualizarProgresso();
    return;
  }

  lista.forEach((tarefa) => {
    const li = document.createElement("li");
    li.className = `item-tarefa${tarefa.concluida ? " item-tarefa--feito" : ""}`;
    li.dataset.id = String(tarefa.id);

    const btnConcluir = document.createElement("button");
    btnConcluir.className = "btn-concluir";
    btnConcluir.setAttribute("aria-label", tarefa.concluida ? "Marcar como pendente" : "Marcar como concluída");
    btnConcluir.setAttribute("aria-pressed", String(tarefa.concluida));
    btnConcluir.innerHTML = tarefa.concluida
      ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>`
      : "";
    btnConcluir.addEventListener("click", () => alternarConcluido(tarefa.id));

    const spanTexto = document.createElement("span");
    spanTexto.className = "texto-tarefa";
    spanTexto.textContent = tarefa.texto;

    const spanData = document.createElement("span");
    spanData.className = "data-tarefa";
    spanData.textContent = tarefa.criadaEm;

    const divInfo = document.createElement("div");
    divInfo.className = "info-tarefa";
    divInfo.appendChild(spanTexto);
    divInfo.appendChild(spanData);

    const btnExcluir = document.createElement("button");
    btnExcluir.className = "btn-excluir";
    btnExcluir.setAttribute("aria-label", `Excluir tarefa: ${tarefa.texto}`);
    btnExcluir.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`;
    btnExcluir.addEventListener("click", () => excluirTarefa(tarefa.id));

    li.appendChild(btnConcluir);
    li.appendChild(divInfo);
    li.appendChild(btnExcluir);
    listaEl.appendChild(li);
  });

  atualizarProgresso();
}

function adicionarTarefa(): void {
  const texto = inputEl.value.trim();

  if (texto === "") {
    mostrarRetorno("Digite uma tarefa antes de adicionar.");
    inputEl.focus();
    return;
  }

  const nova: Tarefa = {
    id: proximoId++,
    texto,
    concluida: false,
    criadaEm: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
  };

  tarefas.unshift(nova);
  inputEl.value = "";
  inputEl.focus();
  mostrarRetorno("Tarefa adicionada!", "sucesso");
  listarTarefas();
  salvarDados();
}

function alternarConcluido(id: number): void {
  const tarefa = tarefas.find((t) => t.id === id);
  if (!tarefa) return;
  tarefa.concluida = !tarefa.concluida;
  listarTarefas();
  salvarDados();
}

function excluirTarefa(id: number): void {
  const li = listaEl.querySelector(`[data-id="${id}"]`) as HTMLLIElement | null;
  if (li) {
    li.classList.add("item-tarefa--saindo");
    li.addEventListener("animationend", () => {
      tarefas = tarefas.filter((t) => t.id !== id);
      listarTarefas();
      salvarDados();
    }, { once: true });
  } else {
    tarefas = tarefas.filter((t) => t.id !== id);
    listarTarefas();
    salvarDados();
  }
}

botoesFiltrо.forEach((btn) => {
  btn.addEventListener("click", () => {
    botoesFiltrо.forEach((b) => b.classList.remove("ativo"));
    btn.classList.add("ativo");
    filtroAtivo = btn.dataset.filter as "all" | "pending" | "done";
    listarTarefas();
  });
});

btnAdicionar.addEventListener("click", adicionarTarefa);

inputEl.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Enter") adicionarTarefa();
});

carregarDados();
listarTarefas();