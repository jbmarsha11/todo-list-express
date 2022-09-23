const express = require('express') //import express
const app = express() //create express app
const MongoClient = require('mongodb').MongoClient //import mongo client
const PORT = 2121 //set port
require('dotenv').config() //import dotenv


let db, //establishing database
    dbConnectionStr = process.env.DB_STRING, //set db connection to string, hides key
    dbName = 'todo' //set db name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connect to db
    .then(client => { //after connected to the db, console.log connected
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) //set db to client db 
    })
    
app.set('view engine', 'ejs') //set view engine to ejs
app.use(express.static('public')) //set static folder
app.use(express.urlencoded({ extended: true })) //set body parser to parse form data
app.use(express.json()) //set body parse to parse json data


app.get('/',async (request, response)=>{ //get request to root
    const todoItems = await db.collection('todos').find().toArray() //creates a collection called todoItems in our db, finds anything in that collection and turns it into an array of objects
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //get number of incomplete items from db
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //render index.ejs with todo items and number of incomplete items
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})
//route to post a todo
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//inserts new todo
    .then(result => { //after inserted, will consolelog todo added and redirect to root
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error)) //catch any errors and console them 
})
//route to mark todos as complete
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //update todo with checkmark
        $set: {
            completed: true //add status of completed equal to true
          }
    },{
        sort: {_id: -1}, //sort below tasks that still need to be done
        upsert: false //will not create an item if item is not found 
    })
    .then(result => { //once the checkmark is clicked and resorted, will console log and say on index marked complete
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) //catch any errors

})
//route for making an item as incomplete
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //updating selected item
        $set: {
            completed: false //takes checkmark away
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => { //after updated, consolelogs complete and renders marked complete
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))// consoles any errors

})
//route to delete something from list 
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //finds specific todo and deletes it
    .then(result => { //after deleted, console log todo deleted and render it 
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error)) //catches and consoles any errors 

})
//tells the app to listen on the port we told it to above or our hidden port we get through heroku or where ever we're hosting it
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`) //when established and running well, will console log the server is running                
})