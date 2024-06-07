const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./userModel');
const Order = require('./orderModel');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const Product= require('./productModel');

const app = express();
require('dotenv').config();

const MONGODB_URI = 'mongodb://localhost:27017/TD';


mongoose.connect(MONGODB_URI, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../FrontEnd')));
app.use('/images', express.static(path.join(__dirname, '../FrontEnd/images')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../FrontEnd/index.html'));
});

app.get('/signin', (req, res) => {
  res.sendFile(path.join(__dirname, '../FrontEnd/sign.html'));
});

app.post('/add-to-cart', (req, res) => {
  //return res.status(404).json({req});
  const { id, name, price } = req.body;
  if(typeof(name) == 'undefined' || typeof(id) == 'undefined' || typeof(price) == 'undefined'){
    return res.status(404).json({ message: 'Product not found' });
  }
  return res.status(200).json({ message: '' , product: {id:id,name:name,price:price} });
});

app.post('/remove-from-cart', (req, res) => {
  const { productId } = req.body;
  let cart = [];
  const index = cart.findIndex(item => item.id === productId);
  if (index === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
  }

  cart.splice(index, 1);
  res.status(200).json({ success: true, message: 'Item removed from cart' });
});

app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(req.body);
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword
    });
    await newUser.save();
    res.sendFile(path.join(__dirname, '../FrontEnd/sign.html'));
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', req.body);
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: 'User doesnt exist' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      console.log('Invalid password for user:', email);
      return res.status(400).json({ message: 'Invalid password' });
    }
    res.redirect('/index.html');
  } catch (error) {
    console.log(error);
    console.log('Error:', error.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
});
app.post('/checkout', async (req, res) => {
  try {
    const { productId, productName, productPrice } = req.body;
    const order = new Order({
      productId: productId,
      productName: productName,
      productPrice: productPrice,
    });
    await order.save();
    res.status(200).json({ success: true, message: 'Order successful' });
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({ success: false, message: 'Error processing order' });
  }
});
app.get('/home', (req, res) => {
  res.redirect('/#home');
});
app.get('/about', (req, res) => {
  res.redirect('/#about');
});
app.get('/products', (req, res) => {
  res.redirect('/#products');
});
app.get('/menu', (req, res) => {
  res.redirect('/#menu');
});
app.get('/contact', (req, res) => {
  res.redirect('/#contact');
});
app.get('/review', (req, res) => {
  res.redirect('/#review');
});
app.get('/blogs', (req, res) => {
  res.redirect('/#blogs');
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});