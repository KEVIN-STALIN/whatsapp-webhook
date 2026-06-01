// config/database.js
const mongoose = require('mongoose');

// 📌 PEGA AQUÍ TU CADENA MODIFICADA
const MONGODB_URI = 'mongodb+srv://mi_tienda_user:Mitienda2024@cluster0.5y4znbt.mongodb.net/mi_tienda?retryWrites=true&w=majority';


async function conectarDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Base de datos conectada exitosamente');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    // No detenemos el servidor, pero mostramos el error
  }
}

module.exports = { conectarDB };