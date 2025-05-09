// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');
// const connectDB = require('./config/db'); // Fix path if needed
// app.use(bodyParser.json());
// app.use('/api/fruit',require('./routes/api/fruits'))
// async function startServer() {
//   try {
//     // Connect to database
//     const sequelize = await connectDB();
    
//     // Initialize model
//     const Fruit = require('./models/Fruit')(sequelize);
    
//     // Sync all models with database
//     // await sequelize.sync({ force: true }); // Warning: force:true will drop tables!
//     await sequelize.sync(); // Warning: force:true will drop tables!
//     console.log('Database synchronized');
    
//     // Make models available in your app
//     app.locals.db = {
//       sequelize,
//       Fruit
//     };
    
//     // Start server
//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   } catch (err) {
//     console.error('Failed to start server:', err);
//   }
// }
// app.get("/",(req,res)=>{
//     res.json("welcome to the fruit app");
// })
// startServer();



const express = require('express');
const app= express();
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use('/api/fruits',require('./routes/api/fruits'))
// app.use('/api/customers',require('./routes/api/Customer'));
const connectDB=require('./config/db')

async function startServer() {
  const sequelize = await connectDB();
  const Fruit = require('./models/Fruit')(sequelize)
  const Customer = require('./models/Customer')(sequelize)
  sequelize.sync();
  console.log('Database synchronized');
  app.locals.db = {sequelize,Customer,Fruit}
  const port = process.env.PORT;
  app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
  })
}

startServer()



