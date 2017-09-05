var top_ciudades = [];
var ant = 28;
var ant_val_arr = [];
var ant_lab_arr = [];
var meses_abr = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
];

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

  //llamadas ver
  $('#ver_top3').click(function(event){
    event.preventDefault();
    crear_detalle_top(3);
    ant_val_arr = [];
    ant_lab_arr = [];
    ant = 28;
  });

  $('#ver_top2').click(function(event){
    event.preventDefault();
    crear_detalle_top(2);
    ant_val_arr = [];
    ant_lab_arr = [];
    ant = 28;
  });

  $('#ver_top1').click(function(event){
    event.preventDefault();
    crear_detalle_top(1);
    ant_val_arr = [];
    ant_lab_arr = [];
    ant = 28;
  });

  $('.modal').modal();

  $('.parametro').click(function(){
    event.preventDefault();
    $('.parametro').each(function(index){
      $( this ).removeClass('active');
    });


    $( this ).addClass('active');
    var boton = parseInt($( this ).val());
    if(ant > boton){
      var tam =  ant - boton;
      for (var i = 0; i < tam; i++) {
        ant_val_arr.push(chart.data.datasets[0].data.splice(0, 1));
        ant_lab_arr.push(chart.data.labels.splice(0, 1));
      }
    }else if(ant < boton){
      var tam = boton - ant;
      for (var i = 0; i < tam; i++) {
        chart.data.datasets[0].data.unshift(ant_val_arr.pop()[0]);
        chart.data.labels.unshift(ant_lab_arr.pop()[0]);
      }
    }

    ant = boton;
    chart.update();

    console.log(ant_lab_arr);
    console.log(ant_val_arr);
    // if($( this ).val() == 28){
    //   chart.data.labels.splice(0, 1);
    //   chart.data.datasets[0].data.splice(0, 1);
    //   console.log('disminuir');
    // }else{
    //   console.log('aumentar');
    //   chart.data.labels.unshift('24-08-2017');
    //   chart.data.datasets[0].data.unshift(10);
    // }

    // var tam = 28 - $( this ).val();
    // if(tam != valores.length){
    //   var valores_reducido = [];
    //   var etiquetas_reducido = [];
    //   console.log(valores);
    //   for (var i = tam; i < valores.length; i++){
    //     valores_reducido[i] =  valores[i];
    //     etiquetas_reducido[i] =  etiquetas[i];
    //   }
    //   actualizar_grafica_detalle(valores_reducido,etiquetas_reducido);
    // }else{
    //   actualizar_grafica_detalle(valores,etiquetas);
    // }
  });

