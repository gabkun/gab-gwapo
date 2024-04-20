
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

// handling CORS 
app.use((req, res, next) => { 
  res.header("Access-Control-Allow-Origin",  
             "http://localhost:4200"); 
  res.header("Access-Control-Allow-Headers",  
             "Origin, X-Requested-With, Content-Type, Accept"); 
  next(); 
}); 

app.use(express.json());

// route for handling requests from the Angular client 
app.get('/api/message', (req, res) => { 
  res.json({ message:  
          'Hello GEEKS FOR GEEKS Folks from the Express server!' }); 
}); 

app.post('/todo', async(req, res) => {
    const itemName = req.body

    const newItem = await prisma.toDoItem.create({
        data: {
            itemName: itemName.itemName
        }
    })
    return res.json(newItem);
})

app.get('/todo', async(req, res) => {
    const items = await prisma.toDoItem.findMany()
    return res.json(items);
})

const port = process.env.PORT || 3000
app.listen(port, () => { 
  console.log(`Server listening on port ${port}`); 
});