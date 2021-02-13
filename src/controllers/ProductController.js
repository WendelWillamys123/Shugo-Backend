const Product = require("../models/Product");
const Store = require("../models/Store");

module.exports = {

    async store(request, response) {    
        var {name, description, value, store} = request.body;
        
        try {
            store = await Store.findById(store);

            if(store){
                var product = await Product.findOne({name: name, store: store._id});

                if(!product){
                    var newProduct = await Product.create({
                        name,
                        description,
                        value,
                        store: store._id,
                    });   

                    await Store.findByIdAndUpdate({ _id: store._id}, {$push: {products: newProduct._id}}, {new: true});

                    return response.send({newProduct});

                } else  return response.status(400).send({error: 'Product already exists'});

            } else  return response.status(400).send({error: 'Store not found'});


        } catch (error) {
            return response.status(400).send({error: 'Create product failed'});
        }
    },

    async index(request, response) {    
        try {
            const products = await Product.find();
            return response.send({products})

        } catch (error) {
            return response.status(400).send({error: 'Products not found'});
        }
    },

    async show(request, response) {
        const { _id } = request.headers;

        try{
            const productBusca = await Product.findById(_id);
            return response.send({productBusca});
        } catch(error){
            return response.status(400).send({error: 'Product not found'})
        }
    },

    async update(request, response) {
        const {idProduct, name, description, value} = request.body; 
        
        try{
            let product = await Product.findById(idProduct); 

            if(product){ 

                if(product.name !== name){
                    product.name = name;
                }

                if(product.description !== description){
                    product.description = description;
                }

                if(product.value !== value){
                    product.value = value;
                }

                await Product.findByIdAndUpdate({_id: idProduct}, {name: product.name, description: product.description, value: product.value}, {new: true})
                return response.send({product}); 

        } else {
            return response.status(400).send({error: 'Product not found'}) 
        }
        
        }catch(error){
            return response.status(400).send({error: 'Update data product failed'}) 
        }
    },

    async destroy(request, response) {
        const {_id} = request.body; 

        let product;
 
        try{

            product = await Product.findById(_id);

            if(product){ 
                
                await Product.findByIdAndRemove(_id);
                await Store.findByIdAndUpdate({_id: product.store}, {$pullAll: {products: [_id]}}, {new: true})
                return response.send({error: false, message: 'Product deleted'}) 
            } else {
                return response.status(400).send({error: 'Product not found'}) 
            }
        
        }catch(error){       
       
            let OldProduct = await Product.findById(_id); 
         
            if(!OldProduct) return response.status(400).send({error: 'Product deleted, but has possible errors'}) 
            else {
                console.log(error);
                return response.status(400).send({error: true, message: `Delete product ${OldProduct.name} failed`}) 
            }
        
        }
    },

}