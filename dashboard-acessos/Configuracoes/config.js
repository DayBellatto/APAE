// config.js atualizado

let employees = [];

// --- Adicionado: Lógica para alternar as abas do sidebar ---
document.addEventListener("DOMContentLoaded", () => {
  const sidebarTabs = document.querySelectorAll(".sidebar-tab");
  const sidebarContents = document.querySelectorAll(".sidebar-content");
  const employeeForm = document.getElementById("employee-form");

  sidebarTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabId = tab.getAttribute("data-tab");

      // Remove a classe 'active' de todas as abas e conteúdos
      sidebarTabs.forEach((t) => t.classList.remove("active"));
      sidebarContents.forEach((content) => content.classList.remove("active"));

      // Adiciona a classe 'active' apenas na aba clicada e no conteúdo correspondente
      tab.classList.add("active");
      document.getElementById(tabId).classList.add("active");
    });
  });

  // --- Lógica de submissão do formulário (restante do seu código) ---
  employeeForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
      name: document.getElementById("name").value,
      cpf: document.getElementById("cpf").value,
      login: document.getElementById("login").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      address: document.getElementById("address").value,
      status: document.getElementById("status").value,
      accessScreens: Array.from(
        document.querySelectorAll('input[name="access_screens"]:checked')
      ).map((cb) => cb.value),
    };

    saveEmployee(formData);
    this.reset();
    delete this.dataset.editingCpf;
  });

  // Importação via CSV
  document.getElementById("import-btn").addEventListener("click", () => {
    const fileInput = document.getElementById("csv-file");
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const csvData = e.target.result;
        parseCSV(csvData);
      };
      reader.readAsText(file);
    }
  });
});

// --- Funções auxiliares (restante do seu código) ---

function addEmployeeToTable(employee) {
  const tableBody = document.querySelector("#employees-table tbody");
  const newRow = document.createElement("tr");

  // Altera a forma de obter os nomes das telas de acesso
  const accessScreensMap = {
    "1": "Dashboard",
    "2": "Escalas",
    "3": "Funcionários",
    "4": "Pacientes",
    "5": "Configurações",
  };
  const accessScreensText = (employee.accessScreens || []).map(val => accessScreensMap[val] || val).join(", ");

  const statusBadge =
    employee.status === "ativo"
      ? `<span class="status-badge ativo"></span>`
      : `<span class="status-badge inativo"></span>`;

  const toggleButtonClass =
    employee.status === "ativo" ? "btn-inactivate" : "btn-activate";
  const toggleButtonText =
    employee.status === "ativo" ? "Inativar" : "Ativar";

  newRow.innerHTML = `
    <td>${statusBadge}</td>
    <td>${employee.name}</td>
    <td>${employee.cpf}</td>
    <td>${employee.login}</td>
    <td>${employee.phone}</td>
    <td>${employee.email}</td>
    <td>${employee.address}</td>
    <td class="access-screens">${accessScreensText}</td>
    <td>
        <button class="btn btn-small btn-edit" onclick="openEditModal('${employee.cpf}')">Editar</button>
        <button class="btn btn-small ${toggleButtonClass}" onclick="toggleEmployeeStatus('${employee.cpf}')">${toggleButtonText}</button>
    </td>
  `;

  tableBody.appendChild(newRow);
}

function saveEmployee(formData) {
  const existingEmployeeIndex = employees.findIndex(
    (emp) => emp.cpf === formData.cpf
  );

  if (existingEmployeeIndex >= 0) {
    employees[existingEmployeeIndex] = formData;
  } else {
    employees.push(formData);
  }
  refreshEmployeeTable();
}

function refreshEmployeeTable() {
  const tableBody = document.querySelector("#employees-table tbody");
  tableBody.innerHTML = "";
  employees.forEach((emp) => addEmployeeToTable(emp));
}

function toggleEmployeeStatus(cpf) {
  const employee = employees.find((emp) => emp.cpf === cpf);
  if (employee) {
    employee.status = employee.status === "ativo" ? "inativo" : "ativo";
    refreshEmployeeTable();
  }
}

function openEditModal(cpf) {
  const employee = employees.find((emp) => emp.cpf === cpf);
  if (!employee) return;

  document.getElementById("name").value = employee.name;
  document.getElementById("cpf").value = employee.cpf;
  document.getElementById("login").value = employee.login;
  document.getElementById("phone").value = employee.phone;
  document.getElementById("email").value = employee.email;
  document.getElementById("address").value = employee.address;
  document.getElementById("status").value = employee.status;

  const checkboxes = document.querySelectorAll(
    "input[name='access_screens']"
  );
  checkboxes.forEach((cb) => {
    cb.checked = employee.accessScreens.includes(cb.value);
  });

  document.getElementById("employee-form").dataset.editingCpf = employee.cpf;
}

// Importação via CSV
function parseCSV(csvData) {
  const lines = csvData.split("\n");
  lines.forEach((line, index) => {
    if (index === 0 || !line.trim()) return;
    const [name, cpf, login, phone, email, address, status, access] = line.split(",");
    
    // Converte os números de acesso para os nomes das telas
    const accessScreens = access
      .split(";")
      .map((a) => a.trim()) // Remove espaços em branco
      .filter(Boolean); // Remove valores vazios

    const formData = {
      name,
      cpf,
      login,
      phone,
      email,
      address,
      status: status === "Ativo" ? "ativo" : "inativo", // Ajuste para "Ativo" no CSV
      accessScreens,
    };

    saveEmployee(formData);
  });
}