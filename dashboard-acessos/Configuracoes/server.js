const express = require("express")
const { Pool } = require("pg")
const cors = require("cors")
const path = require("path")

const app = express()
const port = 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

// PostgreSQL connection configuration
// CONFIGURE AQUI SUA CONEXÃO COM O BANCO POSTGRESQL
const pool = new Pool({
  user: "apae", // Substitua pelo seu usuário do PostgreSQL
  host: "localhost", // Substitua pelo host do seu banco
  database: "PostgreSQL", // Substitua pelo nome do seu banco
  password: "adm", // Substitua pela sua senha
  port: 5432, // Porta padrão do PostgreSQL
})

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Erro ao conectar com o banco de dados:", err)
  } else {
    console.log("Conectado ao banco PostgreSQL com sucesso!")
    release()
  }
})

// Create employees table if it doesn't exist
async function createTable() {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS employees (
            cpf VARCHAR(14) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            login VARCHAR(100) UNIQUE NOT NULL,
            phone VARCHAR(20) NOT NULL,
            email VARCHAR(255) NOT NULL,
            address TEXT NOT NULL,
            status VARCHAR(10) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
            access_screens TEXT[],
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `

  try {
    await pool.query(createTableQuery)
    console.log("Tabela employees criada/verificada com sucesso!")
  } catch (err) {
    console.error("Erro ao criar tabela:", err)
  }
}

createTable()

// Routes

// Get all employees
app.get("/api/employees", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM employees ORDER BY name")
    res.json(result.rows)
  } catch (err) {
    console.error("Erro ao buscar funcionários:", err)
    res.status(500).json({ error: "Erro interno do servidor" })
  }
})

// Get employee by CPF
app.get("/api/employees/:cpf", async (req, res) => {
  const { cpf } = req.params

  try {
    const result = await pool.query("SELECT * FROM employees WHERE cpf = $1", [cpf])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Funcionário não encontrado" })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error("Erro ao buscar funcionário:", err)
    res.status(500).json({ error: "Erro interno do servidor" })
  }
})

// Create new employee
app.post("/api/employees", async (req, res) => {
  const { name, cpf, login, phone, email, address, status, access_screens } = req.body

  // Validation
  if (!name || !cpf || !login || !phone || !email || !address) {
    return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos" })
  }

  // Clean CPF for validation
  const cleanCpf = cpf.replace(/\D/g, "")
  if (cleanCpf.length !== 11) {
    return res.status(400).json({ error: "CPF deve conter 11 dígitos" })
  }

  try {
    const insertQuery = `
            INSERT INTO employees (cpf, name, login, phone, email, address, status, access_screens)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `

    const values = [cpf, name, login, phone, email, address, status || "ativo", access_screens || []]
    const result = await pool.query(insertQuery, values)

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error("Erro ao criar funcionário:", err)

    if (err.code === "23505") {
      // Unique violation
      if (err.constraint === "employees_pkey") {
        return res.status(400).json({ error: "CPF já cadastrado" })
      } else if (err.constraint === "employees_login_key") {
        return res.status(400).json({ error: "Login já existe" })
      }
    }

    res.status(500).json({ error: "Erro interno do servidor" })
  }
})

// Update employee
app.put("/api/employees/:cpf", async (req, res) => {
  const { cpf } = req.params
  const { name, login, phone, email, address, status, access_screens } = req.body

  try {
    const updateQuery = `
            UPDATE employees 
            SET name = $1, login = $2, phone = $3, email = $4, address = $5, 
                status = $6, access_screens = $7, updated_at = CURRENT_TIMESTAMP
            WHERE cpf = $8
            RETURNING *
        `

    const values = [name, login, phone, email, address, status, access_screens, cpf]
    const result = await pool.query(updateQuery, values)

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Funcionário não encontrado" })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error("Erro ao atualizar funcionário:", err)

    if (err.code === "23505" && err.constraint === "employees_login_key") {
      return res.status(400).json({ error: "Login já existe" })
    }

    res.status(500).json({ error: "Erro interno do servidor" })
  }
})

// Delete employee
app.delete("/api/employees/:cpf", async (req, res) => {
  const { cpf } = req.params

  try {
    const result = await pool.query("DELETE FROM employees WHERE cpf = $1 RETURNING *", [cpf])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Funcionário não encontrado" })
    }

    res.json({ message: "Funcionário excluído com sucesso" })
  } catch (err) {
    console.error("Erro ao excluir funcionário:", err)
    res.status(500).json({ error: "Erro interno do servidor" })
  }
})

// Serve the main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})