var marker_mymap;
var test
var myFeatureGroup = L.featureGroup().addTo(mymap).on("click", groupClick);
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

    marker_mymap  = L.marker([estaciones_json[i].lat, estaciones_json[i].long],{icon: greenIcon}).addTo(myFeatureGroup).bindPopup("Cargando...");;
    marker_mymap.idestacion = estaciones_json[i].id;
    marker_mymap.idarray = i;

    //.addTo(mymap);


    // marker_mymap.bindPopup('<b>Estación #'+estaciones_json[i].id+'</b><br>Nombre :'+ estaciones_json[i].nombre +'<br>Codigo:'+estaciones_json[i].codigo+'<br><div style="margin-bottom: 25px; margin-top: 25px;" class="botonera"><div class="lista_con"><ul><li>'+ pm10 +'</li></ul><div><a class="modal_mapa" data-id="'+ estaciones_json[i].id +'">Detalle Estación</a></div>').openPopup();
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
          $('#contaminante_grafica').html(lectura_alta[0].parametro);

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
          v = array28[i].valororig;
          if(v > Math.floor(v)) v = v.toFixed(3);

          var today = new Date(array28[i].fecha);
          var dd = today.getDate();
          var mm = today.getMonth(); //January is 0!
          valores[(array28.length-1)-i]  = v;
          etiquetas[(array28.length-1)-i]  = dd+'-'+meses_abr[mm];
        }

        console.log(array28);
        actualizar_grafica_detalle(valores,etiquetas);
        poner_botones(valores);
        $('#modal1').modal('open');
        //document.getElementById("modal1").modal('open');
        //$( "#abremodal" ).trigger( "click" );
        //$('#modal1').openModal();
        //openModal
        // var marker = L.marker([estacion.lat, estacion.long]).addTo(map_detalle);
        // map_detalle.setView([estacion.lat, estacion.long], 16);
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
      $('#contaminante_grafica').html(top_ciudades[indice-1].parametro);

      put_his_estacion_val_max(top_ciudades[indice-1],estacion);
      put_contaminantes(top_ciudades[indice-1],estacion);
  }

  function put_contaminantes(lectura,estacion){
    console.log(lectura);
    console.log(estacion);
    var valPM10 = $('#valPM10');
    getMasAlto('PM10',lectura.city,estacion.id,valPM10);
    var valPM25 = $('#valPM25');
    getMasAlto('PM2.5',lectura.city,estacion.id,valPM25);
    var valN02 = $('#valN02');
    getMasAlto('NO2',lectura.city,estacion.id,valN02);
    var valS02 = $('#valS02');
    getMasAlto('SO2',lectura.city,estacion.id,valS02);
    var valO3 = $('#valO3');
    getMasAlto('O3',lectura.city,estacion.id,valO3);
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

        //ordenamos el arreglo para tomar los valores mas altos
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
              tipoCon = 0.315;
            break;
            case "O3":
              tipoCon = 0.181;
            break;
            case "PM10":
                tipoCon = 158;
            break;
            case "PM2.5":
              tipoCon = 158;
            break;
            case "SO2":
              tipoCon = 0.32;
            break;
            case "CO":
              tipoCon = 16.5;
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
              if(estaciones_json[i].id == ciudades[0].estacionesid){
                estacion  =  estaciones_json[i];
                $('#estacion1').html('Estación: '+ estacion.nombre);
                break;
              }
          }

          for (var i = 0; i < estaciones_json.length; i++) {
              if(estaciones_json[i].id == ciudades[1].estacionesid){
                estacion  =  estaciones_json[i];
                $('#estacion2').html('Estación: '+estacion.nombre);
                break;
              }
          }

          for (var i = 0; i < estaciones_json.length; i++) {
              if(estaciones_json[i].id == ciudades[2].estacionesid){
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
        var valores2 = [];
        var etiquetas2 =  [];
        // for (var i = array28.length-1; i >= 0; i--) {
        //   etiquetas2[(array28.length-1)-i]  = array28[i].fecha;
        //   valores2[(array28.length-1)-i]  = array28[i].valororig;
        // }


        for (var i = array28.length-1; i >= 0; i--) {
          v = array28[i].valororig;
          if(v > Math.floor(v)) v = v.toFixed(3);

          var today = new Date(array28[i].fecha);
          var dd = today.getDate();
          var mm = today.getMonth(); //January is 0!
          valores2[(array28.length-1)-i]  = v;
          etiquetas2[(array28.length-1)-i]  = dd+'-'+meses_abr[mm];
        }


        valores2[0] = 0;
        put_grafica_inline(valores2,contenedor,etiquetas2);

      },
      xhrFields: {
        withCredentials: false
      },
      crossDomain: true,
      async:true
    });
  }

