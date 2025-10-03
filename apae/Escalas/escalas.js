// Dados globais
let profissionais = [
  { id: 1, nome: "Dr. João Silva", especialidade: "Neurologia", disponivel: true },
  { id: 2, nome: "Dra. Ana Costa", especialidade: "Fisioterapia", disponivel: true },
  { id: 3, nome: "Dr. Carlos Lima", especialidade: "Fonoaudiologia", disponivel: true },
  { id: 4, nome: "Dra. Maria Fernanda", especialidade: "Psicologia", disponivel: true },
  { id: 5, nome: "Dr. Pedro Santos", especialidade: "Neurologia", disponivel: true },
  { id: 6, nome: "Dra. Julia Oliveira", especialidade: "Fisioterapia", disponivel: true },
  { id: 7, nome: "Dr. Roberto Lima", especialidade: "Terapia Ocupacional", disponivel: true },
  { id: 8, nome: "Dra. Carla Mendes", especialidade: "Psicologia", disponivel: true },
]

const especialidades = [
  "Neurologia",
  "Fisioterapia",
  "Fonoaudiologia",
  "Psicologia",
  "Terapia Ocupacional",
  "Pediatria",
  "Psiquiatria",
]

const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]
const horariosManha = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00"]
const horariosTarde = ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"]

let pacientes = []
let vinculos = []
let escalasGeradas = []

const semanaAtual = new Date()
let datasVisiveis = []

// Elementos DOM
const modalPaciente = document.getElementById("modal-paciente")
const modalEscalas = document.getElementById("modal-escalas")
const novoPacienteBtn = document.getElementById("novo-paciente-btn")
const closePaciente = document.getElementById("close-paciente")
const closeEscalas = document.getElementById("close-escalas")
const cancelPaciente = document.getElementById("cancel-paciente")
const pacienteForm = document.getElementById("paciente-form")
const pacientesContainer = document.getElementById("pacientes-container")
const escalasContainer = document.getElementById("escalas-container")
const especialidadesContainer = document.getElementById("especialidades-container")

// Elementos de importação
const fileImport = document.getElementById("file-import")
const importBtn = document.getElementById("import-btn")
const fileStatus = document.getElementById("file-status")

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  renderizarEspecialidades()
  renderizarPacientes()
  atualizarSemana() // Configurar semana atual
  configurarEventListeners()
})

// Event Listeners
function configurarEventListeners() {
  // Modal Paciente
  novoPacienteBtn.addEventListener("click", () => {
    // Definir data padrão como hoje
    document.getElementById("data-inicio").value = new Date().toISOString().split("T")[0]
    modalPaciente.style.display = "block"
  })

  closePaciente.addEventListener("click", () => {
    modalPaciente.style.display = "none"
  })

  cancelPaciente.addEventListener("click", () => {
    modalPaciente.style.display = "none"
  })

  // Modal Escalas
  closeEscalas.addEventListener("click", () => {
    modalEscalas.style.display = "none"
  })

  // Navegação de semana
  document.getElementById("semana-anterior").addEventListener("click", () => {
    semanaAtual.setDate(semanaAtual.getDate() - 7)
    atualizarSemana()
  })

  document.getElementById("proxima-semana").addEventListener("click", () => {
    semanaAtual.setDate(semanaAtual.getDate() + 7)
    atualizarSemana()
  })

  // Importação de arquivos
  fileImport.addEventListener("change", handleFileSelect)
  importBtn.addEventListener("click", handleImport)

  // Fechar modal clicando fora
  window.addEventListener("click", (e) => {
    if (e.target === modalPaciente) {
      modalPaciente.style.display = "none"
    }
    if (e.target === modalEscalas) {
      modalEscalas.style.display = "none"
    }
  })

  // Form de paciente
  pacienteForm.addEventListener("submit", adicionarPaciente)
}

