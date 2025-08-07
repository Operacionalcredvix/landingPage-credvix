-- 1. Tabela 'lojas'
-- Esta tabela será a fonte única de informação sobre cada loja.
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

-- 2. Tabela 'vagas'
-- Contém todas as vagas e se relaciona diretamente com a tabela 'lojas'.
CREATE TABLE public.vagas (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    loja_id BIGINT, -- Chave Estrangeira que aponta para a loja
    title TEXT NOT NULL,
    storename TEXT, -- Mantido para compatibilidade, mas a relação é com loja_id
    city TEXT, -- Mantido para compatibilidade
    state TEXT, -- Mantido para compatibilidade
    type TEXT,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    inactivated_at TIMESTAMPTZ,
    job_category TEXT NOT NULL DEFAULT 'Aberta'::TEXT,
    
    -- Definição da Relação (Chave Estrangeira)
    CONSTRAINT fk_loja
        FOREIGN KEY(loja_id) 
        REFERENCES public.lojas(id)
        ON DELETE SET NULL -- Se uma loja for deletada, a vaga não será, mas o campo loja_id ficará nulo.
);

-- 3. Tabela 'candidatos'
-- Contém os candidatos e se relaciona com a tabela 'vagas'.
CREATE TABLE public.candidatos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    vaga_id BIGINT, -- Chave Estrangeira que aponta para a vaga
    nome_completo TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    curriculo_url TEXT,
    status TEXT DEFAULT 'pendente'::TEXT,
    vaga TEXT, -- Mantido para guardar o título da vaga no momento da candidatura
    loja TEXT, -- Mantido para guardar o nome da loja no momento da candidatura
    city TEXT, -- Mantido para guardar o nome da cidade no momento da candidatura
    tipo_candidatura TEXT, -- NOVA COLUNA: para 'Vaga Aberta' ou 'Banco de Talentos'

    -- Definição da Relação (Chave Estrangeira)
    CONSTRAINT fk_vaga
        FOREIGN KEY(vaga_id) 
        REFERENCES public.vagas(id)
        ON DELETE CASCADE -- Se uma vaga for deletada, todos os candidatos a ela também serão.
);

-- Habilita a segurança a nível de linha (RLS) para as novas tabelas (Boa Prática)
ALTER TABLE public.lojas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vagas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidatos ENABLE ROW LEVEL SECURITY;

-- Cria políticas de acesso público para leitura (SELECT) e escrita (INSERT)
-- Isso permite que seu site público leia as lojas/vagas e envie currículos.
CREATE POLICY "Permitir leitura pública de lojas" ON public.lojas FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de vagas" ON public.vagas FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública de candidatos" ON public.candidatos FOR INSERT WITH CHECK (true);

-- Permite acesso total a quem estiver logado no sistema (admin)
CREATE POLICY "Permitir acesso total para usuários autenticados em lojas" ON public.lojas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir acesso total para usuários autenticados em vagas" ON public.vagas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir acesso total para usuários autenticados em candidatos" ON public.candidatos FOR ALL USING (auth.role() = 'authenticated');