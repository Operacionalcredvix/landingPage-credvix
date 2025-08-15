-- =================================================================
-- ETAPA 1: INSERIR AS REGIONAIS
-- =================================================================
-- Descrição: Cria os registos das regionais que agruparão as lojas.
-- =================================================================

INSERT INTO public.regionais (nome_regional) VALUES
    ('Grande Vitória'),
    ('Norte ES'),
    ('Sul ES'),
    ('Minas Gerais'),
    ('Bahia'),
    ('Distrito Federal'),
    ('Mato Grosso'),
    ('Goiás')
ON CONFLICT (nome_regional) DO NOTHING; -- Não gera erro se a regional já existir

-- =================================================================
-- ETAPA 2: INSERIR AS LOJAS (VERSÃO AJUSTADA)
-- =================================================================
-- Descrição: Insere os dados das lojas, omitindo os campos automáticos
-- (id, created_at) e adicionando a referência à regional correta.
-- =================================================================

INSERT INTO "public"."lojas" (
    "regional_id",
    "nome",
    "city",
    "state",
    "address",
    "phone",
    "whatsapp",
    "instagram_url"
)
VALUES
    -- Lojas da Regional "Grande Vitória"
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Grande Vitória'), 'Vitória - Jeronimo Monteiro', 'Vitória', 'ES', 'Rua Gonçalves Ledo, 57 - Centro, Vitória - ES', '(27) 3233-4660', '5527992913463', 'https://www.instagram.com/lojahelp.centrovitoria/'),
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Grande Vitória'), 'Vitória - Praia do Canto', 'Vitória', 'ES', 'Rua Joaquim Lírio, 100 - Praia do Canto, Vitória - ES', '(27) 3233-4660', '5527992913463', 'https://www.instagram.com/lojahelp.vitoria'),
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Grande Vitória'), 'Credvix Vila Velha', 'Vila Velha', 'ES', 'Avenida Jeronimo Monteiro, 1291 - Edifício Elaine - Loja 01 - Centro - VV', '(27) 3072-0889', '552730720889', 'https://www.instagram.com/credvixvv/'),
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Grande Vitória'), 'Credvix Glória', 'Vila Velha', 'ES', 'Avenida Carlos Lindenberg, 7032 - Glória, Vila Velha - ES', '(27) 3534-1552', '5527992818843', 'https://www.instagram.com/credvix.gloria'),
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Grande Vitória'), 'Credvix Champagnat', 'Vila Velha', 'ES', 'Avenida Champagnat, 11089 - Centro, Vila Velha - ES', '(27) 3340-6225', '552733406225', 'https://www.instagram.com/credvixvv/'),
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Grande Vitória'), 'Vila Velha - Centro', 'Vila Velha', 'ES', 'Avenida Jeronimo Monteiro, 1291 - Edifício Elaine - Loja 01 - Centro - VV', '(27) 3072-0889', '552730720889', 'https://instagram.com/lojahelp.vilavelha'),
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Grande Vitória'), 'Serra - Pq Jacaraípe', 'Serra', 'ES', 'Rua Abido Saadi , 715 - Loja 01 - Parque Jacaraípe - Serra - ES', '(27) 3064-4648', '5527999895020', 'https://www.instagram.com/lojahelp.jacaraipe/'),
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Grande Vitória'), 'Serra - Laranjeiras II', 'Serra', 'ES', 'Avenida Primeira Avenida, 302 - Loja C - Serra - ES', '(27) 3442-0253', '552734420253', 'https://www.instagram.com/lojahelp.laranjeirases/'),
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Grande Vitória'), 'Serra - Laranjeiras', 'Serra', 'ES', 'Rua Tiradentes, 100 - Lojas 01 e 02 - Parque Residencial Laranjeiras - Se', '(27) 3070-1094', '5527997040654', 'https://www.instagram.com/lojahelp.laranjeiras/'),
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Grande Vitória'), 'Credvix Cariacica', 'Cariacica', 'ES', 'Avenida Expedito Garcia, 165 - Campo Grande - Cariacica - ES', '(27) 99662-210', '552733662210', 'https://www.instagram.com/credvix.cariacica/'),
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Grande Vitória'), 'Cariacica - Campo Grande', 'Cariacica', 'ES', 'Avenida Expedito Garcia, 516 - Loja 02 - Campo Grande. _ Cariacica - ES', '(27) 2141-7561', '5527998706816', 'https://www.instagram.com/lojahelp.cariacica/'),
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Grande Vitória'), 'Cariacica - Expedito Garcia', 'Cariacica', 'ES', 'Avenida Expedito Garcia, 516 - Loja 02 - Campo Grande _ Cariacica - ES', '', '5527996989293', 'https://www.instagram.com/lojahelp.cariacicaes/'),

    -- Lojas da Regional "Norte ES"
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Norte ES'), 'Aracruz - Centro', 'Aracruz', 'ES', 'Rua Professor Lobo, 40 - Centro - Aracruz - ES', '(27) 3256-1938', '5527996673076', 'https://www.instagram.com/lojahelp.aracruz/'),
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Norte ES'), 'Colatina - Centro', 'Colatina', 'ES', 'Avenida Getulio Vargas, 426 -Centro - Colatina - ES', '(27) 3120-7771', '552731207771', 'https://www.instagram.com/lojahelp.colatina/'),
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Norte ES'), 'Nova Venecia - Centro', 'Nova Venécia', 'ES', 'Praça Jones dos Santos Neves, 20 - Loja 05 - Centro - Nova Venecia - ES', '(27) 4042-1727', '5527995022489', 'https://www.instagram.com/lojahelp.novavenecia/'),
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Norte ES'), 'Linhares - Centro', 'Linhares', 'ES', 'Avenida Augusto Calmom, 1121 - Loja 06 - Centro - Linhares - ES', '(27) 3153-5756', '552731519710', 'https://www.instagram.com/lojahelp.linhares/'),
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Norte ES'), 'São Mateus - Centro', 'São Mateus', 'ES', 'Avenida Jones dos Santos Neves, 421 - Loja 04 - Centro - São Mateus - ES', '(27) 3118-1764', '5527995222380', 'https://www.instagram.com/lojahelp.saomateus/'),
    
    -- Lojas da Regional "Sul ES"
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Sul ES'), 'Cachoeiro de Itapemirim - Centro', 'Cachoeiro de Itapemirim', 'ES', 'Rua 25 de Março, 40- Centro - Cachoeiro do Itapemirim - ES', '(28) 3028-8946', '5528998861895', 'https://www.instagram.com/lojahelp.cachoeiro/'),
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Sul ES'), 'Guarapari - Centro', 'Guarapari', 'ES', 'Rua Getulio Vargas, 272 - Edificio Olimpo - Loja 02 - Centro - Guarapari', '(27) 3125-1595', '5527995812857', 'https://www.instagram.com/lojahelp_guarapari/'),

    -- Lojas de Minas Gerais
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Minas Gerais'), 'Ipatinga - Centro', 'Ipatinga', 'MG', 'Rua Mariana, 120, . loja 06 - Centro - Ipatinga - CEP: 35,160-018', '(31) 3668-5399', '5533988802256', 'https://www.instagram.com/lojahelp_ipatinga/'),
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Minas Gerais'), 'Teofilo Otoni - Centro', 'Teófilo Otoni', 'MG', 'Rua Antonio Alves Benjamim, 253, . Loja 03 - Centro - teófilo Otoni - MG', '(33) 3641-3431', '55336413431', 'https://www.instagram.com/lojahelp.teofilootoni/'),

    -- Lojas da Bahia
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Bahia'), 'Eunápolis - Centro', 'Eunápolis', 'BA', 'Avenida D Pedro II, 539 - Centro - Eunapolis - BA', '(73) 3281-2220', '55739812190', 'https://www.instagram.com/lojahelp.eunapolis/'),
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Bahia'), 'Teixeira de Freitas - Centro', 'Teixeira de Freitas', 'BA', 'Rua Antonio Simplicio de Barros, 268 - Loja 01 - Centro - Teixeira de Fre', '(73) 3016-2019', '557399102018', 'https://www.instagram.com/lojahelp.teixeira'),
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Bahia'), 'Itabuna - Centro', 'Itabuna', 'BA', 'Rua Paulino Vieira, 211 - Centro - Itabuna - BA', '(73) 3015-318', '557399588043', 'https://www.instagram.com/lojahelp.itabuna/'),
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Bahia'), 'Porto Seguro - Centro', 'Porto Seguro', 'BA', 'Travessa Manoel Cancela, 170 - Lojas 05 e 06 - Centro - Porto Seguro - B', '(73) 3199-0680', '55739838397', 'https://www.instagram.com/lojahelp.portoseguro'),

    -- Lojas do Distrito Federal
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Distrito Federal'), 'Brasília - Taguatinga', 'Brasília', 'DF', 'C 2 - lt 12 - lOJA 04 - Edificio Diva Maria - Taguatinga - Brasilia - Distrito F', '(61) 3522-1899', '556199250225', 'https://www.instagram.com/lojahelp.taguatinga/'),
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Distrito Federal'), 'Brasília - Ceilândia Sul', 'Brasília', 'DF', 'QNNM 1 - Conjunto H - LT 38 - LJ 02 - Ceilandia Brasilia - DF', '(61) 3689-1009', '556195569292', 'https://www.instagram.com/lojahelp.ceilandia/'),

    -- Lojas do Mato Grosso
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Mato Grosso'), 'Cuiabá - Centro-Norte', 'Cuiabá', 'MT', 'Rua Barão de Melgaço, 3508 - Edificio Irene - Loja 02 - Centro - Cuiabá', '(65) 4052-9370', '556530411256', 'https://www.instagram.com/lojahelp.cuiaba/'),
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Mato Grosso'), 'Várzea Grande - Centro Norte', 'Várzea Grande', 'MT', 'Rua Couto de Magalhaes, 999 - Centro Norte - Varzea Grande - MT', '(65) 3029-7279', '556599021389', 'https://www.instagram.com/lojahelp.varzea'),
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Mato Grosso'), 'Rondonópolis - Centro', 'Rondonópolis', 'MT', 'Rua Reze de Maio, 347 - Esquina Av Amazonas 1012 - Centro - Rondonópolis', '(66) 3022-6946', '556699394502', 'https://www.instagram.com/lojahelp.rondonopolis/'),

    -- Lojas de Goiás
    ((SELECT id FROM public.regionais WHERE nome_regional = 'Goiás'), 'Águas Lindas de Goiás', 'Águas Lindas de Goiás', 'GO', 'Q 12 - LT 10 - lOJA 02 - Jardim Brasilia - Águas Lindas de Goias - GO', '(61) 4040-4568', '556196266093', 'https://instagram.com/lojahelp.aguaslindas/');