// Script para verificar la conexión con Supabase
// Ejecutar: node verify-connection.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

console.log('🔍 Verificando conexión a Supabase...\n');

// Verificar variables de entorno
console.log('📋 Variables de entorno:');
console.log(`   SUPABASE_URL: ${supabaseUrl ? '✅ Configurada' : '❌ Falta'}`);
console.log(`   SUPABASE_SERVICE_KEY: ${supabaseKey ? '✅ Configurada' : '❌ Falta'}\n`);

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan variables de entorno en .env');
  console.log('\n💡 Revisa el archivo SETUP_SUPABASE.md para completar la configuración.\n');
  process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Probar conexión
async function testConnection() {
  try {
    console.log('🔗 Probando conexión con la base de datos...');
    
    // Intentar obtener usuarios
    const { data, error } = await supabase
      .from('usuarios')
      .select('count')
      .limit(1);

    if (error) {
      if (error.message.includes('relation "usuarios" does not exist')) {
        console.log('⚠️  Conexión exitosa, pero las tablas no existen.');
        console.log('📝 Necesitas ejecutar el schema SQL:');
        console.log('   1. Ve a: https://app.supabase.com/project/ajtvxekosfigkhmlmyqd/editor');
        console.log('   2. Copia el contenido de database/schema.sql');
        console.log('   3. Pégalo en el SQL Editor y ejecuta\n');
        return;
      }
      throw error;
    }

    console.log('✅ ¡Conexión exitosa!\n');
    console.log('🎉 Tu proyecto AthenIA está listo para funcionar.\n');
    
    // Verificar tablas
    const { data: tables } = await supabase
      .from('usuarios')
      .select('id')
      .limit(1);
    
    console.log('📊 Base de datos configurada correctamente.');
    
  } catch (error) {
    console.error('❌ Error al conectar:', error.message);
    console.log('\n💡 Verifica:');
    console.log('   - Las API keys son correctas');
    console.log('   - El proyecto existe en Supabase');
    console.log('   - Has ejecutado el schema SQL\n');
  }
}

testConnection();
