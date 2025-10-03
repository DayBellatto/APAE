// --- VARIÁVEIS GLOBAIS PARA CONTROLE DE ID E CPF ---
let nextEmployeeId = 1
const existingCPFs = new Set()
const employees = [] // Array to store all employee data for export
// --- FIM DAS VARIÁVEIS GLOBAIS ---

document.addEventListener("DOMContentLoaded", () => {
  // Tab switching for sidebar
  const sidebarTabs = document.querySelectorAll(".sidebar-tab")
  const sidebarContents = document.querySelectorAll(".sidebar-content")

  sidebarTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabId = tab.getAttribute("data-tab")
      sidebarTabs.forEach((t) => t.classList.remove("active"))
      sidebarContents.forEach((content) => content.classList.remove("active"))
      tab.classList.add("active")
      document.getElementById(tabId).classList.add("active")
    })
  })

  const employeeForm = document.getElementById("employee-form")
  employeeForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const name = document.getElementById("name").value
    const cpf = document.getElementById("cpf").value
    const phone = document.getElementById("phone").value
    const phoneRecado = document.getElementById("phone-recado").value
    const funcao = document.getElementById("funcao").value
    const especialidade = document.getElementById("especialidade").value
    const email = document.getElementById("email").value
    const address = document.getElementById("address").value
    const status = document.getElementById("status").value

    // Verificação de duplicidade de CPF
    const cleanedCpf = cpf.replace(/\D/g, "")
    if (existingCPFs.has(cleanedCpf)) {
      alert(`Erro: Já existe um funcionário com o CPF ${formatCPF(cleanedCpf)} cadastrado.`)
      return
    }

    // Validação básica do formulário
    if (!validateForm(name, cpf, phone, email)) {
      return
    }

    const newId = nextEmployeeId++
    const employeeData = {
      id: newId,
      name,
      cpf,
      phone,
      phoneRecado,
      funcao,
      especialidade,
      email,
      address,
      status: Number.parseInt(status),
    }

    try {
      await sendToDatabase(employeeData)

      // Add to table and local storage
      addEmployeeToTable(employeeData)
      employees.push(employeeData)
      existingCPFs.add(cleanedCpf)

      // Clear form
      employeeForm.reset()
      alert("Funcionário cadastrado com sucesso!")
    } catch (error) {
      console.error("Erro ao cadastrar funcionário:", error)
      alert("Erro ao cadastrar funcionário. Verifique a conexão com o servidor.")
    }
  })

  // CSV file selection
  const csvFileInput = document.getElementById("csv-file")
  const importBtn = document.getElementById("import-btn")
  const fileNameDisplay = document.getElementById("file-name")

  csvFileInput.addEventListener("change", function () {
    if (this.files.length > 0) {
      fileNameDisplay.textContent = `Arquivo selecionado: ${this.files[0].name}`
      importBtn.disabled = false
    } else {
      fileNameDisplay.textContent = ""
      importBtn.disabled = true
    }
  })

  importBtn.addEventListener("click", () => {
    const file = csvFileInput.files[0]
    if (file) {
      const reader = new FileReader()

      reader.onload = (e) => {
        const csvData = e.target.result
        processCSV(csvData)
      }

      reader.readAsText(file)
    }
  })

  const exportBtn = document.getElementById("export-csv-btn")
  exportBtn.addEventListener("click", () => {
    exportToCSV()
  })

  // Input masks
  const cpfInput = document.getElementById("cpf")
  cpfInput.addEventListener("input", function () {
    this.value = formatCPF(this.value)
  })

  const phoneInput = document.getElementById("phone")
  phoneInput.addEventListener("input", function () {
    this.value = formatPhone(this.value)
  })

  const phoneRecadoInput = document.getElementById("phone-recado")
  phoneRecadoInput.addEventListener("input", function () {
    this.value = formatPhone(this.value)
  })
})

    // --- TRECHO DE CÓDIGO A SER ADICIONADO PARA O DOWNLOAD DO CSV ---
    const downloadCsvBtn = document.getElementById('download-csv-btn');
    if (downloadCsvBtn) {
        downloadCsvBtn.addEventListener('click', () => {
            // Define o cabeçalho e os dados de exemplo do CSV
            // O cabeçalho foi ajustado para corresponder ao novo formato
            const csvContent = "Status;Nome;CPF;Telefone;Funcao;Especialidade;Email;Endereco\n" +
                               "1;Heloisa da Silva;12345678900;5511999998888;Fono;Medica;heloisa.silva@email.com;Rua Exemplo";

            // Cria um Blob (Binary Large Object) com o conteúdo do CSV
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            
            // Cria um URL para o Blob
            const url = URL.createObjectURL(blob);
            
            // Cria um link temporário para iniciar o download
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', 'modelo_especialistas.csv');
            
            // Adiciona o link ao corpo do documento e simula o clique
            document.body.appendChild(link);
            link.click();
            
            // Remove o link após o download
            document.body.removeChild(link);
        });
    }

