require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.error(err));

const TodoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
});

const Todo = mongoose.model('Todo', TodoSchema);

//get all todos
app.get('/api/todos', async (req, res) => {
    try {
        const all = await Todo.find().sort({ createdOn: -1 });
        res.json(all);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//get a todo
app.get('/api/todos/:id', async (req, res) => { 
    try {
        const todo = await Todo.findById(req.params.id); 
        if (!todo) {
            return res.status(404).json({ msg: 'Todo not found' });
        }
        res.json(todo);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Invalid Todo ID format' }); 
        }
        res.status(500).send('Server Error');
    }
});

// Create new todo
app.post('/api/todos', async (req, res) => { 
    const { title, content } = req.body; 

    if (!title || !content) { 
        return res.status(400).json({ msg: 'Please enter title and content' });
    }

    const newTodo = new Todo({
        title,
        content,
    });

    try {
        const data = await newTodo.save(); 
        res.status(201).json(data); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// update
app.put('/api/todos/:id', async (req, res) => { 
    const { title, content, completed } = req.body; 
    const todoId = req.params.id; 

    if (!todoId) {
        return res.status(400).json({ msg: 'Please provide a todo ID in the URL' });
    }

    try {
        const updatedFields = {};
        if (title !== undefined) updatedFields.title = title;
        if (content !== undefined) updatedFields.content = content;
        if (completed !== undefined) updatedFields.completed = completed;

        const todo = await Todo.findByIdAndUpdate(
            todoId,
            { $set: updatedFields }, 
            { new: true, runValidators: true }
        );

        if (!todo) {
            return res.status(404).json({ msg: 'Todo not found' });
        }
        res.json(todo);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Invalid Todo ID format' });
        }
        res.status(500).send('Server Error');
    }
});

// delete
app.delete('/api/todos/:id', async (req, res) => {
    const todoId = req.params.id;

    if (!todoId) {
        return res.status(400).json({ msg: 'Please provide a todo ID in the URL' });
    }

    try {
        const todo = await Todo.findByIdAndDelete(todoId);
        if (!todo) {
            return res.status(404).json({ msg: 'Todo not found' });
        }
        res.json({ msg: 'Todo deleted successfully', id: todoId });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Invalid Todo ID format' });
        }
        res.status(500).send('Server Error');
    }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

