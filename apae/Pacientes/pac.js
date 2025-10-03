// --- VARIÁVEIS GLOBAIS PARA CONTROLE DE ID E CPF ---
let nextEmployeeId = 1; // Para gerar IDs sequenciais
const existingCPFs = new Set(); // Para armazenar CPFs já adicionados e verificar duplicidade (apenas dígitos)
// --- FIM DAS VARIÁVEIS GLOBAIS ---


document.addEventListener("DOMContentLoaded", () => {
    // Tab switching for sidebar (MANTIDO)
    const sidebarTabs = document.querySelectorAll(".sidebar-tab");
    const sidebarContents = document.querySelectorAll(".sidebar-content");

    sidebarTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const tabId = tab.getAttribute("data-tab");
            sidebarTabs.forEach((t) => t.classList.remove("active"));
            sidebarContents.forEach((content) => content.classList.remove("active"));
            tab.classList.add("active");
            document.getElementById(tabId).classList.add("active");
        });
    });

    // Employee form submission (MODIFICADO para ID e CPF)
    const employeeForm = document.getElementById("employee-form");
    employeeForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const status = document.getElementById("status").value;
        const name = document.getElementById("name").value;
        const cpf = document.getElementById("cpf").value;
        const phone = document.getElementById("phone").value;
        const CID = document.getElementById("CID").value;
        const responsavel = document.getElementById("responsavel").value;
        const email = document.getElementById("email").value;
        const address = document.getElementById("address").value;

        // --- Verificação de Duplicidade de CPF para Formulário Manual ---
        const cleanedCpf = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos para a verificação
        if (existingCPFs.has(cleanedCpf)) {
            alert(`Erro: Já existe um funcionário com o CPF ${formatCPF(cleanedCpf)} cadastrado.`);
            return; // Impede o envio do formulário
        }
        // --- Fim da Verificação de Duplicidade ---

        // Validação básica do formulário (mantida)
        if (!validateForm(name,status, cleanedCpf, phone,CID,responsavel,email,address)) {
            return;
        }

        // --- Geração do ID Sequencial para Formulário Manual ---
        const newId = nextEmployeeId++; // Atribui o ID atual e depois incrementa
        // --- Fim da Geração de ID ---

        // Adiciona funcionário à tabela
        addEmployeeToTable(newId, name,status, cpf, phone,CID,responsavel,email,address);

        // --- Adiciona o CPF ao Set de CPFs existentes após sucesso ---
        existingCPFs.add(cleanedCpf);
        // --- Fim da Adição de CPF ---

        // Limpa o formulário
        employeeForm.reset();
    });

    // CSV file selection (MANTIDO)
    const csvFileInput = document.getElementById("csv-file");
    const importBtn = document.getElementById("import-btn");
    const fileNameDisplay = document.getElementById("file-name");

    csvFileInput.addEventListener("change", function () {
        if (this.files.length > 0) {
            fileNameDisplay.textContent = `Arquivo selecionado: ${this.files[0].name}`;
            importBtn.disabled = false;
        } else {
            fileNameDisplay.textContent = "";
            importBtn.disabled = true;
        }
    });

    // CSV import (MANTIDO)
    importBtn.addEventListener("click", () => {
        const file = csvFileInput.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const csvData = e.target.result;
                processCSV(csvData); // Chama a função de processamento
            };

            reader.readAsText(file);
        }
    });

    // Input masks (MANTIDO)
    const cpfInput = document.getElementById("cpf");
    cpfInput.addEventListener("input", function () {
        this.value = formatCPF(this.value);
    });

    const phoneInput = document.getElementById("phone");
    phoneInput.addEventListener("input", function () {
        this.value = formatPhone(this.value);
    });
    
    // --- TRECHO DE CÓDIGO A SER ADICIONADO PARA O DOWNLOAD DO CSV ---
    const downloadCsvBtn = document.getElementById('download-csv-btn');
    if (downloadCsvBtn) {
        downloadCsvBtn.addEventListener('click', () => {
            // Define o cabeçalho e os dados de exemplo do CSV
            // O cabeçalho foi ajustado para corresponder ao novo formato
            const csvContent = "Status;Nome;CPF;Telefone;CID;Responsável;Email;Endereço\n" +
                               "1;João da Silva;12345678900;5511999998888;Autismo;Maria da Silva;joao.silva@email.com;Rua Exemplo\n" +
                               "1;Maria Souza;98765432100;5511888889999;Síndrome de Down;Pedro Souza;maria.souza@email.com;Avenida Exemplo";

            // Cria um Blob (Binary Large Object) com o conteúdo do CSV
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            
            // Cria um URL para o Blob
            const url = URL.createObjectURL(blob);
            
            // Cria um link temporário para iniciar o download
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', 'modelo_pacientes.csv');
            
            // Adiciona o link ao corpo do documento e simula o clique
            document.body.appendChild(link);
            link.click();
            
            // Remove o link após o download
            document.body.removeChild(link);
        });
    }
    // --- FIM DO TRECHO ---
});

