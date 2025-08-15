-- =================================================================
-- ===      SCRIPT SQL DEFINITIVO E CONSOLIDADO - CREDVIX SYSTEM   ===
-- ===        (Otimizado para Performance, Segurança e Futuro)     ===
-- =================================================================
-- Versão: 6.0 - Final com Vagas por Localidade
-- Instruções: Execute cada ETAPA na ordem, uma de cada vez.
-- =================================================================

-- ETAPA 1: PREPARAÇÃO DO AMBIENTE E TIPOS DE DADOS
-- Descrição: Cria os tipos de dados personalizados que garantirão a
-- consistência em campos críticos do sistema.
-- -----------------------------------------------------------------

CREATE TYPE public.origem_dados_enum AS ENUM (
    'Backoffice Manual',
    'Importacao BMG',
    'Outra Importacao'
);

CREATE TYPE public.status_contrato_enum AS ENUM (
    'Em Análise',
    'Aprovado',
    'Reprovado',
    'Pendente',
    'Pago',
    'Cancelado'
);

CREATE TYPE public.tipo_candidatura_enum AS ENUM (
    'Aberta',
    'Banco de Talentos'
);


-- =================================================================
-- ETAPA 2: TABELAS BASE E DE CONFIGURAÇÃO
-- Descrição: Cria as tabelas de estrutura que não dependem de outras.
-- -----------------------------------------------------------------

CREATE TABLE public.perfis (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    descricao TEXT
);

CREATE TABLE public.regionais (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome_regional TEXT NOT NULL UNIQUE
);

CREATE TABLE public.bancos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome_instituicao TEXT NOT NULL UNIQUE,
    codigo_banco VARCHAR(10)
);

CREATE TABLE public.produtos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true
);


-- =================================================================
-- ETAPA 3: TABELA DE LOJAS UNIFICADA E DEPENDENTES
-- Descrição: Cria as tabelas principais com seus relacionamentos,
-- unificando as necessidades do CRM e do site de recrutamento.
-- -----------------------------------------------------------------

CREATE TABLE public.lojas (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    regional_id BIGINT NOT NULL REFERENCES public.regionais(id),
    nome TEXT NOT NULL,
    city TEXT,
    state TEXT,
    address TEXT,
    phone TEXT,
    whatsapp TEXT,
    instagram_url TEXT,
    is_active BOOLEAN DEFAULT true
);
COMMENT ON TABLE public.lojas IS 'Tabela unificada para CRM e site público.';

CREATE TABLE public.funcionarios (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
    perfil_id BIGINT NOT NULL REFERENCES public.perfis(id),
    loja_id BIGINT REFERENCES public.lojas(id),
    regional_id BIGINT REFERENCES public.regionais(id),
    gerente_id BIGINT REFERENCES public.funcionarios(id),
    nome_completo TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    data_admissao DATE,
    data_saida DATE,
    is_active BOOLEAN DEFAULT true,
    CONSTRAINT chk_datas_validas CHECK (data_saida IS NULL OR data_saida >= data_admissao)
);

CREATE TABLE public.clientes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    consultor_id BIGINT NOT NULL REFERENCES public.funcionarios(id),
    loja_id BIGINT NOT NULL REFERENCES public.lojas(id),
    nome_completo TEXT NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE
);

CREATE TABLE public.clientes_contas_bancarias (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cliente_id BIGINT NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    banco_id BIGINT NOT NULL REFERENCES public.bancos(id),
    agencia VARCHAR(10) NOT NULL,
    conta VARCHAR(20) NOT NULL,
    tipo_conta VARCHAR(20),
    is_principal BOOLEAN DEFAULT true
);


-- =================================================================
-- ETAPA 4: TABELAS DE RECRUTAMENTO (COM VAGAS POR LOCALIDADE)
-- Descrição: Adiciona as tabelas do sistema de recrutamento com a
-- nova estrutura de vagas baseada em localidade.
-- -----------------------------------------------------------------

