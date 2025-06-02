const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exhbs = require('express-handlebars');
const PORT = 3000;
const db= require('./db');
const objectID = db.objectId

// Set up Handlebars engine
app.engine('hbs', exhbs.engine({
    layoutsDir: 'views/',
    defaultLayout: 'main',
    extname: 'hbs'
}));
app.set('view engine', 'hbs'); 
app.set('views', 'views');
app.use(bodyParser.urlencoded({extended:false}))

// Route
app.get('/', async (req, res)  => {
   
    let database = await db.getDatabase()
    const collection  = database.collection('books');
    const carser= collection.find({})
    let books = await carser.toArray();

    let message = '';
    let edit_id, edit_book;

    if (req.query.edit_id) {
        edit_id = req.query.edit_id;
        edit_book = await collection.findOne({ _id: new objectID(edit_id)});
    }
    if (req.query.delete_id) {
       await  collection.deleteOne({_id: new objectID(req.query.delete_id)});
       return res.redirect('/?status=3');
    }
    
   
    switch (req.query.status) {
        case '1':
            message= 'inserted successfully'
            break;
        case '2':
            message= 'Updated successfully'
            break;
        case '3':
            message= 'Deleted successfully'
            break;
    
        default:
            break;
    }

    res.render('main',{message,books,edit_id,edit_book}); // render 'main.hbs' using layout
});

app.post('/store_book', async (req,res)=>{
    let database =  await db.getDatabase();
    const collection = database.collection('books');
    let book = {
        title:req.body.title,
        author:req.body.author
    }
   await collection.insertOne(book);
   return res.redirect('/?status=1');
})
app.post('/update_book/:edit_id', async (req,res)=>{
    let database =  await db.getDatabase();
    const collection = database.collection('books');
    let book = {
        title:req.body.title,
        author:req.body.author
    }

    let edit_id = req.params.edit_id;
   await collection.updateOne({_id: new objectID(edit_id)},{$set:book});
   return res.redirect('/?status=2');
})

// Server
app.listen(PORT, () => {
    console.log(`Server Running at http://localhost:${PORT}`);
});