// --- Funções Auxiliares ---

// Format CPF: 000.000.000-00
function formatCPF(value) {
    value = value.replace(/\D/g, ""); // Remove non-digits
    if (value.length > 11) value = value.substring(0, 11);
    if (value.length > 9) value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    else if (value.length > 6) value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    else if (value.length > 3) value = value.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    return value;
}

// Format phone: (00) 00000-0000
function formatPhone(value) {
    value = value.replace(/\D/g, ""); // Remove non-digits
    if (value.length > 11) value = value.substring(0, 11);
    if (value.length > 10) value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    else if (value.length > 6) value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    else if (value.length > 2) value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    return value;
}

function validateForm(status, name, cpf, phone, CID, responsavel, email, address) {
    if (!name.trim()) {
        alert("Nome é um campo obrigatório.");
        return false;
    }
    // A validação agora usa o CPF já limpo para comparar o tamanho
    if (cpf.length !== 11) {
        alert("CPF inválido. Deve conter 11 dígitos.");
        return false;
    }
    if (phone.replace(/\D/g, "").length < 10) {
        alert("Telefone inválido. Deve conter pelo menos 10 dígitos (com DDD).");
        return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Email inválido.");
        return false;
    }
    return true;
}

// Função para gerar bolinha de status
function getStatusBadge(status) {
    if (status === "1") { // Lógica ajustada para o novo padrão
        return `<span style="display:inline-block;width:12px;height:12px;background-color:green;border-radius:50%;"></span>`;
    } else if (status === "0") { // Lógica ajustada para o novo padrão
        return `<span style="display:inline-block;width:12px;height:12px;background-color:red;border-radius:50%;"></span>`;
    }
    return status;
}

