require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

// 1) Import createClient from supabase-js
const { createClient } = require('@supabase/supabase-js');

// 2) Initialize your Supabase client with the URL + API key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// --- Sign Up route ---
app.post('/signup', async (req, res) => {
    try {
      const { email, username, password } = req.body;
  
      // 1) Check if email or username already exists
      const { data: existingUser, error: existingUserError } = await supabase
        .from('users')
        .select('id, email, username')
        .or(`email.eq.${email},username.eq.${username}`);
  
      if (existingUserError) throw existingUserError;
      if (existingUser && existingUser.length > 0) {
        return res.status(400).json({
          error: 'Email or username already in use.'
        });
      }
  
      // 2) Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // 3) Insert the new user
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            email,
            username,
            password: hashedPassword
          }
        ])
        .select(); // returns the inserted rows
  
      if (insertError) throw insertError;
  
      // 4) Return the newly created user (omit the password in response)
      const created = newUser[0];
      delete created.password;
      res.status(201).json(created);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
  
  // --- Log In route ---
  app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // 1) Find user by email
      const { data: foundUsers, error: selectError } = await supabase
        .from('users')
        .select('id, email, username, password')
        .eq('email', email);
  
      if (selectError) throw selectError;
      if (!foundUsers || foundUsers.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const user = foundUsers[0];
  
      // 2) Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Incorrect password' });
      }
  
      // 3) Return a success message & user info (omit password)
      delete user.password;
      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
  
  // Get current user by ID
  app.get('/user/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const { data: userData, error } = await supabase
        .from('users')
        .select('id, email, username, created_at')
        .eq('id', id)
        .single();
  
      if (error) throw error;
      if (!userData) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(userData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // get the followers of the user id you pass in
  app.get('/users/:id/followers', async (req, res) => {
    const { id } = req.params;
  
    try {
      const { data, error } = await supabase
        .from('follows')
        .select('follower_id, users!follows_follower_id_fkey(username)')
        .eq('followed_id', id);
  
      if (error) throw error;
  
      // extract usernames
      const followers = data.map(f => ({ username: f.users.username }));
      res.json(followers);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
   });

   // get the following of the user id you pass in
   app.get('/users/:id/following', async (req, res) => {
    const { id } = req.params;
  
    try {
      const { data, error } = await supabase
        .from('follows')
        .select('followed_id, users!follows_followed_id_fkey(username)')
        .eq('follower_id', id);
  
      if (error) throw error;
  
      const following = data.map(f => ({ username: f.users.username }));
      res.json(following);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // follow from one user to another
  app.post('/follow', async (req, res) => {
    const { follower_id, followed_id } = req.body;
  
    if (follower_id === followed_id) {
      return res.status(400).json({ error: 'You cannot follow yourself' });
    }
  
    try {
      const { data, error } = await supabase
        .from('follows')
        .insert([{ follower_id, followed_id }]);
  
      if (error) throw error;
      res.status(201).json({ message: 'Followed successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
  
  // simple check to make sure its working
  app.get('/', (req, res) => {
    res.send('Hello from Supabase + Express!');
  });

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));