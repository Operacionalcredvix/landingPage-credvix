-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.candidatos (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  vaga_id bigint,
  nome_completo text NOT NULL,
  email text NOT NULL,
  telefone text,
  curriculo_url text,
  loja text,
  status text DEFAULT 'pendente'::text,
  CONSTRAINT candidatos_pkey PRIMARY KEY (id),
  CONSTRAINT candidatos_vaga_id_fkey FOREIGN KEY (vaga_id) REFERENCES public.vagas(id)
);
CREATE TABLE public.vagas (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title text NOT NULL,
  storename text,
  state text,
  type text,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  inactivated_at timestamp with time zone,
  job_category text NOT NULL DEFAULT 'Aberta'::text,
  city text,
  CONSTRAINT vagas_pkey PRIMARY KEY (id)
);