// Adiciona funcionário à tabela
function addEmployeeToTable(id, name, status, cpf, phone, CID, responsavel, email, address) {
    const tableBody = document.querySelector("#employees-table tbody");
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td>${getStatusBadge(status)}</td>
        <td>${id}</td> 
        <td>${name}</td>
        <td>${cpf}</td>
        <td>${phone}</td>
        <td>${CID}</td>
        <td>${responsavel}</td>
        <td>${email}</td>
        <td>${address}</td>
    `;

    tableBody.appendChild(newRow);
}

// --- **Função de Processamento de CSV (Corrigida)** ---
function processCSV(csvData) {
    const lines = csvData.split(/\r?\n/);
    let successCount = 0;
    let errorCount = 0;
    let duplicateCount = 0; // Novo contador para CPFs duplicados
    let ignoredLinesCount = 0;

    const hasHeaderRow = true; // Altere para `false` se seu CSV não tiver cabeçalho
    const dataLinesToProcess = hasHeaderRow ? lines.slice(1) : lines;

    for (let i = 0; i < dataLinesToProcess.length; i++) {
        const currentLine = dataLinesToProcess[i].trim();

        if (currentLine === "") {
            ignoredLinesCount++;
            continue;
        }

        const values = parseCSVLine(currentLine);

        // Define um mapeamento explícito para as colunas do CSV
        const csvColumnMap = {
            status: values[0] ? values[0].trim() : '',
            name: values[1] ? values[1].trim() : '',
            cpf: values[2] ? values[2].trim() : '',
            phone: values[3] ? values[3].trim() : '',
            CID: values[4] ? values[4].trim() : '',
            responsavel: values[5] ? values[5].trim() : '',
            email: values[6] ? values[6].trim() : '',
            address: values[7] ? values[7].trim() : '',
        };

        // Confere se a linha tem as colunas esperadas
        if (values.length < 8) {
            console.warn(`Linha ${i + (hasHeaderRow ? 1 : 0) + 1} do CSV (${currentLine}) ignorada: Menos colunas do que o esperado (${values.length} < 8).`);
            errorCount++;
            continue;
        }
        
        // --- Verificação de Duplicidade de CPF para Importação CSV ---
        const cleanedCpf = csvColumnMap.cpf.replace(/\D/g, "");
        if (existingCPFs.has(cleanedCpf)) {
            console.warn(`Linha ${i + (hasHeaderRow ? 1 : 0) + 1} do CSV: CPF ${formatCPF(cleanedCpf)} já existe. Linha ignorada.`);
            duplicateCount++;
            continue; // Pula para a próxima linha se o CPF for duplicado
        }
        // --- Fim da Verificação de Duplicidade ---

        // Validação completa dos dados da linha CSV
        if (validateForm(csvColumnMap.status, csvColumnMap.name, cleanedCpf, csvColumnMap.phone, csvColumnMap.CID, csvColumnMap.responsavel, csvColumnMap.email, csvColumnMap.address)) {
            const formattedCPF = formatCPF(csvColumnMap.cpf);
            const formattedPhone = formatPhone(csvColumnMap.phone);

            // --- Geração do ID Sequencial para Importação CSV ---
            const newId = nextEmployeeId++; // Atribui o ID atual e depois incrementa
            // --- Fim da Geração de ID ---

            // A chamada corrigida para a função addEmployeeToTable
            addEmployeeToTable(newId, csvColumnMap.name, csvColumnMap.status, formattedCPF, formattedPhone, csvColumnMap.CID, csvColumnMap.responsavel, csvColumnMap.email, csvColumnMap.address);
            existingCPFs.add(cleanedCpf); // Adiciona CPF ao Set de CPFs existentes
            successCount++;
        } else {
            console.error(`Erro de validação na linha ${i + (hasHeaderRow ? 1 : 0) + 1} do CSV. Verifique os dados:`, { name: csvColumnMap.name, cpf: csvColumnMap.cpf, phone: csvColumnMap.phone, email: csvColumnMap.email, address: csvColumnMap.address });
            errorCount++;
        }
    }

    alert(`Importação concluída!\nRegistros importados: ${successCount}\nRegistros com erro: ${errorCount}\nRegistros duplicados (CPF): ${duplicateCount}\nLinhas ignoradas (em branco ou cabeçalho): ${ignoredLinesCount}`);

    document.getElementById("csv-file").value = "";
    document.getElementById("file-name").textContent = "";
    document.getElementById("import-btn").disabled = true;
}

// --- Função parseCSVLine (Corrigida para usar ponto e vírgula como delimitador) ---
function parseCSVLine(line) {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
             // Tratamento de aspas duplas dentro do texto
            if (i > 0 && line[i - 1] === '\\') { 
                 current += char;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ";" && !inQuotes) { // O DELIMITADOR É PONTO E VÍRGULA (;)
            result.push(current.trim());
            current = "";
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}
