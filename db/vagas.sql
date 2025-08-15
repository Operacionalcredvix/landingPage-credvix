-- =================================================================
-- ETAPA ÚNICA: INSERIR AS VAGAS (VERSÃO AJUSTADA)
-- =================================================================
-- Descrição: Insere os dados das vagas na nova estrutura, utilizando
-- a coluna "localidade" e omitindo campos automáticos.
-- =================================================================

INSERT INTO "public"."vagas" (
    "title",
    "type",
    "description",
    "is_active",
    "job_category",
    "localidade"
)
VALUES
    ('Consultor de Vendas', 'Tempo Integral', null, true, 'Aberta', 'Águas Lindas de Goiás'),
    ('Consultor de Vendas', 'Tempo Integral', null, true, 'Aberta', 'Aracruz'),
    ('Consultor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'Cachoeiro de Itapemirim'),
    ('Consultor de Vendas', 'Tempo Integral', null, true, 'Aberta', 'Brasília'),
    ('Consultor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'Colatina'),
    ('Consultor de Vendas', 'Tempo Integral', null, true, 'Aberta', 'Cuiabá'),
    ('Consultor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'Várzea Grande'),
    ('Consultor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'CPA'),
    ('Consultor de Vendas', 'Tempo Integral', null, true, 'Aberta', 'Eunápolis'),
    ('Consultor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'Guarapari'),
    ('Consultor de Vendas', 'Tempo Integral', null, true, 'Aberta', 'Ipatinga'),
    ('Consultor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'Itabuna'),
    ('Consultor de Vendas', 'Tempo Integral', null, true, 'Aberta', 'Serra'),
    ('Consultor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'Linhares'),
    ('Consultor de Vendas', 'Tempo integral', null, true, 'Aberta', 'Nova Venécia'),
    ('Consultor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'Porto Seguro'),
    ('Consultor de Vendas', 'Tempo Integral', null, true, 'Aberta', 'Rondonópolis'),
    ('Consultor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'São Mateus'),
    ('Consultor de Vendas', 'Tempo Integral', null, true, 'Aberta', 'Teixeira de Freitas'),
    ('Consultor de Vendas', 'Tempo Integral', null, true, 'Aberta', 'Taguatinga'),
    ('Consultor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'Teófilo Otoni'),
    ('Supervisor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'Águas Lindas de Goiás'),
    ('Supervisor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'Aracruz'),
    ('Supervisor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'Cachoeiro de Itapemirim'),
    ('Supervisor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'Grande Vitória'),
    ('Supervisor de Vendas', 'Tempo Integral', null, true, 'Aberta', 'Ceilândia'),
    ('Supervisor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'Colatina'),
    ('Supervisor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'Cuiabá'),
    ('Supervisor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'Várzea Grande'),
    ('Supervisor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'CPA'),
    ('Supervisor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'Eunápolis'),
    ('Supervisor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'Guarapari'),
    ('Supervisor de Vendas', 'Tempo Integral', null, true, 'Aberta', 'Ipatinga'),
    ('Supervisor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'Itabuna'),
    ('Supervisor de Vendas', 'Tempo Integral', null, true, 'Aberta', 'Serra'),
    ('Supervisor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'Linhares'),
    ('Supervisor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'Nova Venécia'),
    ('Supervisor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'Porto Seguro'),
    ('Supervisor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'Rondonópolis'),
    ('Supervisor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'São Mateus'),
    ('Supervisor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'Teixeira de Freitas'),
    ('Supervisor de Vendas', 'Tempo Integral', null, true, 'Aberta', 'Taguatinga'),
    ('Supervisor de Vendas', 'Tempo Integral', null, true, 'Banco de Talentos', 'Teófilo Otoni');