async function sendToDatabase(employeeData) {
  const response = await fetch("http://localhost:3000/api/funcionarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cpf: employeeData.cpf.replace(/\D/g, ""),
      nome: employeeData.name,
      telefone: employeeData.phone,
      telefone_recado: employeeData.phoneRecado,
      email: employeeData.email,
      endereco: employeeData.address,
      funcao: employeeData.funcao,
      especialidade: employeeData.especialidade,
      ativo: employeeData.status,
    }),
  })

  if (!response.ok) {
    throw new Error("Erro ao inserir funcionário no banco de dados")
  }

  return response.json()
}

// Format CPF: 000.000.000-00
function formatCPF(value) {
  value = value.replace(/\D/g, "")
  if (value.length > 11) value = value.substring(0, 11)
  if (value.length > 9) value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  else if (value.length > 6) value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3")
  else if (value.length > 3) value = value.replace(/(\d{3})(\d{1,3})/, "$1.$2")
  return value
}

// Format phone: (00) 00000-0000
function formatPhone(value) {
  value = value.replace(/\D/g, "")
  if (value.length > 11) value = value.substring(0, 11)
  if (value.length > 10) value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  else if (value.length > 6) value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3")
  else if (value.length > 2) value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2")
  return value
}

// Validate form inputs
function validateForm(name, cpf, phone, email) {
  if (!name.trim()) {
    alert("Nome é um campo obrigatório.")
    return false
  }
  if (cpf.replace(/\D/g, "").length !== 11) {
    alert("CPF inválido. Deve conter 11 dígitos.")
    return false
  }
  if (phone.replace(/\D/g, "").length < 10) {
    alert("Telefone inválido. Deve conter pelo menos 10 dígitos (com DDD).")
    return false
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Email inválido.")
    return false
  }
  return true
}

function addEmployeeToTable(employeeData) {
  const tableBody = document.querySelector("#employees-table tbody")
  const newRow = document.createElement("tr")

  const statusText = employeeData.status === 1 ? "Ativo" : "Inativo"
  const statusClass = employeeData.status === 1 ? "status-active" : "status-inactive"

  newRow.innerHTML = `
        <td>${employeeData.id}</td>
        <td class="${statusClass}">${statusText}</td>
        <td>${employeeData.name}</td>
        <td>${employeeData.cpf}</td>
        <td>${employeeData.phone}</td>
        <td>${employeeData.phoneRecado || "-"}</td>
        <td>${employeeData.funcao}</td>
        <td>${employeeData.especialidade}</td>
        <td>${employeeData.email}</td>
        <td>${employeeData.address}</td>
    `

  tableBody.appendChild(newRow)
}

