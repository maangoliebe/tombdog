const port = 3000;

const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Task = require("./models/Task");

dotenv.config();

app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));

// connect to database
mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DB_CONNECT, { 
    useNewUrlParser: true,
    useUnifiedTopology: true }, () => {
    console.log("Database connected");
    app.listen(port, () => console.log("Server up Oscar Mike"));
});

// view engine configuration
app.set("view engine", "ejs");

// GET
app.get('/',(req, res) => { //request response
    Task.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });    
    });
});

// POSt
app.post('/',async (req, res) => { //request reponse
    const todoTask = new Task({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

// edit
app
.route("/edit/:id")
.get((req, res) => {
    const id = req.params.id;
    Task.find({}, (err, tasks) => {
        res.render("edit.ejs", { todoTasks: tasks, idTask: id });
    });
})
.post((req, res) => {
    const id = req.params.id;
    Task.findByIdAndUpdate(id, { content: req.body.content }, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

// remove
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    Task.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});
