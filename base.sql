-- =================================================================
-- === SCRIPT COMPLETO DO BANCO DE DADOS - Job Recruitment System ===
-- =================================================================

-- DROP SCHEMA public CASCADE; -- Descomente para apagar tudo e recomeçar
-- CREATE SCHEMA public;

-- -----------------------------------------------------------------
-- TIPO DE DADOS PERSONALIZADO (ENUM)
-- Garante a consistência dos dados para categorias de vagas e candidaturas.
-- -----------------------------------------------------------------
CREATE TYPE public.tipo_candidatura_enum AS ENUM (
    'Aberta',
    'Banco de Talentos'
);


-- -----------------------------------------------------------------
-- TABELA 1: lojas
-- Contém a informação de todas as lojas físicas.
-- -----------------------------------------------------------------
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


-- -----------------------------------------------------------------
-- TABELA 2: vagas
-- Contém todas as vagas de emprego, associadas a uma loja.
-- -----------------------------------------------------------------
CREATE TABLE public.vagas (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    loja_id BIGINT,
    title TEXT NOT NULL,
    storename TEXT,
    city TEXT,
    state TEXT,
    type TEXT,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    inactivated_at TIMESTAMPTZ,
    job_category public.tipo_candidatura_enum NOT NULL DEFAULT 'Aberta'::public.tipo_candidatura_enum, -- Usa o tipo ENUM com valor padrão
    
    CONSTRAINT fk_loja
        FOREIGN KEY(loja_id) 
        REFERENCES public.lojas(id)
        ON DELETE SET NULL
);


-- -----------------------------------------------------------------
-- TABELA 3: candidatos
-- Contém os dados dos candidatos que se aplicam às vagas.
-- -----------------------------------------------------------------
CREATE TABLE public.candidatos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    vaga_id BIGINT,
    nome_completo TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    curriculo_url TEXT,
    status TEXT DEFAULT 'pendente'::TEXT,
    vaga TEXT,
    loja TEXT,
    city TEXT,
    tipo_candidatura public.tipo_candidatura_enum, -- Usa o tipo ENUM

    CONSTRAINT fk_vaga
        FOREIGN KEY(vaga_id) 
        REFERENCES public.vagas(id)
        ON DELETE CASCADE
);


-- -----------------------------------------------------------------
-- POLÍTICAS DE SEGURANÇA (ROW LEVEL SECURITY - RLS)
-- Controla quem pode ver e modificar os dados.
-- -----------------------------------------------------------------

-- Habilita o RLS em todas as tabelas
ALTER TABLE public.lojas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vagas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidatos ENABLE ROW LEVEL SECURITY;

-- Permissões para o site público (acesso anónimo)
CREATE POLICY "Permitir leitura pública de lojas" ON public.lojas FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de vagas ativas" ON public.vagas FOR SELECT USING (is_active = true);
CREATE POLICY "Permitir inserção pública de candidatos" ON public.candidatos FOR INSERT WITH CHECK (true);

-- Permissões para o painel de administração (utilizadores autenticados)
CREATE POLICY "Permitir acesso total para utilizadores autenticados em lojas" ON public.lojas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir acesso total para utilizadores autenticados em vagas" ON public.vagas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir acesso total para utilizadores autenticados em candidatos" ON public.candidatos FOR ALL USING (auth.role() = 'authenticated');