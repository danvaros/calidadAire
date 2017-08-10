var top_ciudades = [];


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



  //pruebas con api
  getTop3ciudades('PM10');

  //adecuaciones de menu
  $('.navbar').css('height','30px');
  $('.navbar-default').css('background','#000');



  //llamadas ver
  $('#ver_top3').click(function(){
    event.preventDefault();
    crear_detalle_top(3);
  });
  $('#ver_top2').click(function(){
    event.preventDefault();
    crear_detalle_top(2);
  });
  $('#ver_top1').click(function(){
    event.preventDefault();
    crear_detalle_top(1);
  });
});

//funcion para quitar repetidos
Array.prototype.unique=function(a){
  return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
});

  function crear_detalle_top(indice){
      //top_ciudades[indice-1];
      var estacion = [];
      $('#titulo_detalle').html(top_ciudades[indice-1].city);
      $('#fecha_detalle').html(top_ciudades[indice-1].fecha);
      $('#contaminante_detalle').html(top_ciudades[indice-1].parametro);

      for (var i = 0; i < results.length; i++) {
          if(results[i].id == top_ciudades[indice-1].estacionesid){
            estacion  =  results[i];
            break;
          }
      }
      console.log('estacion');
      console.log(estacion);
      $('#estacion_detalle').html(estacion.nombre);

      var marker = L.marker([estacion.lat, estacion.long]).addTo(map_detalle);
      map_detalle.setView([estacion.lat, estacion.long], 16);


      $.ajax({
        type: 'GET',
        url: "https://api.datos.gob.mx/v1/sinaica?fecha="+anio+"-"+(mes+1)+"-"+dia+"&pageSize=2000&parametro=PM10",
        data: {},
        success: function( data, textStatus, jqxhr ) {

          // console.log('DATA');
          console.log(data);

          for (var i = 0; i < data.results[0].length; i++) {

          }

            //estaciones.push(data.results.stations[i].id);
            if(data.results[0]._id != "cve"){
              var contaminante = data.results[0].parametro;

                if (contaminante == 'PM10'){
                  estaciones.push(parseFloat(data.results[0].valororig));
                }

            }
        },
        xhrFields: {
          withCredentials: false
        },
        crossDomain: true,
        async:false
      });

  }


  function estado(estado){

    $.ajax({
      type: 'GET',
      url: "https://api.datos.gob.mx/v1/sinaica?fecha="+anio+"-"+(mes+1)+"-"+dia+"&pageSize=2000&parametro=PM10",
      data: {},
      success: function( data, textStatus, jqxhr ) {

        // console.log('DATA');
        console.log(data);

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

  function ciudadesEstado(estado, ciudad){}

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

  function historico(ciudad, fecha){}

  function getTop3ciudades(contaminante){
    var datedate = anio+"-"+mes+"-"+dia;
    console.log(datedate);
    $.ajax({
      type: 'GET',
      url: "https://api.datos.gob.mx/v1/sinaica?fecha="+datedate+"&pageSize=12000&parametro="+contaminante,
      data: {},
      success: function( data, textStatus, jqxhr ) {
        var ciudades = [];
        for (var i = 0; i < data.results.length; i++)
        {
          var objeto = data.results[i];
          var bandera =  false;

          if(ciudades.length != 0)
          {
            for (var j = 0; j < ciudades.length; j++)
            {
              if(ciudades[j].city == objeto.city )
              {
                bandera = true;
                if(ciudades[j].valororig < objeto.valororig){
                  ciudades[j] = objeto;
                }
              }
             }
            if(!bandera)
            {
              ciudades.push(objeto);
            }
          }
          else
          {
            ciudades.push(objeto);
          }
        }

        //ordenamos el arrglo para tomar los valores mas altos
        ciudades.sort(function (a, b) {
          if (a.valororig < b.valororig) {
            return 1;
          }
          if (a.valororig > b.valororig) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });

        console.log('ordenado');
        console.log(ciudades);
        var valor = ciudades[0].valororig;
        var valor2 = ciudades[1].valororig;
        var valor3 = ciudades[2].valororig;
        console.log(valor);
        console.log(valor2);
        console.log(valor3);
        $('.chart-gauge').html('');
        $('.chart-gauge').gaugeIt({selector:'.chart-gauge',value:valor});
        $('.chart-gauge2').html('');
        $('.chart-gauge2').gaugeIt({selector:'.chart-gauge2',value:valor2});
        $('.chart-gauge3').html('');
        $('.chart-gauge3').gaugeIt({selector:'.chart-gauge3',value:valor3});

        $('#label1').html(ciudades[0].city);
        $('#label2').html(ciudades[1].city);
        $('#label3').html(ciudades[2].city);

        top_ciudades = ciudades;
      },
      xhrFields: {
        withCredentials: false
      },
      crossDomain: true,
      async:false
    });
  }
