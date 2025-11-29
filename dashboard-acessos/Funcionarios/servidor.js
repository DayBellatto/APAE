const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const { Pool } = require("pg")

const app = express()
const port = 3000

const pool = new Pool({
  user: "seu_usuario",
  host: "localhost",
  database: "sua_base",
  password: "sua_senha",
  port: 5432,
})

app.use(cors())
app.use(bodyParser.json())

app.post("/api/funcionarios", async (req, res) => {
  const { cpf, nome, telefone, telefone_recado, email, endereco, funcao, especialidade, ativo } = req.body

  try {
    const result = await pool.query(
      `INSERT INTO funcionarios (cpf, nome, telefone, telefone_recado, email, endereco, funcao, especialidade, ativo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [cpf, nome, telefone, telefone_recado, email, endereco, funcao, especialidade, ativo],
    )

    res.status(201).json({
      message: "Funcionário cadastrado com sucesso!",
      id: result.rows[0].id,
    })
  } catch (err) {
    console.error("Erro ao inserir funcionário:", err)
    res.status(500).json({ error: "Erro ao inserir funcionário no banco de dados" })
  }
})

app.get("/api/funcionarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM funcionarios ORDER BY id ASC")
    res.json(result.rows)
  } catch (err) {
    console.error("Erro ao buscar funcionários:", err)
    res.status(500).json({ error: "Erro ao buscar funcionários" })
  }
})

app.put("/api/funcionarios/:id", async (req, res) => {
  const { id } = req.params
  const { cpf, nome, telefone, telefone_recado, email, endereco, funcao, especialidade, ativo } = req.body

  try {
    await pool.query(
      `UPDATE funcionarios SET cpf = $1, nome = $2, telefone = $3, telefone_recado = $4, 
       email = $5, endereco = $6, funcao = $7, especialidade = $8, ativo = $9 
       WHERE id = $10`,
      [cpf, nome, telefone, telefone_recado, email, endereco, funcao, especialidade, ativo, id],
    )

    res.json({ message: "Funcionário atualizado com sucesso!" })
  } catch (err) {
    console.error("Erro ao atualizar funcionário:", err)
    res.status(500).json({ error: "Erro ao atualizar funcionário" })
  }
})

app.delete("/api/funcionarios/:id", async (req, res) => {
  const { id } = req.params

  try {
    await pool.query("DELETE FROM funcionarios WHERE id = $1", [id])
    res.json({ message: "Funcionário removido com sucesso!" })
  } catch (err) {
    console.error("Erro ao remover funcionário:", err)
    res.status(500).json({ error: "Erro ao remover funcionário" })
  }
})

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})
