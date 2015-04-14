var express = require('express');
var router = express.Router();

function api_router(db){
  router.post('/registro',function(req,res,next){
    var datos = db.collection("nombres");
    var date = new Date().toDateString();

    var query = {
      nombre : req.body.nombre,
      edad : req.body.edad,
      fecha : req.body.fecha,
      sexo : req.body.sexo,
      Fecha: date
    };
   //console.log(query)

  datos.update(query,{"$inc":{"contador":1}},{"upsert":true},function(err ,md ,status){
    res.status(200).json({"documento":md});
  });
  });

    router.get('/getTopLista',function(req , res, next){
      console.log("HURRA! API OP");
    var datos = db.collection("nombres");
    datos.find().sort({"contador":-1}).toArray(function(err , docs){
  //  coleccion.find().toArray(function(err , md ,status){
  if(err) throw err;
    res.status(200).json(docs);
    })
  });
  return router;
}
module.exports = api_router;
