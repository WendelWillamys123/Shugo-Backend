const Rating = require("../models/Rating");
const Store = require("../models/Store");
const User = require("../models/User");

async function calcStarRating(store) {
    var ratings = []; 
        
    ratings = await Rating.find({ store: store }); 
                        
    var summation = 0, starRating;  
                        
    if(ratings){ 
                               
        ratings.map(rat => summation += rat.stars); 
            
        starRating = summation/ratings.length; 
            
        await Store.findByIdAndUpdate({_id: store._id}, {starRating: starRating.toString()}, {new: true});
                        
    }

    return ratings 
}


module.exports = {
    async store(request, response) {
        var {stars, description, user, store} = request.body;

        try {
            user = await User.findById(user);
            store = await Store.findById(store);

            var rating = await Rating.findOne({user: user._id, store: store._id});

            if(!rating){

                if(user){

                    if(store){

                        var newRating = await Rating.create({
                                stars,
                                description,
                                user: user._id,
                                store: store._id,
                            });   

                        var starRating = calcStarRating(store._id);

                        return response.send({newRating, starRating});

                    } else return response.status(400).send({error: "Store not found"});

                } else return response.status(400).send({error: "User not found"});

            } else {
                rating = await Rating.findByIdAndUpdate({_id: rating._id}, {stars: stars}, {new:true});

                var starRating = calcStarRating(store._id);

                return response.send({rating, starRating});
            }
        } catch (error) {
            console.log();
            return response.status(400).send({error: "Rating failed"})
        }
    },

    async index(request, response) {
        try {
            const ratings = await Rating.find();
            return response.send({ratings})

        } catch (error) {
            return response.status(400).send({error: 'Ratings not found'});
        }
    },

    async show(request, response) {
        const { _id } = request.headers;

        try{
            const ratingBusca = await Rating.findById(_id);
            return response.send({ratingBusca});
        } catch(error){
            return response.status(400).send({error: 'Rating not found'})
        }
    },

    async showSpecific(request, response) {
        var { user, store } = request.headers;

        try{

            user = await User.findById(user);
            store = await Store.findById(store);

            if(user){
                if(store){
                    const ratingBusca = await Rating.find({user: user._id, store: store._id});
                                
                    return response.send({ratingBusca});

                } else return response.status(400).send({error: 'Store not found'})

            } else return response.status(400).send({error: 'User not found'})

            
        } catch(error){
            return response.status(400).send({error: 'Rating not found'})
        }
    },

    async update(request, response) {

        var {stars, description, user, store} = request.body;

        try {

            user = await User.findById(user);
            store = await Store.findById(store);


            if(user){
                if(store){
                    var rating = await Rating.findOne({user: user._id, store: store._id});

                    if(rating){

                        if(stars !== rating.stars){
                            rating.stars = stars;
                        }

                        if(description !== rating.description){
                            rating.description = description;
                        }

                        rating = await Rating.findByIdAndUpdate({_id: rating._id}, {stars: rating.stars, description: rating.description}, {new:true});

                        var starRating = calcStarRating(store._id);

                        return response.send({rating, starRating});

                    } else return response.status(400).send({error: 'Rating not found'})

                } return response.status(400).send({error: 'Store not found'})

            } return response.status(400).send({error: 'User not found'})
            
        } catch (error) {
            return response.status(400).send({error: 'Update rating failed'})
        }
    },


    async destroy(request, response) {
        const { _id } = request.body;

        try{
            const rating = await Rating.findByIdAndRemove(_id);
            var starRating = calcStarRating(store._id);
            return response.send({error: false, message: `Rating deleted! New store star rating: ${starRating}`});
        } catch(error){
            return response.status(400).send({error: true, message: 'Delete rating failed'})
        }
    },

}