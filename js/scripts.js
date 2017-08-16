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

  $('.modal').modal();

  $('.parametro').click(function(){
    event.preventDefault();
    $('.parametro').each(function(index){
      $( this ).removeClass('active');
    });

    $( this ).addClass('active');

    var tam = $( this ).text();
    if(tam != valores.length){
      var valores_reducido = [];
      var etiquetas_reducido = [];
      for (var i = 0; i < tam; i++) {
        valores_reducido[i] =  valores[i];
        etiquetas_reducido[i] =  etiquetas[i];
      }
      actualizar_grafica_detalle(valores_reducido,etiquetas_reducido);
    }else{
      actualizar_grafica_detalle(valores,etiquetas);
    }
  });

var marker_mymap;
  for (var i = 0; i < 30; i++) {
    marker_mymap  = L.marker([results[i].lat, results[i].long]).addTo(mymap);
    marker_mymap.bindPopup('<b>Estación #'+results[i].id+'</b><br>Nombre :'+ results[i].nombre +'<br>Codigo:'+results[i].codigo+'<br><div style="    margin-bottom: 25px; margin-top: 25px;" class="botonera"><a href="#modal1">Detalle Estación</a></div>').openPopup();
  }


  $('#estados').change(function(){
      var seleccionado = $(this).val();
      jQuery.each( coor_estado, function( i, val ) {
        if(seleccionado == val.estado){
            mymap.setView([val.lat, val.long], val.zoom);
        }
      });
  });
});// fin de docuemnt ready

  //funcion para quitar repetidos
  Array.prototype.unique=function(a){
    return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
  });

  function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
  }

  function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
  }

  function actualizar_grafica_detalle(valores,etiquetas){
    chart.data.datasets[0].data =  valores;
    chart.data.labels =  etiquetas;
    chart.update();
  }

  function poner_botones(valores){
    var parametro =  valores.length/4

    $('.parametro').each(function(index){
      $( this ).text(Math.round(parametro*(index+1)));
    });
  }

  var valores = [];
  var etiquetas = [];

  function put_his_estacion_val_max(estacion_id,ciudad,estacion){
    //llamada para crear la grafica
    //https://api.datos.gob.mx/v1/sinaica?city=Guadalajara&pageSize=22245
    $.ajax({
      type: 'GET',
      url:"https://api.datos.gob.mx/v1/sinaica?city="+ciudad+"&pageSize=22245",
      data: {},
      success: function( data, textStatus, jqxhr ) {
        var estacionesid = estacion_id;
        var his_estacion =  [];

        //sacar valores solo de la estacion y ademas solo los mas altos
        for (var i = 0; i < data.results.length; i++)
        {
          var objeto = data.results[i];
          var bandera =  false;
          if(objeto.estacionesid == estacionesid)
          {
            if(his_estacion.length != 0)
            {
              for (var j = 0; j < his_estacion.length; j++)
              {
                if(his_estacion[j].fecha == objeto.fecha )
                {
                  bandera = true;
                  if(his_estacion[j].valororig < objeto.valororig){
                    his_estacion[j] = objeto;
                  }
                  break;
                }
              }
              if(!bandera)
              {
                his_estacion.push(objeto);
              }
            }
            else
            {
              his_estacion.push(objeto);
            }
          }
        }
        //llamar para crear la grafica

        for (var i = 0; i < his_estacion.length; i++) {
          etiquetas[i]  = his_estacion[i].fecha;
          valores[i]  = his_estacion[i].valororig;
        }
        actualizar_grafica_detalle(valores,etiquetas);
        poner_botones(valores);
        $('#modal1').modal('open');
        var marker = L.marker([estacion.lat, estacion.long]).addTo(map_detalle);
        map_detalle.setView([estacion.lat, estacion.long], 16);
      },
      xhrFields: {
        withCredentials: false
      },
      crossDomain: true,
      async:true
    });
  }

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

      $('#estacion_detalle').html(estacion.nombre);

      put_his_estacion_val_max(top_ciudades[indice-1].estacionesid, top_ciudades[indice-1].city,estacion);
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

<<<<<<< HEAD
=======
  function ciudadesEstado(estado, ciudad){}

>>>>>>> master
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

<<<<<<< HEAD
  function historico(ciudad, fecha){
    // Debe mostrar el historial del día por contaminante en cada ciudad
=======
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
      async:true
    });
>>>>>>> master
  }
