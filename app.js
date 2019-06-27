const express = require('express'); 
const app = express();

const bodyParser = require('body-parser');  
const port = process.env.PORT || 3000;

const mysql = require('mysql');
const con = mysql.createConnection({
    database: 'lsrobots',
    host: "localhost",
    user: "root", 
    password: "12345"
  });
  
  con.connect(function(err) {
     if (err) throw err;
     console.log("Connected to DB");
    });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.listen(port, () => console.log(`Dev app listening on port ${port}!`) );

app.get('/robots', (req, res) => 
{       
    var robots = 'SELECT * FROM robots;'

    con.query(robots, (err, results)=>{
        if (err) throw err;
        
        res.json(results);
    })    
});

app.put('/robots/:id', (req, res) => 
{   
    var isRunnnigQuery = `SELECT isRunning FROM robots WHERE id = ${req.params.id}`;
    var isRunning

    con.query(isRunnnigQuery, (err, result)=>{
      if (err) throw err;     
      
      isRunning = result[0].isRunning

      if(isRunning == 1)
        isRunning = 0
      else
        isRunning = 1    

      var update = `UPDATE robots
      SET updatedBy='${req.body.updatedBy}', updateReason='${req.body.updateReason}', isRunning=${isRunning}, lastUpdate=NOW()
      WHERE id=${req.params.id}`
  
      con.query(update, (err, results)=>{
          if (err) throw err;
          
          res.json(results);
      })  
  })     
        
});