require('dotenv').config(); 

const express = require('express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require("path");

const { connect, checkDatabase, disconnect }= require('./src/models/db.js');
const { loadUsers, loadRestaurants, loadReviews } = require('./src/routes/loader.js');
const { times, ifEquals, ifMultipleOf, ifGreaterThan, formatDate, shortenString } = require('./src/helpers/helper.js');

const router = require('./src/routes/router.js');
const app = express();

function initializeSession(){
    app.use(session({
        cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hrs
        store: new MemoryStore({
            checkPeriod: 86400000  // 24 hrs
        }),
        resave: false,
        secret: 'cherry boy',
        saveUninitialized: true
    }))
}

function initializeStatics() {
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/uploads', express.static('public/uploads'));
}

function initializeHBS() {
    app.engine("hbs", exphbs.engine({
        extname: "hbs",
        defaultLayout: false,
        helpers: {
            times: times,
            ifEquals: ifEquals,
            ifMultipleOf: ifMultipleOf,
            ifGreaterThan: ifGreaterThan,
            formatDate: formatDate,
            eq: (a, b) => a === b,
            shortenString: shortenString
        }
    }));
    app.set("view engine", "hbs");
    app.set("views", "./src/views");
}

async function finalClose(){
    await disconnect().then(console.log('Server closed!'));
    process.exit();
}

async function main(){
    initializeSession();
    initializeStatics();
    initializeHBS();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));    
    app.use(router);

    app.listen(process.env.SERVER_PORT, async () => {
        console.log(`Express server is now listening on port ${process.env.SERVER_PORT}`);
        try {
            
            await connect();
            console.log(`Now connected to MongoDB`);

            // await checkDatabase().then( (dbExists) => {
            //     console.log(dbExists);
            //     if (!dbExists){
            //         loadRestaurants();
            //         loadUsers();
            //         loadReviews();
            //     }
        //  });
            
        } catch (err) {
            console.log('Connection to MongoDB failed:');
            console.error(err);
        }
    });

    process.on('SIGTERM',finalClose);  
    process.on('SIGINT', finalClose); 
    process.on('SIGQUIT', finalClose);
}

main();


