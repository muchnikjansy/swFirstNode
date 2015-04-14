var Application = function(){
    this._geoEnabled = false;
    this._localStorage = false;
    this._secciones = new Array();
    this._reportForm = null;
    this._currentItem = null;
    this._currentHour = 0; // Permite controlar el cambio de hora asi recargar la lista
    this._tocken = false;
    this._months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    // referencia circular a si mismo para
    // mantener el contexto de llamado
    // sin conflicto con el cambio
    // que hace jquery a la variable this
    var _self = this;

    this.init = function(){
  this.checkgeoData();
  this.checkLocalStorage();
  this._reportForm = $("[data-field]");
  // en Jquery no existe un metodo para .put o .delete
  // asi que extenderemos jquery para que tenga estos
  // metodos de ayuda.

  $.put = function(url, data, handler, type){
      return $.ajax(url,{
        "data":data,
        "dataType":type,
        "method":"PUT"
      }).done(handler);
  }
  $.delete = function(url, data, handler, type){
      //to implement
      return $.ajax(url,{
        "data":data,
        "dataType":type,
        "method":"DELETE"
      }).done(handler);
    }
}
//funciones para verificar compatibilidad de HTML5 API
    this.checkgeoData = function(){
    this._geoEnabled = navigator.geolocation && true;
    }

    this.checkLocalStorage = function(){
    this._localStorage = (typeof(Storage) !== "undefined");
    }

//Manejadores del Tocken de acceso a la aplicación
    this.checkTocken = function(){
    var Tocken = _self.getTocken();
    if(Tocken){
      if(new Date(Tocken.expires) <= new Date()){
        _self.invalidateTocken();
        return false;
      }
    }else{
      _self.invalidateTocken();
      return false;
    }
    return Tocken.hashdata;
    }

    this.getTocken = function(){
    if(!_self._tocken){
      if(_self._localStorage && localStorage.tocken){
        _self._tocken = JSON.parse(localStorage.tocken);
          return _self._tocken;
      }
    }else{
      return _self._tocken;
    }

    return false
    }

    this.invalidateTocken = function(){
    _self._tocken = false;
    if(_self._localStorage && localStorage.tocken){
        localStorage.removeItem("tocken");
    }

    }

//helpers
  this.redirectTo = function(pageid, options){
    var defaults = {"reverse":false,
                    "changeHash":false};
    $.extend(defaults, options);
    $( ":mobile-pagecontainer" ).pagecontainer( "change", "#"+pageid , defaults );
    }

    this.getApiDS = function(){
      return {"tocken": _self.checkTocken()};
    }
}

var app = new Application();
//app.pag1();

  $("#pag1").on("pagecreate", function(e){
      $("#btnGuardar").on("vclick", function(e){
        var nombre = ($("#nombre").val());
        var edad = ($("#edad").val());
        var fecha = ($("#fecha").val());
       var sexo =($("#sexo").val());
     $.post("/api/registro",{
       "nombre":nombre ,
       "edad":edad,
       "fecha":fecha ,
       "sexo":sexo
       },
     function(data,txt,rhx){
       console.log(data);
     },"json");
      });
  });



  $("#pag2").on("pagecreate", function(e){
    $("#MostrarLista")
      .click(function(e){
                  $.get(
                    "/api/getTopLista",
                    {},
                    function(data, successStr, xrh){
                      var htmlstr = "";
                      if(Array.isArray(data)){
                       console.log("llega a la funcion click");

                        for(var i =0 ; i<data.length;i++){
                          var dato = data[i];
                          htmlstr += '<li><a href="#pag2" data_id="'+i+'">Nombre: '+dato.nombre+' Edad: '+dato.edad+ ' Fecha: '+dato.Fecha+' Top: '+" "+'<span class="ui-li-count">'+dato.contador+'</span>'+'</a></li>';
                        }
                      }
                      $("#GenerarLista").html(htmlstr).listview().find("a").click(function(e){

                        });
                    },
                    "json"
                  ).fail(function(xrh, failStr, error){
                    console.log(error);
                  });

                });
      });