CREATE TABLE public.vagas (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT,
    localidade TEXT NOT NULL, -- A VAGA AGORA PERTENCE A UMA LOCALIDADE
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    job_category public.tipo_candidatura_enum NOT NULL DEFAULT 'Aberta'::public.tipo_candidatura_enum,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.vagas IS 'Tabela de vagas para o site, agora baseada em localidade (cidade ou "Grande Vitória").';

CREATE TABLE public.candidatos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    vaga_id BIGINT REFERENCES public.vagas(id) ON DELETE CASCADE,
    nome_completo TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    curriculo_url TEXT,
    status TEXT DEFAULT 'pendente'::TEXT,
    vaga TEXT, -- Mantido para histórico no momento da candidatura
    loja TEXT, -- Mantido para histórico
    city TEXT, -- Mantido para histórico
    tipo_candidatura public.tipo_candidatura_enum,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.candidatos IS 'Tabela de candidatos que se aplicam às vagas.';


-- =================================================================
-- ETAPA 5: ESTRUTURA DE METAS E CONTRATOS DO CRM
-- -----------------------------------------------------------------

CREATE TABLE public.metas (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    mes_ano DATE NOT NULL,
    loja_id BIGINT NOT NULL REFERENCES public.lojas(id),
    consultor_id BIGINT NOT NULL REFERENCES public.funcionarios(id),
    produto_id BIGINT NOT NULL REFERENCES public.produtos(id),
    valor_meta NUMERIC(15, 2) NOT NULL DEFAULT 0,
    quantidade_meta INT NOT NULL DEFAULT 0,
    UNIQUE(mes_ano, consultor_id, produto_id),
    CONSTRAINT chk_meta_positiva CHECK (valor_meta >= 0 AND quantidade_meta >= 0)
);

CREATE TABLE public.contratos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cliente_id BIGINT NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    consultor_id BIGINT NOT NULL REFERENCES public.funcionarios(id),
    produto_id BIGINT NOT NULL REFERENCES public.produtos(id),
    banco_id BIGINT NOT NULL REFERENCES public.bancos(id),
    loja_id BIGINT NOT NULL REFERENCES public.lojas(id),
    data_contrato DATE NOT NULL DEFAULT CURRENT_DATE,
    status public.status_contrato_enum NOT NULL DEFAULT 'Em Análise',
    valor_total NUMERIC(12, 2),
    origem_dados public.origem_dados_enum NOT NULL DEFAULT 'Backoffice Manual',
    updated_at TIMESTAMPTZ,
    CONSTRAINT chk_valor_positivo CHECK (valor_total IS NULL OR valor_total >= 0)
);


-- =================================================================
-- ETAPA 6: OTIMIZAÇÃO DE PERFORMANCE (ÍNDICES)
-- -----------------------------------------------------------------

CREATE INDEX idx_lojas_regional_id ON public.lojas(regional_id);
CREATE INDEX idx_funcionarios_perfil_id ON public.funcionarios(perfil_id);
CREATE INDEX idx_funcionarios_loja_id ON public.funcionarios(loja_id);
CREATE INDEX idx_vagas_localidade ON public.vagas(localidade); -- Índice para a nova coluna
CREATE INDEX idx_clientes_consultor_id ON public.clientes(consultor_id);
CREATE INDEX idx_contratos_cliente_id ON public.contratos(cliente_id);
CREATE INDEX idx_contratos_consultor_id ON public.contratos(consultor_id);
CREATE INDEX idx_metas_mes_ano ON public.metas(mes_ano);
CREATE INDEX idx_metas_loja_id ON public.metas(loja_id);


-- =================================================================
-- ETAPA 7: DADOS INICIAIS (PERFIS)
-- -----------------------------------------------------------------

INSERT INTO public.perfis (nome, descricao) VALUES
    ('Master', 'Acesso total ao sistema.'),
    ('Coordenador', 'Responsável por uma regional de lojas.'),
    ('Supervisor', 'Responsável por uma loja específica.'),
    ('Consultor', 'Realiza vendas e atendimento na loja.'),
    ('RH', 'Gestão de recrutamento e funcionários.'),
    ('Backoffice', 'Registo de contratos e importações.')
ON CONFLICT (nome) DO NOTHING;


