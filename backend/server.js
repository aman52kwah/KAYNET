import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
//import { sequelize, User } from './models';
//const jwt = require('jsonwebtoken');

const app= express();

app.use(cors({
    origin:process.env.CLIENT_URL || 'http://http://localhost:3000',
    credentials:true
}));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/googl/callback',
    passReqToCallback   : true
  }, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ where: { googleId: profile.id } });
    
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        role: 'customer'
      });
    }
    
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));
    passport.serializeUser((user,done) =>{
        done(null,user.id);
    });

    passport.deserializeUser(async(id,done)=>{
        try {
            const user = await user.findByPk(id);
            done(null,user);
        } catch (error) {
            done(error,null);
        }
    })



    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });