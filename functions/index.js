// Setup the core app and register the end points
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import {ctrlLogin, ctrlRead, ctrlCreate, ctrlUpdate, ctrlDelete} from './controller';

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Authenticate before every route; this is middleware
app.use( (req, res, next) => {
    const token = req.query.t;
    if (req.path === '/login'){
        next();
    } else if (!token) {
        res.status(403).send({
            success: false,
            message: 'No auth token provided!'
        });
    } else {
        admin.auth().verifyIdToken(token)
            .then((decodedToken) => {
                req.decoded = decodedToken;
                next();
            })
            .catch((err) => {
                res.json({
                    success: false,
                    message: 'Failed to authenticate token!',
                    error: err
                })
            })
    }
});

// Define endpoints
app.post('/login', 
    ctrlLogin, 
    (req, res) => res.json(res.data)
);

app.get('/api/:doc', 
    ctrlRead, 
    (req, res) => res.json(res.data)
);

app.get('/api/:doc', 
    ctrlRead, 
    (req, res) => res.json(res.data)
);

app.post('/api/:doc', 
    ctrlCreate, 
    (req, res) => res.json(res.data)
);

app.put('/api/:doc/:id', 
    ctrlUpdate, 
    (req, res) => res.json(res.data)
);

app.delete('/api/:doc:/id', 
    ctrlDelete, 
    (req, res) => res.json(res.data)
);

app.use( (err, req, res, next) => {
    console.log(err)
    res.status(500).send('An error occurred')
});

exports.app = functions.https.onRequest(app);

