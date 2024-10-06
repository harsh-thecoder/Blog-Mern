const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user'); // Mongodb
const Post = require('./models/post'); // Mongodb
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = 'khdbvdbfvbserbvefvrevr';
const axios = require('axios');
const cookieParser = require('cookie-parser');
const corsOptions = {
    origin: 'http://localhost:5173',  // Frontend URL
    credentials: true,        
};

  app.use(cors(corsOptions));
  

  
app.use(express.json());
app.use(cookieParser());

app.use('/uploads',express.static(__dirname + '/uploads'));

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const fs = require('fs');

mongoose.connect('mongodb+srv://harshbpandey5:j9TjQwPqVKuMC53v@cluster0.zm6zk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

const saltRounds = 10;


app.post('/register', async (req,res) => {
    const { username,password } = req.body;
    console.log(username,password);
    try{
        const userDoc = await User.create({
            username,
            password:bcrypt.hashSync(password,saltRounds),
        });
        res.json(userDoc);
    }
    catch(e){
        console.log(e);
        res.status(400).json(e);
    }
    
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const userDoc = await User.findOne({ username });
        if (!userDoc) {
            return res.status(400).json('User not found');
        }

        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            // Generate token
            jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
                if (err) {
                    throw err;
                }
                // Set the token cookie
                res.cookie('token', token, {
                    httpOnly: true,
                    sameSite: 'None', // Required for cross-origin cookies
                    secure: true,    // Set to true if using HTTPS
                    path: '/',        // Accessible in all routes
                }).json({
                    id: userDoc._id,
                    username,
                });
            });
        } else {
            res.status(400).json('Wrong Credentials');
        }
    } catch (e) {
        console.log(e);
        res.status(500).json('Server error');
    }
    // console.log('Generated Token:', token); // Log the generated token
});

app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err,info) => {
      if (err) throw err;
      res.json(info);
    });
  });
  

app.post('/logout',(req,res) => {
    res.cookie('token','').json('ok');
})

app.post('/post', upload.single('file'), async (req, res) => {
    console.log('Received request to create post:', req.body); // Log request body
    console.log('Received Cookies:', req.cookies); // Log all received cookies
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
    const { token } = req.cookies; // Extract the token from cookies
    console.log('Extracted Token:', token); // Log the extracted token

    if (!token) {
        console.log('Token not provided'); // Log if token is missing
        return res.status(401).json({ error: 'Token not provided' });
    }

    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
          console.log('Token verification failed:', err);
          return res.status(403).json({ error: 'Token verification failed' });
        }
        console.log('Token verification successful:', info);
    
        const { title, summary, content } = req.body;
        const PostDoc = await Post.create({
          title,
          summary,
          content,
          cover: newPath,
          author: info.id,
        });
    
        res.json(PostDoc);
      });
});

app.put('/post',upload.single('file'), async (req,res) => {
    let newpath = null;
    if(req.file){
        const {originalname,path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newpath = path+'.'+ext;
        fs.renameSync(path, newpath);
    }

    const {token} = req.cookies;

    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
          console.log('Token verification failed:', err);
          return res.status(403).json({ error: 'Token verification failed' });
        }
        // console.log('Token verification successful:', info);
    
        const {id,title,summary,content} = req.body; 
        const PostDoc = await Post.findById(id);
        const is_valid_author = (JSON.stringify(PostDoc.author) === JSON.stringify(info.id));
        
        if (!is_valid_author){
            return res.status(400).json("You are not a Valid Author");
            // throw "You are not a Valid Author";
        }

         await PostDoc.updateOne({
            title,
            summary,
            content,
            cover: newpath ? newpath : PostDoc.cover,
          });

        res.json(PostDoc); 
    
      });


})


app.get('/post',async (req,res) => {
    const posts = await Post.find()
    .populate('author',['username'])
    .sort({createdAt: -1})  // It sorts posts i.e. the latest one should be at the top
    .limit(20)
    res.json(posts);
})

app.get('/post/:id',async (req,res) => {
    const {id} = req.params;
    const PostDoc = await Post.findById(id).populate('author',['username']);
    res.json(PostDoc);
})

app.listen(4000,() => {
     console.log('Port is running on 4000');
})

// j9TjQwPqVKuMC53v
// mongodb+srv://harshbpandey5:<db_password>@cluster0.zm6zk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// mongodb+srv://harshbpandey5:<j9TjQwPqVKuMC53v>@cluster0.zm6zk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0