-- =================================================================
-- ETAPA 8: SEGURANÇA AVANÇADA (SISTEMA DE AUDITORIA UNIVERSAL)
-- ATENÇÃO: Execute cada um dos 3 blocos desta etapa separadamente.
-- -----------------------------------------------------------------

-- 8.1: A Tabela de Auditoria
CREATE TABLE public.auditoria_geral (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    usuario_id UUID DEFAULT auth.uid(),
    acao TEXT NOT NULL CHECK (acao IN ('INSERT', 'UPDATE', 'DELETE')),
    nome_tabela TEXT NOT NULL,
    dados_antigos JSONB,
    dados_novos JSONB
);
COMMENT ON TABLE public.auditoria_geral IS 'Regista todas as operações de INSERT, UPDATE e DELETE nas tabelas auditadas.';

-- 8.2: A Função de Auditoria Genérica
CREATE OR REPLACE FUNCTION public.registrar_auditoria()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.auditoria_geral (acao, nome_tabela, dados_novos)
        VALUES (TG_OP, TG_TABLE_NAME, to_jsonb(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO public.auditoria_geral (acao, nome_tabela, dados_antigos, dados_novos)
        VALUES (TG_OP, TG_TABLE_NAME, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO public.auditoria_geral (acao, nome_tabela, dados_antigos)
        VALUES (TG_OP, TG_TABLE_NAME, to_jsonb(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8.3: Ativação dos Gatilhos de Auditoria
CREATE TRIGGER trigger_auditoria_vagas
AFTER INSERT OR UPDATE OR DELETE ON public.vagas
FOR EACH ROW EXECUTE FUNCTION public.registrar_auditoria();

CREATE TRIGGER trigger_auditoria_funcionarios
AFTER INSERT OR UPDATE OR DELETE ON public.funcionarios
FOR EACH ROW EXECUTE FUNCTION public.registrar_auditoria();

CREATE TRIGGER trigger_auditoria_lojas
AFTER INSERT OR UPDATE OR DELETE ON public.lojas
FOR EACH ROW EXECUTE FUNCTION public.registrar_auditoria();


-- =================================================================
-- ETAPA 9: ATIVAÇÃO DA SEGURANÇA FINAL (RLS E POLÍTICAS UNIFICADAS)
-- -----------------------------------------------------------------

-- 9.1: Função Auxiliar para Simplificar Políticas
CREATE OR REPLACE FUNCTION public.get_my_profile_name()
RETURNS TEXT AS $$
DECLARE
    profile_name TEXT;
BEGIN
    SELECT p.nome INTO profile_name
    FROM public.funcionarios f
    JOIN public.perfis p ON f.perfil_id = p.id
    WHERE f.user_id = auth.uid();
    RETURN profile_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9.2: Ativar RLS em todas as tabelas
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bancos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lojas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes_contas_bancarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vagas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contratos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auditoria_geral ENABLE ROW LEVEL SECURITY;

-- 9.3: Criar Políticas de Acesso
-- Políticas para o SITE PÚBLICO (acesso anónimo)
CREATE POLICY "Permitir leitura pública de lojas" ON public.lojas FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de vagas ativas" ON public.vagas FOR SELECT USING (is_active = true);
CREATE POLICY "Permitir inserção pública de candidatos" ON public.candidatos FOR INSERT WITH CHECK (true);

-- Políticas para o CRM INTERNO (utilizadores autenticados)
CREATE POLICY "Permitir gestão de vagas para RH e Master" ON public.vagas FOR ALL
USING ( (get_my_profile_name() IN ('RH', 'Master')) )
WITH CHECK ( (get_my_profile_name() IN ('RH', 'Master')) );

CREATE POLICY "Permitir que apenas Master veja a auditoria" ON public.auditoria_geral FOR SELECT
USING ( (get_my_profile_name() = 'Master') );

CREATE POLICY "Permitir acesso de leitura para utilizadores autenticados" ON public.perfis FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Master tem acesso total a contratos" ON public.contratos FOR ALL USING ( (get_my_profile_name() = 'Master') );