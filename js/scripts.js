$(document).ready(function(){
  // +++++++++++++++++++++++++++++++++ botonera inicial +++++++++++++++++++++++++
  var estados = false;
  $('#btn_ciudades').click(function(){
    if(estados){
      $('#btn_ciudades').addClass("boton_activo");
      $('#btn_estados').removeClass("boton_activo");
      estados = false;
    }
  });

  $('#btn_estados').click(function(){
    if(!estados){
      $('#btn_ciudades').removeClass("boton_activo");
      $('#btn_estados ').addClass("boton_activo");
      estados = true;
    }
  });
  // +++++++++++++++++++++++++++++++++ fin botonera inicial +++++++++++++++++++++++++

  //inicializacion de owlCarousel
  $(".owl-carousel").owlCarousel({
    loop:false,
    margin:10,
    nav:false,
    dots: false,
    navText : ["◄","►"],
    responsive:{
        0:{
            items:2
        },
    }
  });

  var owl = $('.owl-carousel');
  owl.owlCarousel();

  // Custom Navigation Events
  $('.customNextBtn').click(function(){
    owl.trigger('next.owl.carousel');
  });
  $('.customPrevBtn').click(function(){
    owl.trigger('prev.owl.carousel', [300]);
  });

  //inicializacion selects
  $('select').material_select();

});

//funcion para quitar repetidos
Array.prototype.unique=function(a){
  return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
});




  function estado(estado){
    $.ajax({
      type: 'GET',
      url: "https://api.datos.gob.mx/v1/sinaica?fecha="+anio+"-"+(mes+1)+"-"+dia+"&pageSize=2000&parametro=PM10",
      data: {},
      success: function( data, textStatus, jqxhr ) {

        // console.log('DATA');
        // console.log(data);

        for (var i = 0; i < data.results[0].length; i++) {

        }

          //estaciones.push(data.results.stations[i].id);
          if(data.results[0]._id != "cve"){
            var contaminante = data.results[0].parametro;

              if (contaminante == 'PM10'){
                estaciones.push(parseFloat(data.results[0].valororig));
              }

          }

        //}

        // for(var k = 0 ; k < estaciones.length; k++) {
        //     totalt += estaciones[k];
        // }
        // console.log('PM10');
        // console.log(contaminante);
        // console.log('Total');
        // console.log(data.results[0].valororig);
        //console.log(estaciones.length);
        //avg = totalt / estaciones.length;
        //avg = data.results[0].valororig;
        //console.log(avg);

        //$('.contador').html(avg.toFixed(2));

      },
      xhrFields: {
        withCredentials: false
      },
      crossDomain: true,
      async:false
    });
  }


  function estados(){
    var datedate = anio+"-"+mes+"-"+dia;
    console.log(datedate);

    $.ajax({
      type: 'GET',
      url: "https://api.datos.gob.mx/v1/sinaica?fecha="+datedate+"&pageSize=12000",
      data: {},
      success: function( data, textStatus, jqxhr ) {
        var estados = [];

        for (var i = 0; i < data.results.length; i++) {
          estados.push(data.results[i].state);
        }
        //estaciones.push(data.results.parametro);

        console.log(estados.unique());

      },
      xhrFields: {
        withCredentials: false
      },
      crossDomain: true,
      async:false
    });

  }

  function ciudadesTodas(estado){
    var datedate = anio+"-"+mes+"-"+dia;
    console.log(datedate);

    $.ajax({
      type: 'GET',
      url: "https://api.datos.gob.mx/v1/sinaica?fecha="+datedate+"&pageSize=12000&state="+estado,
      data: {},
      success: function( data, textStatus, jqxhr ) {
        var estados = [];

        for (var i = 0; i < data.results.length; i++) {
          estados.push(data.results[i].city);
        }
        //estaciones.push(data.results.parametro);

        console.log(estados.unique());

      },
      xhrFields: {
        withCredentials: false
      },
      crossDomain: true,
      async:false
    });
  }

  function ciudadesEstado(estado, ciudad){

  }


  function estaciones(ciudad){
    var datedate = anio+"-"+mes+"-"+dia;
    console.log(datedate);

    $.ajax({
      type: 'GET',
      url: "https://api.datos.gob.mx/v1/sinaica?fecha="+datedate+"&pageSize=12000&city="+ciudad,
      data: {},
      success: function( data, textStatus, jqxhr ) {
        var estations = [];

        for (var i = 0; i < data.results.length; i++) {
          estations.push(data.results[i].estacionesid);
        }
        //estaciones.push(data.results.parametro);

        console.log(estations.unique());

      },
      xhrFields: {
        withCredentials: false
      },
      crossDomain: true,
      async:false
    });

  }

  function contaminantes(ciudad){

    var datedate = anio+"-"+mes+"-"+dia;
    console.log(datedate);

    $.ajax({
      type: 'GET',
      url: "https://api.datos.gob.mx/v1/sinaica?fecha="+datedate+"&pageSize=12000&city="+ciudad,
      data: {},
      success: function( data, textStatus, jqxhr ) {
        var estaciones = [];

        for (var i = 0; i < data.results.length; i++) {
          estaciones.push(data.results[i].parametro);
        }
        //estaciones.push(data.results.parametro);

        console.log(estaciones.unique());

      },
      xhrFields: {
        withCredentials: false
      },
      crossDomain: true,
      async:false
    });
  }

  function historico(ciudad, fecha){

  }
