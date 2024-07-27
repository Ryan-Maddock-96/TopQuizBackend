const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
var cors = require('cors');
require('dotenv').config()

const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

const verifyToken = (req, res, next) => {
    // Check if the Authorization header is present
    const token = req.headers.authorization.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }
  
    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
  
      // Attach the decoded payload to the request object for future use
      req.userId = decoded.id;
      next(); // Pass control to the next middleware or route handler
    });
  };

app.post('/login', (req, res) => {
    const {username} =  req.body

    const userData = {
        id: 2,
        firstName: 'test',
        lastName: 'testy'
    }

    const token = jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: '1800s'})

    res.json({success: true, token, user: userData})
})

app.get('/getUser', verifyToken, (req, res) => {
    const test = req.userId
    const userData = {
        id: 2,
        firstName: 'test',
        lastName: 'testy'
    }
    res.json(userData)
})

app.get('/getQuizList', verifyToken, (req, res) => {
  const list = [
    {
        "id": 1,
        "name": "Quiz 1",
        "description": "This is Quiz 1",
        "points": 20,
        "category": "Movies"
    },
    {
        "id": 2,
        "name": "Quiz 2",
        "description": "This is Quiz 2",
        "points": 20,
        "category": "TV"
    },
    {
        "id": 3,
        "name": "Quiz 3",
        "description": "This is Quiz 3",
        "points": 20,
        "category": "Gaming"
    },
    {
        "id": 4,
        "name": "Quiz 1",
        "description": "This is Quiz 1",
        "points": 20,
        "category": "Movies"
    },
    {
      "id": 5,
        "name": "Quiz 2",
        "description": "This is Quiz 2",
        "points": 20,
        "category": "Movies"
    },
    {
      "id": 6,
        "name": "Quiz 3",
        "description": "This is Quiz 3",
        "points": 20,
        "category": "Music"
    }
  ]

  res.json({
    quizList: list
  })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});