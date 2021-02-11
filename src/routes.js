const { Router } = require('express');
const authMiddleware = require('./middlewares/auth');

const UserController = require('./controllers/UserController');
const RatingController = require('./controllers/RatingController');
const StoreController = require('./controllers/StoreController');

const routes = Router();

//Routes without authentication


    // User routes

        routes.get('/show/user', UserController.show);
        routes.get('/index/user', UserController.index);

    // Store routes

        routes.get('/show/store', StoreController.show);
        routes.get('/index/store', StoreController.index);

    // Rating routes

        routes.get('/show/rating', RatingController.show);
        routes.get('/index/rating', RatingController.index);


// Authenticated routes -----------------------------------------------------

routes.use(authMiddleware);

    // User routes

        routes.put('/update/user', UserController.update);
        routes.delete('/delete/user', UserController.destroy);

    // Store routes

        routes.put('/update/store', StoreController.update);
        routes.delete('/delete/store', StoreController.destroy);

    // Rating routes

        routes.post('/rating', RatingController.store);
        routes.put('/update/rating', RatingController.update);
        routes.delete('/delete/rating', RatingController.destroy);
        routes.get('/showSpecific/rating', RatingController.showSpecific);



module.exports = routes;