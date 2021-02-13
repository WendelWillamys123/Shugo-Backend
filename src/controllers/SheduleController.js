const Shedule = require("../models/Shedule");
const Store = require("../models/Store");

module.exports = {

    async store(request, response) {    
        var {times, store} = request.body;
        
        try {
            store = await Store.findById(store);

            if(store){
                var shedule = await Shedule.findOne({store: store._id});

                if(!shedule){
                    var newShedule = await Shedule.create({
                        times,
                        store: store._id,
                    });   

                    await Store.findByIdAndUpdate({ _id: store._id}, {shedules: newShedule._id}, {new: true});

                    return response.send({newShedule});

                } else  return response.status(400).send({error: 'Shedule already exists'});

            } else  return response.status(400).send({error: 'Store not found'});


        } catch (error) {
            return response.status(400).send({error: 'Create shedule failed'});
        }
    },

    async index(request, response) {    
        try {
            const shedules = await Shedule.find();
            return response.send({shedules})

        } catch (error) {
            return response.status(400).send({error: 'Shedules not found'});
        }
    },

    async show(request, response) {
        const { _id } = request.headers;

        try{
            const sheduleBusca = await Shedule.findById(_id);
            return response.send({sheduleBusca});
            
        } catch(error){
            return response.status(400).send({error: 'Shedule not found'})
        }
    },

    async update(request, response) {
        const {idShedule, times} = request.body; 
        
        try{
        let shedule = await Shedule.findById(idShedule); 

        if(shedule){ 

            if(shedule.times !== times){
                shedule.name = times;
            }

            await Shedule.findByIdAndUpdate({_id: idShedule}, {times: shedule.times}, {new: true})
            return response.send({shedule}); 

        } else {
            return response.status(400).send({error: 'Shedule not found'}) 
        }
        
        }catch(error){
            return response.status(400).send({error: 'Update data shedule failed'}) 
        }
    },

    async destroy(request, response) {
        const {_id} = request.body; 

        let shedule;
 
        try{

            shedule = await Shedule.findById(_id);

            if(shedule){ 
                
                await Shedule.findByIdAndRemove(_id);
                await Store.findByIdAndUpdate({_id: shedule.store}, {shedule: null}, {new: true})
                return response.send({error: false, message: 'Shedule deleted'}) 

            } else {
                return response.status(400).send({error: 'Shedule not found'}) 
            }
        
        }catch(error){       
       
            let OldShedule = await Shedule.findById(_id); 
         
            if(!OldShedule) return response.status(400).send({error: 'Shedule deleted, but has possible errors'}) 
            else {
                console.log(error);
                return response.status(400).send({error: true, message: `Delete shedule failed`}) 
            }
        
        }
    },

}