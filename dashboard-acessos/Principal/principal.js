// Dados globais
let agendamentos = [
  {
    id: "1",
    medico: "Dr. João Silva",
    paciente: "Maria Santos",
    dia: "segunda",
    horario: "08:00",
    tipo: "consulta",
    observacoes: "Primeira consulta",
  },
  {
    id: "2",
    medico: "Dra. Ana Costa",
    paciente: "Pedro Oliveira",
    dia: "terca",
    horario: "09:00",
    tipo: "terapia",
    observacoes: "Fisioterapia",
  },
  {
    id: "3",
    medico: "Dr. Carlos Lima",
    paciente: "José Silva",
    dia: "quinta",
    horario: "14:00",
    tipo: "avaliacao",
    observacoes: "Avaliação neurológica",
  },
]

let notas = [
  {
    id: "1",
    titulo: "Reunião de equipe",
    conteudo: "Discutir novos protocolos de atendimento",
    data: "2025-01-06",
  },
]

let tarefas = [
  { id: "1", texto: "Revisar prontuários", concluida: false },
  { id: "2", texto: "Preparar relatório mensal", concluida: true },
]

// Elementos DOM
const modal = document.getElementById("modal-agendamento")
const novoAgendamentoBtn = document.getElementById("novo-agendamento-btn")
const closeModal = document.querySelector(".close-modal")
const cancelAgendamento = document.getElementById("cancel-agendamento")
const agendamentoForm = document.getElementById("agendamento-form")

// Elementos das notas
const noteTitle = document.getElementById("note-title")
const noteContent = document.getElementById("note-content")
const addNoteBtn = document.getElementById("add-note-btn")
const notesContainer = document.getElementById("notes-container")

// Elementos do checklist
const newTaskInput = document.getElementById("new-task")
const addTaskBtn = document.getElementById("add-task-btn")
const checklist = document.getElementById("checklist")

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  renderizarAgendamentos()
  renderizarNotas()
  renderizarTarefas()
  configurarEventListeners()
})

// Event Listeners
function configurarEventListeners() {
  // Modal
  novoAgendamentoBtn.addEventListener("click", () => (modal.style.display = "block"))
  closeModal.addEventListener("click", () => (modal.style.display = "none"))
  cancelAgendamento.addEventListener("click", () => (modal.style.display = "none"))

  // Fechar modal clicando fora
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none"
    }
  })

  // Form de agendamento
  agendamentoForm.addEventListener("submit", adicionarAgendamento)

  // Notas
  addNoteBtn.addEventListener("click", adicionarNota)
  noteTitle.addEventListener("keypress", (e) => {
    if (e.key === "Enter") adicionarNota()
  })

  // Tarefas
  addTaskBtn.addEventListener("click", adicionarTarefa)
  newTaskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") adicionarTarefa()
  })
}

// Funções de Agendamentos
function adicionarAgendamento(e) {
  e.preventDefault()

  const formData = new FormData(agendamentoForm)
  const novoAgendamento = {
    id: Date.now().toString(),
    medico: formData.get("medico") || document.getElementById("medico").value,
    paciente: formData.get("paciente") || document.getElementById("paciente").value,
    dia: formData.get("dia") || document.getElementById("dia").value,
    horario: formData.get("horario") || document.getElementById("horario").value,
    tipo: formData.get("tipo") || document.getElementById("tipo").value,
    observacoes: formData.get("observacoes") || document.getElementById("observacoes").value,
  }

  // Verificar se todos os campos obrigatórios estão preenchidos
  if (!novoAgendamento.medico || !novoAgendamento.paciente || !novoAgendamento.dia || !novoAgendamento.horario) {
    alert("Por favor, preencha todos os campos obrigatórios.")
    return
  }

  // Verificar se já existe agendamento no mesmo horário e dia
  const conflito = agendamentos.find((ag) => ag.dia === novoAgendamento.dia && ag.horario === novoAgendamento.horario)

  if (conflito) {
    alert("Já existe um agendamento neste horário!")
    return
  }

  agendamentos.push(novoAgendamento)
  renderizarAgendamentos()
  agendamentoForm.reset()
  modal.style.display = "none"
}

function removerAgendamento(id) {
  if (confirm("Tem certeza que deseja remover este agendamento?")) {
    agendamentos = agendamentos.filter((ag) => ag.id !== id)
    renderizarAgendamentos()
  }
}

function renderizarAgendamentos() {
  // Limpar todos os slots
  const slots = document.querySelectorAll(".slot-horario")
  slots.forEach((slot) => {
    slot.innerHTML = ""
  })

  // Renderizar agendamentos
  agendamentos.forEach((agendamento) => {
    const slot = document.querySelector(`[data-dia="${agendamento.dia}"][data-horario="${agendamento.horario}"]`)
    if (slot) {
      slot.innerHTML = criarCardAgendamento(agendamento)
    }
  })
}

function criarCardAgendamento(agendamento) {
  const tipoClass = `tipo-${agendamento.tipo}`
  return `
        <div class="agendamento-card">
            <div class="agendamento-header">
                <span class="tipo-badge ${tipoClass}">${agendamento.tipo}</span>
                <button class="delete-btn" onclick="removerAgendamento('${agendamento.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="agendamento-medico">${agendamento.medico}</div>
            <div class="agendamento-paciente">${agendamento.paciente}</div>
            ${agendamento.observacoes ? `<div class="agendamento-obs">${agendamento.observacoes}</div>` : ""}
        </div>
    `
}

// Funções de Notas
function adicionarNota() {
  const titulo = noteTitle.value.trim()
  const conteudo = noteContent.value.trim()

  if (!titulo || !conteudo) {
    alert("Por favor, preencha o título e o conteúdo da nota.")
    return
  }

  const novaNota = {
    id: Date.now().toString(),
    titulo: titulo,
    conteudo: conteudo,
    data: new Date().toLocaleDateString("pt-BR"),
  }

  notas.push(novaNota)
  renderizarNotas()
  noteTitle.value = ""
  noteContent.value = ""
}

function removerNota(id) {
  if (confirm("Tem certeza que deseja remover esta nota?")) {
    notas = notas.filter((nota) => nota.id !== id)
    renderizarNotas()
  }
}

function renderizarNotas() {
  notesContainer.innerHTML = ""

  notas.forEach((nota) => {
    const noteElement = document.createElement("div")
    noteElement.className = "note-item"
    noteElement.innerHTML = `
            <div class="note-title">${nota.titulo}</div>
            <div class="note-content">${nota.conteudo}</div>
            <div class="note-date">${nota.data}</div>
            <button class="delete-btn" onclick="removerNota('${nota.id}')" style="float: right; margin-top: 8px;">
                <i class="fas fa-trash"></i>
            </button>
        `
    notesContainer.appendChild(noteElement)
  })
}

// Funções de Tarefas
function adicionarTarefa() {
  const texto = newTaskInput.value.trim()

  if (!texto) {
    alert("Por favor, digite uma tarefa.")
    return
  }

  const novaTarefa = {
    id: Date.now().toString(),
    texto: texto,
    concluida: false,
  }

  tarefas.push(novaTarefa)
  renderizarTarefas()
  newTaskInput.value = ""
}

function toggleTarefa(id) {
  const tarefa = tarefas.find((t) => t.id === id)
  if (tarefa) {
    tarefa.concluida = !tarefa.concluida
    renderizarTarefas()
  }
}

function removerTarefa(id) {
  if (confirm("Tem certeza que deseja remover esta tarefa?")) {
    tarefas = tarefas.filter((tarefa) => tarefa.id !== id)
    renderizarTarefas()
  }
}

function renderizarTarefas() {
  checklist.innerHTML = ""

  tarefas.forEach((tarefa) => {
    const taskElement = document.createElement("li")
    taskElement.innerHTML = `
            <input type="checkbox" ${tarefa.concluida ? "checked" : ""} 
                   onchange="toggleTarefa('${tarefa.id}')">
            <label class="${tarefa.concluida ? "completed" : ""}">${tarefa.texto}</label>
            <button class="delete-btn" onclick="removerTarefa('${tarefa.id}')">
                <i class="fas fa-trash"></i>
            </button>
        `
    checklist.appendChild(taskElement)
  })
}

// Função para salvar dados no localStorage (opcional)
function salvarDados() {
  localStorage.setItem("agendamentos", JSON.stringify(agendamentos))
  localStorage.setItem("notas", JSON.stringify(notas))
  localStorage.setItem("tarefas", JSON.stringify(tarefas))
}

// Função para carregar dados do localStorage (opcional)
function carregarDados() {
  const agendamentosSalvos = localStorage.getItem("agendamentos")
  const notasSalvas = localStorage.getItem("notas")
  const tarefasSalvas = localStorage.getItem("tarefas")

  if (agendamentosSalvos) {
    agendamentos = JSON.parse(agendamentosSalvos)
  }
  if (notasSalvas) {
    notas = JSON.parse(notasSalvas)
  }
  if (tarefasSalvas) {
    tarefas = JSON.parse(tarefasSalvas)
  }
}

// Salvar dados automaticamente quando houver mudanças
window.addEventListener("beforeunload", salvarDados)

// Carregar dados ao inicializar (descomente se quiser persistência)
// carregarDados();
