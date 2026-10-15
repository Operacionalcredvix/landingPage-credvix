// CUIDADO: Este arquivo não deve ser enviado para o GitHub!
// Ele contém as chaves secretas do projeto.

// Detecta o ambiente
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.includes('192.168');

// Configurações de DESENVOLVIMENTO (Supabase Local)
const DEV_CONFIG = {
  SUPABASE_URL: 'http://127.0.0.1:54321',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
  SUPABASE_SERVICE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
};

// Configurações de PRODUÇÃO (Organização Dev-CredVix)
const PROD_CONFIG = {
  SUPABASE_URL: 'https://uexvojgictmkuackpofk.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVleHZvamdpY3Rta3VhY2twb2ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4OTY0NjQsImV4cCI6MjA4MzQ3MjQ2NH0.hF6zZRxkzEImyKsv4Hru2-tuM4VoLJ84mVAVSE12bzY',
  SUPABASE_SERVICE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVleHZvamdpY3Rta3VhY2twb2ZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzg5NjQ2NCwiZXhwIjoyMDgzNDcyNDY0fQ.joU__yYgh8Li4G4T-GiLkugGioeOj3Y-FKiwCMs1aDg'
};

// Seleciona as configurações baseadas no ambiente
const CONFIG = isDevelopment ? DEV_CONFIG : PROD_CONFIG;

// Exporta as variáveis
export const SUPABASE_URL = CONFIG.SUPABASE_URL;
export const SUPABASE_ANON_KEY = CONFIG.SUPABASE_ANON_KEY;
export const SUPABASE_SERVICE_KEY = CONFIG.SUPABASE_SERVICE_KEY;

// Log para debug (remover em produção)
console.log(`🔧 Ambiente: ${isDevelopment ? 'DESENVOLVIMENTO' : 'PRODUÇÃO'}`);
console.log(`📡 Supabase URL: ${SUPABASE_URL}`);