// Função para lidar com seleção de arquivo
function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    fileStatus.textContent = `Arquivo selecionado: ${file.name}`
    importBtn.disabled = false
  } else {
    fileStatus.textContent = "Nenhum arquivo selecionado"
    importBtn.disabled = true
  }
}

// Função para lidar com importação
function handleImport() {
  const file = fileImport.files[0]
  if (!file) {
    alert("Por favor, selecione um arquivo primeiro.")
    return
  }

  const reader = new FileReader()
  reader.onload = function(e) {
    try {
      let dados
      
      if (file.name.endsWith('.json')) {
        dados = JSON.parse(e.target.result)
      } else if (file.name.endsWith('.csv')) {
        dados = parseCSV(e.target.result)
      } else {
        throw new Error("Formato de arquivo não suportado")
      }

      importarProfissionais(dados)
      alert(`Importação concluída! ${dados.length} profissionais importados.`)
      
      // Limpar seleção de arquivo
      fileImport.value = ""
      fileStatus.textContent = "Nenhum arquivo selecionado"
      importBtn.disabled = true
      
    } catch (error) {
      alert(`Erro ao importar arquivo: ${error.message}`)
    }
  }
  
  reader.readAsText(file)
}

// Função para parsear CSV
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  const dados = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    const obj = {}
    
    headers.forEach((header, index) => {
      obj[header] = values[index] || ""
    })
    
    dados.push(obj)
  }
  
  return dados
}

// Função para importar profissionais
function importarProfissionais(dados) {
  const novosIds = profissionais.length > 0 ? Math.max(...profissionais.map(p => p.id)) + 1 : 1
  let idCounter = novosIds

  dados.forEach(item => {
    // Validar dados obrigatórios
    if (!item.nome || !item.especialidade) {
      console.warn("Item ignorado - dados obrigatórios faltando:", item)
      return
    }

    // Verificar se já existe profissional com mesmo nome
    const existente = profissionais.find(p => 
      p.nome.toLowerCase() === item.nome.toLowerCase()
    )
    
    if (existente) {
      console.warn(`Profissional ${item.nome} já existe, ignorando...`)
      return
    }

    const novoProfissional = {
      id: idCounter++,
      nome: item.nome,
      especialidade: item.especialidade,
      disponivel: item.disponivel !== undefined ? 
        (item.disponivel === 'true' || item.disponivel === true) : true,
      // Campos adicionais para horários específicos (se fornecidos)
      dia: item.dia || null,
      horario: item.horario || null
    }

    profissionais.push(novoProfissional)
  })

  console.log("Profissionais após importação:", profissionais)
}

// Função para obter o início da semana (segunda-feira)
function obterInicioSemana(data) {
  const d = new Date(data)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Ajustar para segunda-feira
  return new Date(d.setDate(diff))
}

// Função para formatar data
function formatarData(data) {
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  })
}

