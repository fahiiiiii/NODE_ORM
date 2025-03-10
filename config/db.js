// const { Sequelize } = require('sequelize');
// require('dotenv').config();

// async function connectDB() {
//   try {
//     // // Debug info to see what values are being used
//     console.log('Environment Variables:', {
//       database: process.env.POSTGRES_DB || 'myapp',
//       username: process.env.POSTGRES_USER || 'postgres',
//       password: process.env.POSTGRES_PASSWORD ? 'fahimah123' : 'NOT SET',
//       host: process.env.POSTGRES_HOST || 'localhost',
//       port: process.env.POSTGRES_PORT || 5432
//     });

//     const sequelize = new Sequelize({
//       database: process.env.POSTGRES_DB || 'myapp',
//       username: process.env.POSTGRES_USER || 'postgres',
//       password: process.env.POSTGRES_PASSWORD ,
//       host: process.env.POSTGRES_HOST || 'localhost',
//       port: process.env.POSTGRES_PORT || 5432,
//       dialect: 'postgres',
//       logging: console.log
//     });

//     await sequelize.authenticate();
//     console.log('PostgreSQL connection has been established successfully.');
    
//     // Sync models with database (remove force:true in production)
//     // await sequelize.sync({ force: true });
    
//     return sequelize;
//   } catch (error) {
//     console.error('Unable to connect to the database:', error.message);
//     process.exit(1); // Exit process with failure
//   }
// }

// module.exports = connectDB;

const {Sequelize} = require('sequelize');
const { connect } = require('../routes/api/fruits');
async function connectDB(){
 try {
   const sequelize = new Sequelize ({
    database:process.env.POSTGRES_DB, 
    username:process.env.POSTGRES_USER, 
    password:process.env.POSTGRES_PASSWORD, 
    host:process.env.POSTGRES_HOST, 
    port:process.env.POSTGRES_PORT, 
    dialect:'postgres',
    logging:console.log
   })
   await sequelize.authenticate();
   console.log("Postgres connected");
   return sequelize
 } catch (error) {
  console.error('Not connected to postgres',error.message)
  process.exit(1)
 }
}

module.exports= connectDB;