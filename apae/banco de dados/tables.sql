-- Tabela de Usuários (Login do sistema)
CREATE TABLE usuarios (
    cpf VARCHAR(14) PRIMARY KEY,
    id_sequence SERIAL UNIQUE,
    nome VARCHAR(100),
    endereco VARCHAR(200),
    telefone VARCHAR(20),
    login VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    status_ativo CHAR(1) CHECK (status_ativo IN ('S', 'N')),
    telas_acesso TEXT
);

-- Tabela de Funcionários
CREATE TABLE funcionarios (
    cpf VARCHAR(14) PRIMARY KEY,
    id_sequence SERIAL UNIQUE,
    nome VARCHAR(100),
    telefone VARCHAR(20),
    telefone_recado VARCHAR(20),
    email VARCHAR(100),
    endereco VARCHAR(200),
    funcao VARCHAR(50),
    especialidade VARCHAR(100),
    ativo CHAR(1) CHECK (ativo IN ('S', 'N'))
);

-- Tabela de Pacientes
CREATE TABLE pacientes (
    cpf VARCHAR(14) PRIMARY KEY,
    id_sequence SERIAL UNIQUE,
    nome VARCHAR(100),
    telefone VARCHAR(20),
    telefone_recado VARCHAR(20),
    email VARCHAR(100),
    endereco VARCHAR(200),
    tipo_necessidade VARCHAR(100),
    responsavel VARCHAR(100),
    telefone_responsavel VARCHAR(20),
    ativo CHAR(1) CHECK (ativo IN ('S', 'N'))
);

-- Tabela de Escalas
CREATE TABLE escala (
    id_sequence SERIAL PRIMARY KEY,
    cpf_especialista VARCHAR(14),
    nome_especialista VARCHAR(100),
    cpf_paciente VARCHAR(14),
    nome_paciente VARCHAR(100),
    dia_atendimento DATE,
    horario TIME,
    especialidade VARCHAR(100),
    ativo CHAR(1) CHECK (ativo IN ('S', 'N')),

    CONSTRAINT fk_especialista FOREIGN KEY (cpf_especialista) REFERENCES funcionarios(cpf),
    CONSTRAINT fk_paciente FOREIGN KEY (cpf_paciente) REFERENCES pacientes(cpf)
);
