const Store = require('../models/Store');
const User = require('../models/User');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json')

const { Router } = require('express');


const router = Router();

//Routes Store

    router.post('/register/store',  async (request, response) => {
        const {name, email, password, slogan, description, CPF_CNPJ, address, phone, category} = request.body;
        
        try{
        let NewStore = await Store.findOne({ email });

        if(!NewStore){
            NewStore = await Store.create({
                name,
                email,
                password,
                slogan,
                description,
                CPF_CNPJ,
                address,
                phone,
                category
            })
            
            NewStore.password= undefined;

        const token = jwt.sign({idStore: NewStore._id}, authConfig.secret, { expiresIn: 86400})

        return response.send({NewStore, token});

        } else {
            return response.status(400).send({error: 'Store already exists'})   
        }
        
        }catch(error){
            return response.status(400).send({error: 'New store registration failed'})    
        }

    });


    router.post('/authenticate/store', async (request, response) =>{
        const {email, password} = request.body;

        try{
            const store = await Store.findOne({email}).select('+password');

            if(!store){
                return response.status(400).send({error: 'Store not found'})
            } 
            if(!await bcrypt.compare(password, store.password)){    
                return response.status(400).send({error: 'Invalid password'})
            }

            store.password = undefined;

            const token = jwt.sign({idStore: store._id}, authConfig.secret, { expiresIn: 86400})

            return response.send({store, token});
        }catch(error){
            return response.status(400).send({error: 'Authenticate Store  failed'})    
        }
    });

//Routes Store

    router.post('/register/user',  async (request, response) => {
        const {name, email, password} = request.body; 
        
        try{
        let NewUser = await User.findOne({ email }); 

        if(!NewUser){ 
            NewUser = await User.create({ 
                name,
                email,
                password
            })

            NewUser.password= undefined;

        const token = jwt.sign({idUser: NewUser._id}, authConfig.secret, { expiresIn: 86400}) 

        return response.send({NewUser, token}); 

        } else {
            return response.status(400).send({error: 'User already exists'}) 
        }
        
        }catch(error){
            return response.status(400).send({error: 'New user registration failed'}) 
        }

    });

    router.post('/authenticate/user', async (request, response) =>{
        const {email, password} = request.body;

        try{
            const user = await User.findOne({email}).select('+password');

            if(!user){
                return response.status(400).send({error: 'User not found'})
            } 
            if(!await bcrypt.compare(password, user.password)){
                return response.status(400).send({error: 'Invalid password'})
            }

            user.password = undefined;

            const token = jwt.sign({idUser: user._id}, authConfig.secret, { expiresIn: 86400})

            return response.send({user, token});
        }catch(error){
            return response.status(400).send({error: 'Store  failed'})    
        }
    });
 

    module.exports = app => app.use('/shugo', router);