// Função para formatar data completa
function formatarDataCompleta(data) {
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

// Função para verificar se é hoje
function ehHoje(data) {
  const hoje = new Date()
  return data.toDateString() === hoje.toDateString()
}

// Atualizar semana visível
function atualizarSemana() {
  const inicioSemana = obterInicioSemana(semanaAtual)
  datasVisiveis = []

  // Gerar as 5 datas da semana (segunda a sexta)
  for (let i = 0; i < 5; i++) {
    const data = new Date(inicioSemana)
    data.setDate(inicioSemana.getDate() + i)
    datasVisiveis.push(data)
  }

  // Atualizar cabeçalhos
  datasVisiveis.forEach((data, index) => {
    const dataElement = document.getElementById(`data-${index + 1}`)
    if (dataElement) {
      dataElement.textContent = formatarData(data)
      dataElement.className = ehHoje(data) ? "dia-data data-hoje" : "dia-data"
    }
  })

  // Atualizar período da semana
  const periodoElement = document.getElementById("periodo-semana")
  if (periodoElement) {
    const fimSemana = new Date(datasVisiveis[4])
    periodoElement.textContent = `${formatarDataCompleta(datasVisiveis[0])} - ${formatarDataCompleta(fimSemana)}`
  }

  // Atualizar slots com as novas datas
  atualizarSlotsComDatas()
  renderizarVinculos()
}

// Atualizar slots com datas
function atualizarSlotsComDatas() {
  const slots = document.querySelectorAll(".slot-horario")
  slots.forEach((slot) => {
    const diaIndex = (Array.from(slot.parentNode.children).indexOf(slot) % 6) - 1
    if (diaIndex >= 0 && diaIndex < 5 && datasVisiveis[diaIndex]) {
      slot.setAttribute("data-data", datasVisiveis[diaIndex].toISOString().split("T")[0])
    }
  })
}

// Renderizar especialidades no modal
function renderizarEspecialidades() {
  especialidadesContainer.innerHTML = ""

  especialidades.forEach((especialidade) => {
    const checkboxItem = document.createElement("div")
    checkboxItem.className = "checkbox-item"

    checkboxItem.innerHTML = `
      <input type="checkbox" id="esp-${especialidade}" value="${especialidade}">
      <label for="esp-${especialidade}">${especialidade}</label>
    `

    especialidadesContainer.appendChild(checkboxItem)
  })
}

// Adicionar paciente
function adicionarPaciente(e) {
  e.preventDefault()

  const nomePaciente = document.getElementById("nome-paciente").value.trim()
  const observacoes = document.getElementById("observacoes-paciente").value.trim()
  const dataInicio = document.getElementById("data-inicio").value

  // Obter especialidades selecionadas
  const especialidadesSelecionadas = []
  const checkboxes = especialidadesContainer.querySelectorAll('input[type="checkbox"]:checked')
  checkboxes.forEach((checkbox) => {
    especialidadesSelecionadas.push(checkbox.value)
  })

  // Obter preferências de período
  const periodoPreferencia = document.querySelector('input[name="periodo-preferencia"]:checked').value
  
  // Obter dias preferenciais
  const diasPreferenciais = []
  const diasCheckboxes = document.querySelectorAll('input[name="dias-preferencia"]:checked')
  diasCheckboxes.forEach((checkbox) => {
    diasPreferenciais.push(checkbox.value)
  })

  if (!nomePaciente || especialidadesSelecionadas.length === 0 || !dataInicio) {
    alert("Por favor, preencha todos os campos obrigatórios.")
    return
  }

  const novoPaciente = {
    id: Date.now(),
    nome: nomePaciente,
    especialidades: especialidadesSelecionadas,
    observacoes: observacoes,
    dataInicio: dataInicio,
    periodoPreferencia: periodoPreferencia,
    diasPreferenciais: diasPreferenciais
  }

  pacientes.push(novoPaciente)
  renderizarPacientes()

  // Reset form
  pacienteForm.reset()
  modalPaciente.style.display = "none"
}

// Renderizar pacientes
function renderizarPacientes() {
  if (pacientes.length === 0) {
    pacientesContainer.innerHTML = `
      <div class="empty-state">
        <p>Nenhum paciente cadastrado. Adicione um paciente para começar.</p>
      </div>
    `
    return
  }

  pacientesContainer.innerHTML = ""

  pacientes.forEach((paciente) => {
    const pacienteCard = document.createElement("div")
    pacienteCard.className = "paciente-card"

    const especialidadesBadges = paciente.especialidades.map((esp) => `<span class="badge">${esp}</span>`).join("")
    
    // Mostrar preferências do paciente
    let preferenciaTexto = ""
    if (paciente.periodoPreferencia === "manha") {
      preferenciaTexto = "Preferência: Manhã"
    } else if (paciente.periodoPreferencia === "tarde") {
      preferenciaTexto = "Preferência: Tarde"
    } else {
      preferenciaTexto = "Preferência: Flexível"
    }
    
    if (paciente.diasPreferenciais && paciente.diasPreferenciais.length > 0) {
      preferenciaTexto += ` | Dias: ${paciente.diasPreferenciais.join(", ")}`
    }

    pacienteCard.innerHTML = `
      <div class="paciente-header">
        <div class="paciente-info">
          <h3>${paciente.nome}</h3>
          <div class="especialidades-badges">
            ${especialidadesBadges}
          </div>
          <p class="paciente-preferencias" style="font-size: 12px; color: #666; margin: 5px 0;">${preferenciaTexto}</p>
          ${paciente.observacoes ? `<p class="paciente-obs">${paciente.observacoes}</p>` : ""}
        </div>
        <button class="btn-success" onclick="gerarVinculos(${paciente.id})">
          Gerar Vínculo
        </button>
      </div>
    `

    pacientesContainer.appendChild(pacienteCard)
  })
}

// Função para verificar se um horário está dentro do período preferido
function horarioNoPeriodo(horario, periodo) {
  const hora = parseInt(horario.split(':')[0])
  
  if (periodo === "manha") {
    return hora >= 8 && hora < 13
  } else if (periodo === "tarde") {
    return hora >= 13 && hora < 18
  }
  
  return true // flexível
}

// Função para obter horários próximos
function obterHorariosProximos(horarioBase, periodo, quantidade = 3) {
  const horariosDisponiveis = periodo === "manha" ? horariosManha : horariosTarde
  const indexBase = horariosDisponiveis.indexOf(horarioBase)
  
  if (indexBase === -1) return [horarioBase]
  
  const horarios = []
  
  // Adicionar horário base
  horarios.push(horarioBase)
  
  // Adicionar horários próximos (antes e depois)
  for (let i = 1; i < quantidade && horarios.length < quantidade; i++) {
    // Tentar adicionar horário posterior
    if (indexBase + i < horariosDisponiveis.length) {
      horarios.push(horariosDisponiveis[indexBase + i])
    }
    
    // Tentar adicionar horário anterior
    if (indexBase - i >= 0 && horarios.length < quantidade) {
      horarios.unshift(horariosDisponiveis[indexBase - i])
    }
  }
  
  return horarios
}

// Gerar vínculos para um paciente (versão melhorada)
function gerarVinculos(pacienteId) {
  const paciente = pacientes.find((p) => p.id === pacienteId)
  if (!paciente) return

  const dataInicioPaciente = new Date(paciente.dataInicio)
  const escalasOpcoes = []

  // Determinar dias disponíveis baseado nas preferências
  let diasDisponiveis = paciente.diasPreferenciais.length > 0 ? 
    paciente.diasPreferenciais : diasSemana

  // Gerar até 4 opções de escalas
  for (let opcao = 0; opcao < 4; opcao++) {
    const escalaOpcao = []

    // Para cada especialidade do paciente
    paciente.especialidades.forEach((especialidade, espIndex) => {
      // Buscar profissionais disponíveis para essa especialidade
      const profissionaisDisponiveis = profissionais.filter((p) => 
        p.especialidade === especialidade && p.disponivel
      )

      if (profissionaisDisponiveis.length === 0) return

      // Escolher um dia baseado nas preferências
      const diaEscolhido = diasDisponiveis[espIndex % diasDisponiveis.length]
      
      // Calcular data do atendimento
      const dataAtendimento = new Date(dataInicioPaciente)
      const diaIndex = diasSemana.indexOf(diaEscolhido)
      const diasParaAdicionar = (diaIndex - dataInicioPaciente.getDay() + 7) % 7
      dataAtendimento.setDate(dataInicioPaciente.getDate() + diasParaAdicionar)

      // Pular fins de semana
      if (dataAtendimento.getDay() === 0 || dataAtendimento.getDay() === 6) {
        dataAtendimento.setDate(dataAtendimento.getDate() + (dataAtendimento.getDay() === 0 ? 1 : 2))
      }

      const profissionalEscolhido = profissionaisDisponiveis[opcao % profissionaisDisponiveis.length]

      // Determinar período baseado na preferência do paciente
      let periodo
      if (paciente.periodoPreferencia === "manha") {
        periodo = "manha"
      } else if (paciente.periodoPreferencia === "tarde") {
        periodo = "tarde"
      } else {
        // Flexível - alternar entre manhã e tarde para variedade
        periodo = opcao % 2 === 0 ? "manha" : "tarde"
      }

      // Escolher horários próximos dentro do período
      const horariosDisponiveis = periodo === "manha" ? horariosManha : horariosTarde
      const horarioBase = horariosDisponiveis[Math.floor(Math.random() * horariosDisponiveis.length)]
      const horariosProximos = obterHorariosProximos(horarioBase, periodo, 1)
      
      horariosProximos.forEach((horario, horarioIndex) => {
        // Ajustar data para horários subsequentes (mesmo dia ou dias próximos)
        const dataFinal = new Date(dataAtendimento)
        if (horarioIndex > 0 && paciente.especialidades.length > 1) {
          // Para múltiplas especialidades, manter no mesmo dia se possível
          // ou usar dias consecutivos
          dataFinal.setDate(dataAtendimento.getDate() + Math.floor(horarioIndex / 2))
        }

        escalaOpcao.push({
          dia: diasSemana[dataFinal.getDay() - 1] || diaEscolhido,
          data: dataFinal.toISOString().split("T")[0],
          horario: horario,
          profissional: profissionalEscolhido,
          especialidade: especialidade,
          periodo: periodo
        })
      })
    })

    if (escalaOpcao.length > 0) {
      // Ordenar por data e horário para manter proximidade
      escalaOpcao.sort((a, b) => {
        const dataA = new Date(a.data + ' ' + a.horario)
        const dataB = new Date(b.data + ' ' + b.horario)
        return dataA - dataB
      })
      
      escalasOpcoes.push(escalaOpcao)
    }
  }

  const novaEscala = {
    paciente: paciente,
    opcoes: escalasOpcoes,
  }

  escalasGeradas = [novaEscala]
  renderizarEscalasGeradas()
  modalEscalas.style.display = "block"
}

// Renderizar escalas geradas
function renderizarEscalasGeradas() {
  escalasContainer.innerHTML = ""

  escalasGeradas.forEach((escala) => {
    const escalaDiv = document.createElement("div")

    escalaDiv.innerHTML = `
      <h3 class="paciente-escala-title">Paciente: ${escala.paciente.nome}</h3>
      <p style="color: #666; margin-bottom: 20px;">
        Preferência: ${escala.paciente.periodoPreferencia === 'manha' ? 'Manhã' : 
                      escala.paciente.periodoPreferencia === 'tarde' ? 'Tarde' : 'Flexível'}
        ${escala.paciente.diasPreferenciais.length > 0 ? 
          ` | Dias preferenciais: ${escala.paciente.diasPreferenciais.join(', ')}` : ''}
      </p>
    `

    escala.opcoes.forEach((opcao, index) => {
      const opcaoDiv = document.createElement("div")
      opcaoDiv.className = "escala-opcao"

      let itensHtml = ""
      opcao.forEach((item) => {
        const dataFormatada = new Date(item.data).toLocaleDateString("pt-BR")
        const periodoIcon = item.periodo === "manha" ? "🌅" : "🌆"
        
        itensHtml += `
          <div class="escala-item">
            <div class="escala-item-info">
              <span class="badge">${item.especialidade}</span>
              <span style="font-weight: 500;">${item.profissional.nome}</span>
              <span style="font-size: 12px; color: #666;">${periodoIcon} ${item.periodo === "manha" ? "Manhã" : "Tarde"}</span>
            </div>
            <div class="escala-item-horario">
              <i class="fas fa-calendar"></i>
              ${item.dia} - ${dataFormatada}
              <i class="fas fa-clock"></i>
              ${item.horario}
            </div>
          </div>
        `
      })

      opcaoDiv.innerHTML = `
        <h3>Opção ${index + 1}</h3>
        ${itensHtml}
        <button class="btn-primary confirmar-btn" onclick="confirmarEscala(${escala.paciente.id}, ${index})">
          Confirmar Esta Opção
        </button>
      `

      escalaDiv.appendChild(opcaoDiv)
    })

    escalasContainer.appendChild(escalaDiv)
  })
}

// Confirmar escala escolhida
function confirmarEscala(pacienteId, opcaoIndex) {
  const escala = escalasGeradas.find((e) => e.paciente.id === pacienteId)
  if (!escala) return

  const opcaoEscolhida = escala.opcoes[opcaoIndex]

  // Criar vínculos
  opcaoEscolhida.forEach((item) => {
    const novoVinculo = {
      id: Date.now() + Math.random(),
      paciente: escala.paciente,
      profissional: item.profissional,
      dia: item.dia,
      data: item.data,
      horario: item.horario,
      especialidade: item.especialidade,
      periodo: item.periodo
    }

    vinculos.push(novoVinculo)
  })

  renderizarVinculos()
  modalEscalas.style.display = "none"

  // Limpar escalas geradas
  escalasGeradas = []
}

// Renderizar vínculos na grade
function renderizarVinculos() {
  // Limpar todos os slots
  const slots = document.querySelectorAll(".slot-horario")
  slots.forEach((slot) => {
    slot.innerHTML = ""
  })

  // Filtrar vínculos da semana atual
  const vinculosSemana = vinculos.filter((vinculo) => {
    return datasVisiveis.some((data) => data.toISOString().split("T")[0] === vinculo.data)
  })

  // Renderizar vínculos
  vinculosSemana.forEach((vinculo) => {
    const dataVinculo = vinculo.data
    const slot = document.querySelector(
      `[data-dia="${vinculo.dia}"][data-horario="${vinculo.horario}"][data-data="${dataVinculo}"]`,
    )

    if (slot) {
      const vinculoCard = document.createElement("div")
      vinculoCard.className = "vinculo-card"

      const dataFormatada = new Date(vinculo.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
      const periodoIcon = vinculo.periodo === "manha" ? "🌅" : "🌆"

      vinculoCard.innerHTML = `
        <div class="vinculo-header">
          <span class="especialidade-badge">${vinculo.especialidade}</span>
          <button class="btn-danger" onclick="removerVinculo(${vinculo.id})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <div class="vinculo-profissional">${vinculo.profissional.nome}</div>
        <div class="vinculo-paciente">${vinculo.paciente.nome}</div>
        <div class="vinculo-data">${dataFormatada} ${periodoIcon}</div>
      `

      slot.appendChild(vinculoCard)
    }
  })
}

// Remover vínculo
function removerVinculo(vinculoId) {
  if (confirm("Tem certeza que deseja remover este vínculo?")) {
    vinculos = vinculos.filter((v) => v.id !== vinculoId)
    renderizarVinculos()
  }
}

// Salvar dados no localStorage
function salvarDados() {
  localStorage.setItem("pacientes", JSON.stringify(pacientes))
  localStorage.setItem("vinculos", JSON.stringify(vinculos))
  localStorage.setItem("profissionais", JSON.stringify(profissionais))
}

// Carregar dados do localStorage
function carregarDados() {
  const pacientesSalvos = localStorage.getItem("pacientes")
  const vinculosSalvos = localStorage.getItem("vinculos")
  const profissionaisSalvos = localStorage.getItem("profissionais")

  if (pacientesSalvos) {
    pacientes = JSON.parse(pacientesSalvos)
  }
  if (vinculosSalvos) {
    vinculos = JSON.parse(vinculosSalvos)
  }
  if (profissionaisSalvos) {
    profissionais = JSON.parse(profissionaisSalvos)
  }
}

// Salvar dados automaticamente
window.addEventListener("beforeunload", salvarDados)

// Carregar dados ao inicializar
// carregarDados(); // Descomente para ativar persistência