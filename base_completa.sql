-- -----------------------------------------------------------------
-- TIPOS DE DADOS PERSONALIZADOS (ENUMS)
-- Garantem a consistência dos dados em todo o sistema.
-- -----------------------------------------------------------------
CREATE TYPE public.tipo_candidatura_enum AS ENUM (
    'Aberta',
    'Banco de Talentos'
);

CREATE TYPE public.status_contrato_enum AS ENUM (
    'Em Análise',
    'Aprovado',
    'Reprovado',
    'Pendente',
    'Pago',
    'Cancelado'
);


-- -----------------------------------------------------------------
-- TABELAS DE CONFIGURAÇÃO E ESTRUTURA BASE
-- -----------------------------------------------------------------
CREATE TABLE public.perfis (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    descricao TEXT
);
COMMENT ON TABLE public.perfis IS 'Armazena os papéis de utilizador (ex: Master, Coordenador, Supervisor).';

CREATE TABLE public.lojas (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    whatsapp TEXT,
    instagram_url TEXT
);
COMMENT ON TABLE public.lojas IS 'Contém a informação de todas as lojas físicas.';


-- -----------------------------------------------------------------
-- TABELAS DE RECURSOS HUMANOS E AUTENTICAÇÃO
-- -----------------------------------------------------------------
CREATE TABLE public.funcionarios (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    perfil_id BIGINT NOT NULL REFERENCES public.perfis(id),
    loja_id BIGINT REFERENCES public.lojas(id),
    gerente_id BIGINT REFERENCES public.funcionarios(id),
    nome_completo TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.funcionarios IS 'Registo de todos os funcionários com acesso ao sistema.';

CREATE TABLE public.coordenador_lojas (
    coordenador_id BIGINT NOT NULL REFERENCES public.funcionarios(id) ON DELETE CASCADE,
    loja_id BIGINT NOT NULL REFERENCES public.lojas(id) ON DELETE CASCADE,
    PRIMARY KEY (coordenador_id, loja_id)
);
COMMENT ON TABLE public.coordenador_lojas IS 'Mapeia quais lojas cada Coordenador supervisiona.';

CREATE TABLE public.vagas (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    loja_id BIGINT REFERENCES public.lojas(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    job_category public.tipo_candidatura_enum NOT NULL DEFAULT 'Aberta'::public.tipo_candidatura_enum
);
COMMENT ON TABLE public.vagas IS 'Contém todas as vagas de emprego, associadas a uma loja.';

CREATE TABLE public.candidatos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    vaga_id BIGINT REFERENCES public.vagas(id) ON DELETE CASCADE,
    funcionario_id BIGINT REFERENCES public.funcionarios(id) ON DELETE SET NULL,
    nome_completo TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    curriculo_url TEXT,
    status TEXT DEFAULT 'pendente'::TEXT,
    vaga TEXT,
    loja TEXT,
    city TEXT,
    tipo_candidatura public.tipo_candidatura_enum
);
COMMENT ON TABLE public.candidatos IS 'Dados dos candidatos que se aplicam às vagas.';


-- -----------------------------------------------------------------
-- TABELAS OPERACIONAIS: CLIENTES E CONTRATOS
-- -----------------------------------------------------------------
CREATE TABLE public.clientes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    consultor_id BIGINT NOT NULL REFERENCES public.funcionarios(id),
    loja_id BIGINT NOT NULL REFERENCES public.lojas(id),
    nome_completo TEXT NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    data_nascimento DATE,
    telefone VARCHAR(20),
    sexo VARCHAR(10),
    email TEXT,
    banco TEXT,
    agencia VARCHAR(10),
    conta VARCHAR(20),
    endereco_completo TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.clientes IS 'Armazena a carteira de clientes, cada um ligado a um consultor e loja.';

CREATE TABLE public.contratos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cliente_id BIGINT NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    consultor_id BIGINT NOT NULL REFERENCES public.funcionarios(id),
    backoffice_id BIGINT REFERENCES public.funcionarios(id),
    loja_id BIGINT NOT NULL REFERENCES public.lojas(id),
    data_contrato DATE NOT NULL DEFAULT CURRENT_DATE,
    status public.status_contrato_enum NOT NULL DEFAULT 'Em Análise'::public.status_contrato_enum,
    numero_beneficio TEXT,
    especie TEXT,
    prazo INT,
    valor_emprestimo NUMERIC(10, 2),
    valor_parcela NUMERIC(10, 2),
    valor_proposta NUMERIC(10, 2),
    observacoes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
COMMENT ON TABLE public.contratos IS 'Regista todas as propostas e contratos de empréstimo.';


-- -----------------------------------------------------------------
-- DADOS INICIAIS
-- -----------------------------------------------------------------
INSERT INTO public.perfis (nome, descricao) VALUES
    ('Master', 'Acesso total ao sistema.'),
    ('Coordenador', 'Acesso às informações das suas franquias (lojas).'),
    ('Supervisor', 'Acesso às informações da sua loja.'),
    ('Consultor', 'Acesso apenas às suas informações de vendas e propostas.'),
    ('BackOffice', 'Acesso às funcionalidades de cadastro de propostas.');


-- -----------------------------------------------------------------
-- POLÍTICAS DE SEGURANÇA (ROW LEVEL SECURITY - RLS)
-- -----------------------------------------------------------------
-- Ativa o RLS em todas as tabelas
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lojas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coordenador_lojas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vagas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contratos ENABLE ROW LEVEL SECURITY;

-- Políticas para acesso público (site)
CREATE POLICY "Permitir leitura pública de lojas" ON public.lojas FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de vagas ativas" ON public.vagas FOR SELECT USING (is_active = true);
CREATE POLICY "Permitir inserção pública de candidatos" ON public.candidatos FOR INSERT WITH CHECK (true);

-- Políticas para acesso interno (utilizadores autenticados)
CREATE POLICY "Permitir acesso total para utilizadores autenticados em perfis" ON public.perfis FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir acesso total para utilizadores autenticados em coordenador_lojas" ON public.coordenador_lojas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir acesso total para utilizadores autenticados em vagas" ON public.vagas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir acesso total para utilizadores autenticados em candidatos" ON public.candidatos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir acesso total para utilizadores autenticados em clientes" ON public.clientes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir acesso total para utilizadores autenticados em contratos" ON public.contratos FOR ALL USING (auth.role() = 'authenticated');

-- Políticas específicas para FUNCIONÁRIOS
CREATE POLICY "Permitir manipulação (exceto exclusão) de funcionários"
    ON public.funcionarios FOR SELECT, INSERT, UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Impedir exclusão física de funcionários"
    ON public.funcionarios FOR DELETE
    USING (false);
