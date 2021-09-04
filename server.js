const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const port = 3001;

//config
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//connect to mongoDB
mongoose.connect("mongodb+srv://rrh2023:BUschool2019!@cluster0.0win1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")

//create the data schema
const noteSchema = {
    title: String,
    body: String
}

//create the data model
const Note = mongoose.model("Note", noteSchema) 

//create route
app.post("/create", (req, res) => {
    console.log(req.body.title,)
    const newNote = new Note({
        title: req.body.title,
        body: req.body.body
    });

    newNote.save()
    .then(note => {res.json(note)})
    .catch(err => {res.status(400).json("Error" + err)})
})

//read route
app.get("/notes", (req, res) => {
    Note.find()
    .then(todos => res.json(todos))
    .catch(err => res.status(400).json("Error " + err))
})

//update route
app.put("/put/:id", (req, res) => {
    const updatedNote = {
        title: req.body.title,
        body: req.body.body
    }
    Note.findByIdAndUpdate({_id: req.params.id}, {$set: updatedNote}, (req, res, err) => {
        if(err){
            console.log(err)
        }
    })
})

//delete route
app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    Note.findByIdAndDelete({_id: id}, (req, res, err) => {
        if(!err){
            console.log("Note deleted")
        }else{
            console.log(err)
        }
    })
})


//Serve static assets in production
if(process.env.NODE_ENV === "production"){
    // set static folder
    app.use(express.static("client/build"));

    app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "client", "build", "index.html")));
}

app.listen(process.env.PORT || 3001, () => {console.log("Express is running on port 3001")})