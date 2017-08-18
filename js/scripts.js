var top_ciudades = [];

$(document).ready(function(){
  //var estaciones  =  [];

  // //results.length
  // for (var i = 0; i < results.length; i++)
  // {
  //   var bandera = true;
  //   for (var j = 0; j < estaciones.length; j++) {
  //     if(estaciones[j].id == results[i].id){
  //       bandera = false;
  //       break;
  //     }
  //   }
  //   if(bandera){
  //     estaciones.push(results[i]);
  //   }
  // }
  // console.log('----------- estaciones ----------');
  // console.log(estaciones);
  // $('#estaciones_json').text(estaciones);


  // +++++++++++++++++ botonera inicial +++++++++++++++++++++++++
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
  // +++++++ fin botonera inicial +++++++++++++++++++++++++

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

    var tam = $( this ).val();
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
var greenIcon = L.icon({
    iconUrl: 'imagenes/punto.png',
    //shadowUrl: 'imagenes/leaf-shadow.png',

    // iconSize:     [20, 50], // size of the icon
    // shadowSize:   [30, 38], // size of the shadow
    // iconAnchor:   [12, 49], // point of the icon which will correspond to marker's location
    // shadowAnchor: [4, 36],  // the same for the shadow
    // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

//trabajremos en esta parte
  for (var i = 0; i < estaciones_json.length; i++) {
    marker_mymap  = L.marker([estaciones_json[i].lat, estaciones_json[i].long],{icon: greenIcon}).addTo(mymap);
    marker_mymap.bindPopup('<b>Estación #'+estaciones_json[i].id+'</b><br>Nombre :'+ estaciones_json[i].nombre +'<br>Codigo:'+estaciones_json[i].codigo+'<br><div style="margin-bottom: 25px; margin-top: 25px;" class="botonera"><a class="modal_mapa" data-id="'+ estaciones_json[i].id +'">Detalle Estación</a></div>').openPopup();
  }

  $(document).on('click', '.modal_mapa', function() {
    //sacar la estacion en particular solo id
    var id_estacion = $(this).data().id;
    var ciudad;

    for (var i = 0; i < estaciones_global.length; i++) {
      if(id_estacion ==  estaciones_global[i].estacionesid){
       ciudad  =  estaciones_global[i].city;
       break;
      }
    }

    console.log(id_estacion);
    console.log(ciudad);

    //cruzar el id con estaciones obscuras
    var estacion = [];
    for (var i = 0; i < estaciones_json.length; i++) {
        if(estaciones_json[i].id == id_estacion){
          estacion  = estaciones_json[i];
          break;
        }
    }

    var hoy =  convertDate(new Date());
    console.log("https://api.datos.gob.mx/v1/sinaica?parametro=PM10&city="+ciudad +"&fecha="+hoy+"&pageSize=12000");

    $.ajax({
      type: 'GET',
      url: "https://api.datos.gob.mx/v1/sinaica?parametro=PM10&city="+ciudad +"&fecha="+hoy+"&pageSize=12000",
      data: {},
      success: function( data, textStatus, jqxhr ) {
        var lectura_alta = [];
        if(data.results.length > 0)
        {
          for (var i = 0; i < data.results.length; i++) {
            if(lectura_alta[i]>0 && data.results[i].valororig >lectura_alta[0].valororig ){
              lectura_alta[0] = data.results[i];
              console.log(lectura_alta);
            }else{
              lectura_alta[0] = data.results[i];
              console.log(lectura_alta);
            }
          }


          $('#titulo_detalle').html(lectura_alta[0].city);
          $('#fecha_detalle').html(lectura_alta[0].fecha);
          $('#contaminante_detalle').html(lectura_alta[0].parametro);
          $('#estacion_detalle').html(estacion.nombre);

          //llamar pon historial
          put_his_estacion_val_max(lectura_alta[0],estacion);
        }else{
          alert('La estación no tiene mediciones este día');
        }

      },
      xhrFields: {
        withCredentials: false
      },
      crossDomain: true,
      async:false
    });




  });

  $('#estados').change(function(){
      var seleccionado = $(this).val();
      jQuery.each( coor_estado, function( i, val ) {
        if(seleccionado == val.estado){
            mymap.setView([val.lat, val.long], (val.zoom-1));
        }
      });
  });
});// fin de docuemnt ready

  //funcion para quitar repetidos
  Array.prototype.unique=function(a){
    return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
  });

  function convertDate(date) {
    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth()+1).toString();
    var dd  = date.getDate().toString();

    var mmChars = mm.split('');
    var ddChars = dd.split('');

    return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
  }

  function sumarDias(fecha, dias){
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }

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
      $( this ).text(Math.round(parametro*(index+1))+' días');
      $( this ).val(Math.round(parametro*(index+1)));
    });
  }

  var valores = [];
  var etiquetas = [];
  function put_his_estacion_val_max(lectura,estacion){
    //llamada para crear la grafica
    //https://api.datos.gob.mx/v1/sinaica?city=Guadalajara&pageSize=22245
    //"https://api.datos.gob.mx/v1/sinaica?city="+lectura.city+"&date-insert=[range:"+menos28+"T00:00:00%7C"+hoy+"T00:00:00]&pageSize=22245"
    var hoy = convertDate(new Date());
    var menos28 = convertDate(sumarDias(new Date(), -28));

    $.ajax({
      type: 'GET',
      url:"https://api.datos.gob.mx/v1/sinaica?parametro="+lectura.parametro+"&city="+lectura.city+"&date-insert=[range:"+menos28+"T00:00:00%7C"+hoy+"T23:59:59]&pageSize=22245",
      data: {},
      success: function( data, textStatus, jqxhr ) {
        var estacionesid = lectura.estacionesid;
        var his_estacion =  [];
        console.log(data);
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
        // creacion del arreglo que contiene los 28 dias
        var array28 =  [];

        for (var i = 0; i < 28; i++) {
          var f = convertDate(sumarDias(new Date(), -i));
          var r = {fecha:f, valororig:null};
          for (var j = 0; j < his_estacion.length; j++) {
            if(r.fecha == his_estacion[j].fecha){
              console.log('entro');
              r.valororig = his_estacion[j].valororig;
            }
          }
          array28.push(r);
        }

        for (var i = array28.length-1; i >= 0; i--) {
          etiquetas[(array28.length-1)-i]  = array28[i].fecha;
          valores[(array28.length-1)-i]  = array28[i].valororig;
        }

        console.log(array28);
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
      var estacion = [];
      for (var i = 0; i < estaciones_json.length; i++) {
          if(estaciones_json[i].id == top_ciudades[indice-1].estacionesid){
            estacion  = estaciones_json[i];
            break;
          }
      }

      $('#titulo_detalle').html(top_ciudades[indice-1].city);
      $('#fecha_detalle').html(top_ciudades[indice-1].fecha);
      $('#contaminante_detalle').html(top_ciudades[indice-1].parametro);
      $('#estacion_detalle').html(estacion.nombre);

      put_his_estacion_val_max(top_ciudades[indice-1],estacion);
  }

  function getTop3ciudades(contaminante){
    var datedate = anio+"-"+mes+"-"+dia;

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
        if(ciudades.length > 0){
          var valor =  ciudades[0].valororig;
          var valor2 = ciudades[1].valororig;
          var valor3 = ciudades[2].valororig;
          console.log(valor);
          console.log(valor2);
          console.log(valor3);
          //validamos si tenesmos que tratar el valor
          if (valor > Math.floor(valor)) valor = valor.toFixed(2);
          if (valor2 > Math.floor(valor2)) valor2 = valor2.toFixed(2);
          if (valor3 > Math.floor(valor3)) valor3 = valor3.toFixed(2);


          var tipoCon;
          switch(contaminante){
            case "NO2":
              tipoCon = 0.125;
            break;
            case "O3":
              tipoCon = 0.120;
            break;
            case "PM10":
                tipoCon = 1000;
            break;
            case "PM2.5":
              tipoCon = 1000;
            break;
            case "SO2":
              tipoCon = 0.20;
            break;
          }



          $('.chart-gauge').html('');
          $('.chart-gauge').gaugeIt({selector:'.chart-gauge',value:valor,gaugeMaxValue:tipoCon});
          $('.chart-gauge2').html('');
          $('.chart-gauge2').gaugeIt({selector:'.chart-gauge2',value:valor2,gaugeMaxValue:tipoCon});
          $('.chart-gauge3').html('');
          $('.chart-gauge3').gaugeIt({selector:'.chart-gauge3',value:valor3,gaugeMaxValue:tipoCon});

          $('#label1').html(ciudades[0].city);
          $('#label2').html(ciudades[1].city);
          $('#label3').html(ciudades[2].city);

          for (var i = 0; i < estaciones_json.length; i++) {
              if(estaciones_json[i].id == ciudades[1].estacionesid){
                estacion  =  estaciones_json[i];
                $('#estacion1').html('Estación: '+estacion.nombre);
                break;
              }
          }

          for (var i = 0; i < estaciones_json.length; i++) {
              if(estaciones_json[i].id == ciudades[2].estacionesid){
                estacion  =  estaciones_json[i];
                $('#estacion2').html('Estación: '+estacion.nombre);
                break;
              }
          }

          for (var i = 0; i < estaciones_json.length; i++) {
              if(estaciones_json[i].id == ciudades[3].estacionesid){
                estacion  =  estaciones_json[i];
                $('#estacion3').html('Estación: '+estacion.nombre);
                break;
              }
          }

          get_historico(ciudades[0],$('#linecustom1'));
          get_historico(ciudades[1],$('#linecustom2'));
          get_historico(ciudades[2],$('#linecustom3'));

        }

        top_ciudades = ciudades;
      },
      xhrFields: {
        withCredentials: false
      },
      crossDomain: true,
      async:true
    });
  }

  function get_historico(lectura,contenedor){
    var hoy = convertDate(new Date());
    var menos28 = convertDate(sumarDias(new Date(), -28));

    $.ajax({
      type: 'GET',
      url:"https://api.datos.gob.mx/v1/sinaica?parametro="+lectura.parametro+"&city="+lectura.city+"&date-insert=[range:"+menos28+"T00:00:00%7C"+hoy+"T23:59:59]&pageSize=22245",
      data: {},
      success: function( data, textStatus, jqxhr ) {
        var estacionesid = lectura.estacionesid;
        var his_estacion =  [];
        console.log(data);
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
        // creacion del arreglo que contiene los 28 dias
        var array28 =  [];

        for (var i = 0; i < 28; i++) {
          var f = convertDate(sumarDias(new Date(), -i));
          var r = {fecha:f, valororig:null};
          for (var j = 0; j < his_estacion.length; j++) {
            if(r.fecha == his_estacion[j].fecha){
              console.log('entro');
              r.valororig = his_estacion[j].valororig;
            }
          }
          array28.push(r);
        }
        var valores2 =  [];
        var etiquetas2 =  [];
        for (var i = array28.length-1; i >= 0; i--) {
          etiquetas2[(array28.length-1)-i]  = array28[i].fecha;
          valores2[(array28.length-1)-i]  = array28[i].valororig;
        }

        put_grafica_inline(valores2,contenedor);

      },
      xhrFields: {
        withCredentials: false
      },
      crossDomain: true,
      async:true
    });
  }


  function put_grafica_inline(valores,contenedor){
    var options =  {
      height: '1.4em', width: '8em', lineColor: '#fff', fillColor: '#a4b6da',
      minSpotColor: false, maxSpotColor: false, spotColor: '#fff', spotRadius: 3
    }

    contenedor.sparkline(valores,options);
  }

  var estaciones_global =  [];
  function get_estaciones(){
      var datedate = anio+"-"+mes+"-"+dia;
      console.log(datedate);

      $.ajax({
        type: 'GET',
        url: "https://api.datos.gob.mx/v1/sinaica?fecha="+datedate+"&pageSize=12000",
        data: {},
        success: function( data, textStatus, jqxhr ) {
          var estations = [];

          for (var i = 0; i < data.results.length; i++) {
            estations.push(data.results[i]);
          }
          //estaciones.push(data.results.parametro);

          console.log(estations.unique());
          estaciones_global = estations;
        },
        xhrFields: {
          withCredentials: false
        },
        crossDomain: true,
        async:false
      });
    }
