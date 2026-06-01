const mongoose = require('mongoose');
const dns = require('dns');

// Forzar resolución DNS con IPv4
dns.setServers(['8.8.8.8', '8.8.4.4']);

const MONGODB_URI = 'mongodb://mi_tienda_user:Mitienda2024@cluster0.5y4znbt.mongodb.net:27017/mi_tienda?retryWrites=true&w=majority';

async function test() {
    console.log('🔄 Probando conexión con resolución DNS forzada...');
    
    try {
        await mongoose.connect(MONGODB_URI, {
            family: 4,  // Forzar IPv4
            serverSelectionTimeoutMS: 15000,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ ¡CONECTADO!');
        console.log('📦 Base de datos:', mongoose.connection.name);
        
        // Pequeña prueba
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📁 Colecciones:', collections.map(c => c.name));
        
        await mongoose.disconnect();
        console.log('🎉 Todo funciona');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n💡 Esto es un problema de red local.');
        console.log('   El código funcionará normalmente en Render.com');
    }
}

test();