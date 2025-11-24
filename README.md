<!-- Introduction to RESTAPI  with ExpressJS -->

- What is RESTAPI
- 

- Client: This is the user or app that sends **request (req)**
- Server: The server or machine that receives the request and processes it and sends **response (res)**
- API: provides data through JSON format to clients.
- Resource: This is data payload 
- Endpoint: This is the specific URL for a resource e.g. `GET /api/users/1`
- HTTP Methods: Defines the type of action to perform on a resource 
  - `GET`: Retrieve data from a resource 
  - `POST`: Create a new data on the server. It sends data as in payload
  - `PUT`: Update existing data. It sends data as in payload
  - `PATCH`: Partial Update
  - `DELETE`: Removes data 
  

- What is ExpressJS
  - This is a lightweight NodeJS framework to build web applications and APIs
  
  Middlewares:
  Each mw receives three params: req, res, next.

  - Types:
    - Application level middlewares
    - Route level.
    - Built-in mw
    - Third party mw: e.g. Morgan, cors, helmet.
    - Error handling mw: 
    - Auth mw


What is ExpressJS:
- Express is a lightweight web framework for NodeJS. 

Why use Express: 
- Minimal and flexible
- Middleware support
- Good and simple routing 
- Big ecosystem


Middlewares 



Route Handlers

Params
  Path params:  the :id is a path param
    app.get('/users/122334535')
    req.params.id = 122334535

Query
  Query params: GET /users?page=1&limit=3&verified=false
  const limit = Number(req.query.verified);

Body
  Body params: JSON payload sent in POST/PUT/PATCH


REQUEST - reqlogging.getLogger("engineio").setLevel(logging.WARNING)
logging.getLogger("socketio").setLevel(logging.WARNING)
logging.getLogger("socketio.server").setLevel(logging.WARNING)
logging.getLogger("socketio.client").setLevel(logging.WARNING)