// fillColor: '#a4b6da'
  function put_grafica_inline(valores,contenedor,etiquetas2){
    var options =  {
      type: "line",
      height: '3em',
      width: '8em',
      lineColor: '#fff',
      fillColor: false,
      minSpotColor: false,
      maxSpotColor: false,
      spotColor: false,
      spotRadius: 3,
      highlightLineColor: '#fff',
      highlightSpotColor: '#000',
      tooltipFormat: '{{offset:offset}} {{value}} <br> {{prefix}}{{y}}{{suffix}}' ,
      tooltipValueLookups: {
        'offset': etiquetas2
        // 'offset': {
        //     0: '09-Ago',
        //     1: '09-Ago',
        //     2: '09-Ago',
        //     3: '09-Ago',
        //     4: '09-Ago',
        //     5: '09-Ago',
        // }
    },
    }

    console.log(etiquetas2);

    // valores = [100.00,100.00,100.00,80.00,80.00,66.67];
    contenedor.show();
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

  function getMasAlto(contaminante,ciudad,idEstacion,contenedor){
      var datedate = anio+"-"+mes+"-"+dia;

      $.ajax({
        type: 'GET',
        url: "https://api.datos.gob.mx/v1/sinaica?city="+ciudad+"&fecha="+datedate+"&pageSize=12000&parametro="+contaminante,
        data: {},
        success: function( data, textStatus, jqxhr ) {
          console.log(data);
          var masAlto =  data.results[0];

          for (var i = 0; i < data.results.length; i++)
          {
            if(data.results[i].estacionesid == idEstacion){
              if( data.results[i].valororig > masAlto.valororig ){
                masAlto =  data.results[i];
              }
            }
          }
          if(contaminante ==  'PM10' || contaminante == 'PM2.5')
            contenedor.html(''+masAlto.valororig.toFixed(1));
          else
            contenedor.html(''+masAlto.valororig.toFixed(3));
        },
        xhrFields: {
          withCredentials: false
        },
        crossDomain: true,
        async:true
      });
    }

  function getFormatDateAPI(d){
    var fecha = d.getFullYear()+'-'+ meis[d.getMonth()] +'-'+((d.getDate() < 10?'0':'') + d.getDate())      +'T'+ ( (d.getHours() < 10?'0':'') + d.getHours() ) +':'+( (d.getMinutes()<10?'0':'') + d.getMinutes() )+':00';
    return fecha;
  }

  //funcucion que consigue agrupar los datos de una estacion
  function getUniqueEstation(json){
    var arrEstaciones = [];
    for (var i = 0; i < json.length; i++) {
      if(!arrEstaciones[json[i].estacionesid])
        arrEstaciones[json[i].estacionesid] = [];
      arrEstaciones[json[i].estacionesid].push(json[i]);
    }
    return arrEstaciones;
  }

  var arrEstaciones;
  function getTop3ciudadesV2(contaminante,tipo,maximo){

    $('#linecustom1').hide();
    $('#linecustom2').hide();
    $('#linecustom3').hide();

    const dActual = new Date();
    var dPasada = new Date();
    var reMin = 1;

    if('8h' ==  tipo){
      dPasada.setHours(dActual.getHours() - 8);
      reMin = 4;
    }else if('24h' == tipo){
      dPasada.setHours(dActual.getHours() - 24);
      reMin = 12;
    }else{
      dPasada.setHours(dActual.getHours() - 2);
    }

    console.log(dActual);
    console.log(dPasada);
    console.log(getFormatDateAPI(dActual));

    var ruta = "https://api.datos.gob.mx/v1/sinaica?parametro="+ contaminante +"&date-insert=[range:"+getFormatDateAPI(dPasada)+"%7C"+getFormatDateAPI(dActual)+"]";

      console.log(ruta);

      $.ajax({
        type: 'GET',
        url: ruta+'&pageSize=1',
        data: {},
        success: function( data, textStatus, jqxhr ) {

          //sacamos el numero de total de registros
          var size =  data.pagination.total;

          $.ajax({
            type: 'GET',
            url: ruta+'&pageSize=' + size,
            data: {},
            success: function( data, textStatus, jqxhr ) {

              arrEstaciones = getUniqueEstation(data.results);

              arrEstaciones.forEach(function(item, index){
                var promedio = 0;
                var sum = 0;
                //validadando que tenga mas de 12 registros para hacer la evaluacion de 24 horas
                if(item.length >= reMin){
                  item.forEach(function(item2, index2){
                    //validacion que no supere el limite establecido
                    if(item2.valororig < maximo)
                      sum = sum + item2.valororig;
                  });
                  promedio = sum / item.length;
                  //agregamos la suma y el pormedio al json de las estacion
                  item.suma  =  sum;
                  item.promedio =  promedio;
                }else{
                  item.suma  =  0;
                  item.promedio =  0;
                }

              });

              arrEstaciones.sort(function (a, b) {
                if (a.promedio < b.promedio) {
                  return 1;
                }
                if (a.promedio > b.promedio) {
                  return -1;
                }
                // a must be equal to b
                return 0;
              });

              console.log(arrEstaciones);

              if(arrEstaciones.length > 0){

                var ciudades = [];
                var contador =  0;
                for (var i = 0; i < arrEstaciones.length; i++) {
                  var repetido = false;
                  if(contador == 3){
                    break;
                  }

                  if(contador == 0){
                    ciudades.push(arrEstaciones[i]);
                    contador++;
                  }
                  else
                  {
                    for (var j = 0; j < ciudades.length; j++) {
                      if(arrEstaciones[i][0].city == ciudades[j][0].city){
                        repetido = true;
                      }
                    }

                    if(!repetido){
                      ciudades.push(arrEstaciones[i]);
                      contador++;
                    }
                  }
                }

                var valor =  ciudades['0'].promedio;
                var valor2 = ciudades['1'].promedio;
                var valor3 = ciudades['2'].promedio;
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
                    tipoCon = 0.315;
                  break;
                  case "O3":
                    tipoCon = 0.181;
                  break;
                  case "PM10":
                      tipoCon = 158;
                  break;
                  case "PM2.5":
                    tipoCon = 158;
                  break;
                  case "SO2":
                    tipoCon = 0.32;
                  break;
                  case "CO":
                    tipoCon = 16.5;
                  break;
                }

                $('.chart-gauge').html('');
                $('.chart-gauge').gaugeIt({selector:'.chart-gauge',value:valor,gaugeMaxValue:tipoCon});
                $('.chart-gauge2').html('');
                $('.chart-gauge2').gaugeIt({selector:'.chart-gauge2',value:valor2,gaugeMaxValue:tipoCon});
                $('.chart-gauge3').html('');
                $('.chart-gauge3').gaugeIt({selector:'.chart-gauge3',value:valor3,gaugeMaxValue:tipoCon});

                $('#label1').html(ciudades['0'][0].city);
                $('#label2').html(ciudades['1'][0].city);
                $('#label3').html(ciudades['2'][0].city);

                for (var i = 0; i < estaciones_json.length; i++) {
                    if(estaciones_json[i].id == ciudades[0][0].estacionesid){
                      estacion  =  estaciones_json[i];
                      $('#estacion1').html('Estación: '+ estacion.nombre);
                      break;
                    }
                }

                for (var i = 0; i < estaciones_json.length; i++) {
                    if(estaciones_json[i].id == ciudades[1][0].estacionesid){
                      estacion  =  estaciones_json[i];
                      $('#estacion2').html('Estación: '+estacion.nombre);
                      break;
                    }
                }

                for (var i = 0; i < estaciones_json.length; i++) {
                    if(estaciones_json[i].id == ciudades[2][0].estacionesid){
                      estacion  =  estaciones_json[i];
                      $('#estacion3').html('Estación: '+estacion.nombre);
                      break;
                    }
                }

                get_historico(ciudades[0][0],$('#linecustom1'));
                get_historico(ciudades[1][0],$('#linecustom2'));
                get_historico(ciudades[2][0],$('#linecustom3'));

                var ciudades2 = [];
                            ciudades2.push(ciudades[0][0]);
                            ciudades2.push(ciudades[1][0]);
                            ciudades2.push(ciudades[2][0]);
                top_ciudades = ciudades2;
              }

            },
            xhrFields: {
              withCredentials: false
            },
            crossDomain: true,
            async:true
          });
        },
        xhrFields: {
          withCredentials: false
        },
        crossDomain: true,
        async:true
      });
    }

    function get_dato_estacion_mas_actual(contaminante,estacion){
      var resultado = -1;
      const dActual = new Date();
      var dPasada = new Date();

      dPasada.setHours(dActual.getHours() - 8);

      var ruta = "https://api.datos.gob.mx/v1/sinaica?parametro="+ contaminante +"&date-insert=[range:"+getFormatDateAPI(dPasada)+"%7C"+getFormatDateAPI(dActual)+"]";
      $.ajax({
        type: 'GET',
        url: ruta+'&pageSize=1',
        data: {},
        success: function( data, textStatus, jqxhr ) {
          var size =  data.pagination.total;
          $.ajax({
            type: 'GET',
            url: ruta+'&pageSize=' + size,
            data: {},
            success: function( data, textStatus, jqxhr ) {
              for (var i = 0; i < data.results.length; i++) {

                if(data.results[i].estacionesid == estacion && data.results[i].validoorig == 1){
                    resultado = data.results[i].valororig;
                    console.log(resultado);
                    break;
                }
              }
             },
              xhrFields: {
                withCredentials: false
              },
              crossDomain: true,
              async:false
            });
         },
          xhrFields: {
            withCredentials: false
          },
          crossDomain: true,
          async:false
        });
        console.log(resultado);
        return resultado;
    }

  function groupClick(event) {

    var popup = event.layer._popup;
    var estacion  = event.layer.idestacion;
    var array  = event.layer.idarray;
    console.log(event);
    console.log(estacion);
    var pm10 = get_dato_estacion_mas_actual('PM10',estacion);
    var pm25 = get_dato_estacion_mas_actual('PM2.5',estacion);
    var so2 = get_dato_estacion_mas_actual('SO2',estacion);
    var no2 = get_dato_estacion_mas_actual('NO2',estacion);
    var ozono = get_dato_estacion_mas_actual('O3',estacion);


    var lista = '<ul>'+
                  '<li>PM10:  '+ ((pm10 != -1)?  pm10 :'No tiene valor') +'</li>'+
                  '<li>PM2.5: '+ ((pm25 != -1)?  pm25 :'No tiene valor') +'</li>'+
                  '<li>SO2:   '+ ((so2 != -1)?   so2  :'No tiene valor') +'</li>'+
                  '<li>NO2:   '+ ((no2  != -1)?  no2  :'No tiene valor') +'</li>'+
                  '<li>O3:    '+ ((ozono != -1)? ozono:'No tiene valor') +'</li>'+
                '</ul>';


    var info = '<b>Estación #'+estaciones_json[array].id+'</b><br>Nombre :'+ estaciones_json[array].nombre +'<br>Codigo:'+estaciones_json[array].codigo+'<br><div style="margin-bottom: 25px; margin-top: 25px;" class="botonera"><div class="lista_con">'+lista+'<div><br><a class="modal_mapa" data-id="'+ estaciones_json[array].id +'">Detalle Estación</a></div>';

    popup.setContent( 'cambiamos el pop up ' + info);
    popup.update();
  }
