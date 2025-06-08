require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Body parser for JSON data

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.error(err));

// Define a simple schema and model for data
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

//get a todo - in progress
// Get a single todo by its ID
app.get('/api/todos/:id', async (req, res) => { // Changed to /api/todos/:id
    try {
        const todo = await Todo.findById(req.params.id); // Use req.params.id
        if (!todo) {
            return res.status(404).json({ msg: 'Todo not found' });
        }
        res.json(todo);
    } catch (err) {
        console.error(err.message);
        // Important: Handle invalid ObjectId format (e.g., if ID is not a valid Mongo ObjectId string)
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Invalid Todo ID format' }); // Use 400 for bad request
        }
        res.status(500).send('Server Error');
    }
});

// Create new todo
app.post('/api/todos', async (req, res) => { // Changed endpoint to be RESTful
    const { title, content } = req.body; // Only expecting title and content

    if (!title || !content) { // Only validate what's expected from client
        return res.status(400).json({ msg: 'Please enter title and content' });
    }

    const newTodo = new Todo({
        title,
        content,
        // completed and createdOn will use their default values from the schema
    });

    try {
        const data = await newTodo.save(); // Mongoose generates _id upon save
        res.status(201).json(data); // 201 Created is appropriate for successful creation
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// update
// Update todo
app.put('/api/todos/:id', async (req, res) => { // Changed endpoint
    const { title, content, completed } = req.body; // Allow for updating completed too
    const todoId = req.params.id; // Get ID from URL parameter

    if (!todoId) { // Check if ID is provided in URL
        return res.status(400).json({ msg: 'Please provide a todo ID in the URL' });
    }

    try {
        const updatedFields = {};
        if (title !== undefined) updatedFields.title = title;
        if (content !== undefined) updatedFields.content = content;
        if (completed !== undefined) updatedFields.completed = completed;

        const todo = await Todo.findByIdAndUpdate(
            todoId,
            { $set: updatedFields }, // Use $set to update only provided fields
            { new: true, runValidators: true } // `new: true` returns the updated doc, `runValidators` runs schema validators
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

// @route   DELETE /api/todos/:id
// @desc    Delete a todo by ID
app.delete('/api/todos/:id', async (req, res) => {
    const todoId = req.params.id; // Get ID from URL parameter

    if (!todoId) {
        return res.status(400).json({ msg: 'Please provide a todo ID in the URL' });
    }

    try {
        const todo = await Todo.findByIdAndDelete(todoId);
        if (!todo) {
            return res.status(404).json({ msg: 'Todo not found' });
        }
        // CORRECTED: Return the ID that was deleted
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

