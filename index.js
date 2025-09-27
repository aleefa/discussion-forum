const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3005;

// Middleware to parse JSON bodies
app.use(express.json());

mongoose.connect('mongodb+srv://aleefamp:aleefamp@learning1.azwq8p0.mongodb.net/?retryWrites=true&w=majority&appName=learning1', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User= mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
    const user =  new User(req.body);
    await user.save();
    res.json({
        message: 'User registered successfully',
        user: user
    })
})
app.get("/users", async (req, res) => {
    const users = await User.find();
    res.json(users);
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});