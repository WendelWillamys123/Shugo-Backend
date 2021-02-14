const Store = require("../models/Store");
const bcrypt = require('bcryptjs');

module.exports = {

    async index(request, response) {    
        try {
            const stores = await Store.find();
            return response.send(stores)

        } catch (error) {
            return response.status(400).send({error: 'Stores not found'});
        }
    },

    async show(request, response) {
        const { _id } = request.headers;

        try{
            const storeBusca = await Store.findById(_id);
            return response.send(storeBusca);
        } catch(error){
            return response.status(400).send({error: 'Store not found'})
        }
    },

    async showName(request, response) {
        const { name } = request.headers;

        try{
            const storeBusca = await Store.find({name: name});
            return response.send(storeBusca);
        } catch(error){
            return response.status(400).send({error: 'Store not found'})
        }
    },

    async update(request, response) {
        const {_id, name, email, slogan, description, CPF_CNPJ, address, phone, category} = request.body; 
        
        try{
        let store = await Store.findById(_id); 

        if(store){ 

            if(name !== store.name){
                store.name = name;
            }

            if(email !== store.email){
                store.email = email;
            }
        
            if(slogan !== store.slogan){
                store.slogan = slogan;
            }

            if(description !== store.description){
                store.description = description;
            }

            if(CPF_CNPJ !== store.CPF_CNPJ){
                store.CPF_CNPJ = CPF_CNPJ;
            }

            if(address !== store.address){
                store.address = address;
            }

            if(phone !== store.phone){
                store.phone = phone;
            }

            if(category !== store.category){
                store.category = category;
            }

            await Store.findByIdAndUpdate({_id: _id}, {name : store.name, email : store.email, slogan : store.slogan, description : store.description,
            CPF_CNPJ : store.CPF_CNPJ, address : store.address, phone : store.phone, category : store.category}, {new: true})
            return response.send(store); 

        } else {
            return response.status(400).send({error: 'Store not found'}) 
        }
        
        }catch(error){
            return response.status(400).send({error: 'Update data store failed'}) 
        }
    },

    async destroy(request, response) {
        const {_id, password} = request.body; 

        let store;
 
        try{

            store = await Store.findById(_id).select("+password"); 

            if(store){ 

                if(await bcrypt.compare(password, store.password)) {
                    await Store.findByIdAndRemove(_id)
                    return response.send({error: false, message: `Store ${store.name} deleted`}); 
                }        

            } else {
                return response.status(400).send({error: 'Store not found'}) 
            }
        
        }catch(error){       
       
            let OldStore = await Store.findById(_id); 
         
            if(!OldStore) return response.status(400).send({error: 'Store deleted, but has possible errors'}) 
            else {
                console.log(error);
                return response.status(400).send({error: true, message: `Delete store ${OldStore.name} failed`}) 
            }
        
        }
    },

}