// conexion.js - Solo para probar la conexión a MongoDB
const mongoose = require('mongoose');

// 📌 PEGA AQUÍ TU CADENA MODIFICADA
// Reemplaza "cluster0.xxxxx.mongodb.net" con la URL real que te dio MongoDB
const MONGODB_URI = 'mongodb+srv://mi_tienda_user:MiTienda2024@cluster0.xxxxx.mongodb.net/mi_tienda?retryWrites=true&w=majority';

async function probarConexion() {
  console.log('🔄 Conectando a MongoDB...');
  console.log('📡 Usando cadena:', MONGODB_URI.replace(/\/\/.*@/, '//****:****@')); // Oculta contraseña
  
  try {
    // Intentar conectar
    await mongoose.connect(MONGODB_URI);
    console.log('✅ ¡CONEXIÓN EXITOSA!');
    console.log('📦 Base de datos:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    
    // Cerrar conexión después de la prueba
    await mongoose.disconnect();
    console.log('🔌 Conexión cerrada correctamente');
    console.log('🎉 Todo funciona perfecto');
    
  } catch (error) {
    console.error('❌ ERROR DE CONEXIÓN:');
    console.error('📝 Mensaje:', error.message);
    
    // Consejos útiles según el error
    if (error.message.includes('bad auth')) {
      console.error('🔑 Problema: Usuario o contraseña incorrectos');
      console.error('   Revisa que el usuario y contraseña sean los correctos');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('🌍 Problema: No se encuentra el servidor');
      console.error('   Revisa que la cadena de conexión esté bien escrita');
    } else if (error.message.includes('whitelist')) {
      console.error('🛡️ Problema: IP no autorizada');
      console.error('   Ve a Network Access y agrega 0.0.0.0/0');
    }
  }
}

// Ejecutar la prueba
probarConexion();