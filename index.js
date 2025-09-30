const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');   // ✅ Import cors
const app = express();
const port = 3005;

// ✅ Enable CORS (allow frontend at localhost:3000)
app.use(cors({
  origin: "http://localhost:3000", // frontend address
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

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


const User = mongoose.model('User', userSchema);

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    imgUrl: String,
    likes: { type: Number, default: 0 },
    comments: [{
        text: String,
        imgUrl: String,
        createdAt: { type:Date,default:Date.now }
    }]
});

const Post = mongoose.model('Post', postSchema);

const commentSchema = new mongoose.Schema({

});

const Comment = mongoose.model('Comment', commentSchema);
// ✅ Register route
app.post('/register', async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.json({
        message: 'User registered successfully',
        user: user
    });
});

// ✅ Get all users
app.get("/users", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// ✅ Login route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/posts', async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.json({
      message: 'Post created successfully',
      post
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create post" });
  }
});
  // Logic to create a new post
 



app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

app.post("/posts/:id/comments", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.comments.push({ text: req.body.text });
    await post.save();

    res.json({ message: "Comment added", post });
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
