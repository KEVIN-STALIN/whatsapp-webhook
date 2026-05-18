const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('chatbot-wha', 'postgres', 'postgresql', {
  host: 'localhost',
  port: 5433,
  dialect: 'postgres'
});


async function testConexionBD(){
    try {
         await sequelize.authenticate();
        console.error('CONEXION CORRECTA CON BD');

    } catch (error) {
          console.error('ERROR DE CONEXION CON BD:', error);
    }
}

testConexionBD();

module.exports = sequelize;