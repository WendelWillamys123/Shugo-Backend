const User = require("../models/User");
const bcrypt = require('bcryptjs');

module.exports = {

    async index(request, response) {    
        try {
            const users = await User.find();
            return response.send(users)

        } catch (error) {
            return response.status(400).send({error: 'Users not found'});
        }
    },

    async show(request, response) {
        const { _id } = request.headers;

        try{
            const userBusca = await User.findById(_id);
            return response.send(userBusca);
        } catch(error){
            return response.status(400).send({error: 'User not found'})
        }
    },

    async update(request, response) {
        const {idUser, name, email} = request.body; 
        
        try{
        let user = await User.findById(idUser); 

        if(user){ 

        if(user.name !== name){
            user.name = name;
        }

        if(user.email !== email){
            user.email = email;
        }

        await User.findByIdAndUpdate({_id: idUser}, {name: user.name, email: user.email}, {new: true})
        return response.send(user); 

        } else {
            return response.status(400).send({error: 'User not found'}) 
        }
        
        }catch(error){
            return response.status(400).send({error: 'Update data user failed'}) 
        }
    },

    async destroy(request, response) {
        const {_id, password} = request.body; 

        let user;
 
        try{

            user = await User.findById(_id).select("+password"); 

            if(user){ 

                if(await bcrypt.compare(password, user.password)) {
                    await User.findByIdAndRemove(_id)
                    return response.send({error: false, message: `User ${user.name} deleted`}); 
                }        

            } else {
                return response.status(400).send({error: 'User not found'}) 
            }
        
        }catch(error){       
       
            let OldUser = await User.findById(_id); 
         
            if(!OldUser) return response.status(400).send({error: 'User deleted, but has possible errors'}) 
            else {
                console.log(error);
                return response.status(400).send({error: true, message: `Delete user ${OldUser.name} failed`}) 
            }
        
        }
    },

}