async function processCSV(csvData) {
  const lines = csvData.split(/\r?\n/)
  let successCount = 0
  let errorCount = 0
  let duplicateCount = 0
  let ignoredLinesCount = 0

  const hasHeaderRow = true
  const dataLinesToProcess = hasHeaderRow ? lines.slice(1) : lines

  for (let i = 0; i < dataLinesToProcess.length; i++) {
    const currentLine = dataLinesToProcess[i].trim()

    if (currentLine === "") {
      ignoredLinesCount++
      continue
    }

    const values = parseCSVLine(currentLine)

    if (values.length < 8) {
      console.warn(`Linha ${i + (hasHeaderRow ? 1 : 0) + 1} do CSV ignorada: Menos colunas do que o esperado.`)
      errorCount++
      continue
    }

    const name = values[0] ? values[0].trim() : ""
    const cpf = values[1] ? values[1].trim() : ""
    const phone = values[2] ? values[2].trim() : ""
    const phoneRecado = values[3] ? values[3].trim() : ""
    const funcao = values[4] ? values[4].trim() : ""
    const especialidade = values[5] ? values[5].trim() : ""
    const email = values[6] ? values[6].trim() : ""
    const address = values[7] ? values[7].trim() : ""
    const status = values[8] ? Number.parseInt(values[8].trim()) : 1 // Default to active

    // Verificação de duplicidade de CPF
    const cleanedCpf = cpf.replace(/\D/g, "")
    if (existingCPFs.has(cleanedCpf)) {
      console.warn(
        `Linha ${i + (hasHeaderRow ? 1 : 0) + 1} do CSV: CPF ${formatCPF(cleanedCpf)} já existe. Linha ignorada.`,
      )
      duplicateCount++
      continue
    }

    // Validação dos dados
    if (validateForm(name, cpf, phone, email)) {
      const formattedCPF = formatCPF(cpf)
      const formattedPhone = formatPhone(phone)
      const formattedPhoneRecado = phoneRecado ? formatPhone(phoneRecado) : ""

      const newId = nextEmployeeId++
      const employeeData = {
        id: newId,
        name,
        cpf: formattedCPF,
        phone: formattedPhone,
        phoneRecado: formattedPhoneRecado,
        funcao,
        especialidade,
        email,
        address,
        status: status,
      }

      try {
        await sendToDatabase(employeeData)

        // Add to table and local storage
        addEmployeeToTable(employeeData)
        employees.push(employeeData)
        existingCPFs.add(cleanedCpf)
        successCount++
      } catch (error) {
        console.error(`Erro ao inserir funcionário da linha ${i + (hasHeaderRow ? 1 : 0) + 1}:`, error)
        errorCount++
      }
    } else {
      console.error(`Erro de validação na linha ${i + (hasHeaderRow ? 1 : 0) + 1} do CSV.`)
      errorCount++
    }
  }

  alert(
    `Importação concluída!\nRegistros importados: ${successCount}\nRegistros com erro: ${errorCount}\nRegistros duplicados (CPF): ${duplicateCount}\nLinhas ignoradas: ${ignoredLinesCount}`,
  )

  document.getElementById("csv-file").value = ""
  document.getElementById("file-name").textContent = ""
  document.getElementById("import-btn").disabled = true
}

function exportToCSV() {
  if (employees.length === 0) {
    alert("Não há dados para exportar.")
    return
  }

  const headers = [
    "Nome",
    "CPF",
    "Telefone",
    "Telefone Recado",
    "Função",
    "Especialidade",
    "Email",
    "Endereço",
    "Status",
  ]
  const csvContent = [
    headers.join(","),
    ...employees.map((emp) =>
      [
        `"${emp.name}"`,
        `"${emp.cpf}"`,
        `"${emp.phone}"`,
        `"${emp.phoneRecado || ""}"`,
        `"${emp.funcao}"`,
        `"${emp.especialidade}"`,
        `"${emp.email}"`,
        `"${emp.address}"`,
        emp.status,
      ].join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `funcionarios_${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function parseCSVLine(line) {
  const result = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      if (i > 0 && line[i - 1] === "\\") {
        current += char
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}
