var top_ciudades = [];
var ant = 28;
var ant_val_arr = [];
var ant_lab_arr = [];


var boton_activo;
var mini_graf = [];
var mini_etiquetas = [];
var min_grafMax = 0;


$(document).ready(function(){
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


  //inicializacion selects
  $('select').material_select();

  //llamadas ver
  $('#ver_top3').click(function(event){
    event.preventDefault();
    crear_detalle_top(3);
    ant_val_arr = [];
    ant_lab_arr = [];
    ant = 28;
    boton_activo.removeClass('active_graf');
    boton_activo = $('#valPM1024H');
    boton_activo.addClass('active_graf');
    reset_botones();
  });

  $('#ver_top2').click(function(event){
    event.preventDefault();
    crear_detalle_top(2);
    ant_val_arr = [];
    ant_lab_arr = [];
    ant = 28;
    boton_activo.removeClass('active_graf');
    boton_activo = $('#valPM1024H');
    boton_activo.addClass('active_graf');
    reset_botones();
  });

  $('#ver_top1').click(function(event){
    event.preventDefault();
    crear_detalle_top(1);
    ant_val_arr = [];
    ant_lab_arr = [];
    ant = 28;
    boton_activo.removeClass('active_graf');
    boton_activo = $('#valPM1024H');
    boton_activo.addClass('active_graf');
    reset_botones();
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
  });

  var marker_mymap;
  var test
  var myFeatureGroup = L.featureGroup().addTo(mymap).on("click", groupClick);
  var greenIcon = L.icon({
      iconUrl: 'imagenes/punto.png',
      //shadowUrl: 'imagenes/leaf-shadow.png',

      // iconSize:     [20, 50], // size of the icon
      // shadowSize:   [30, 38], // size of the shadow
       iconAnchor:   [12, 24], // point of the icon which will correspond to marker's location
      // shadowAnchor: [4, 36],  // the same for the shadow
      // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });

  //trabajremos en esta parte
  for (var i = 0; i < estaciones_json.length; i++) {

    marker_mymap  = L.marker([estaciones_json[i].lat, estaciones_json[i].long],{icon: greenIcon}).addTo(myFeatureGroup).bindPopup("Cargando...");;
    marker_mymap.idestacion = estaciones_json[i].id;
    marker_mymap.idarray = i;
  }

  $(document).on('click', '.modal_mapa', function() {
    reset_botones();
    //sacar la estacion en particular solo id
    var id_estacion = $(this).data().id;
    var ciudad;

    boton_activo.removeClass('active_graf');
    boton_activo = $('#valPM1024H');
    boton_activo.addClass('active_graf');

    for (var i = 0; i < estaciones_global.length; i++) {
      if(id_estacion ==  estaciones_global[i].estacionesid){
       ciudad  =  estaciones_global[i].city;
       break;
      }
    }

    put_contaminantes(ciudad,id_estacion);
    //cruzar el id con estaciones obscuras
    var estacion = [];
    for (var i = 0; i < estaciones_json.length; i++) {
        if(estaciones_json[i].id == id_estacion){
          estacion  = estaciones_json[i];
          break;
        }
    }

    var hoy =  convertDate(new Date());

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

            }else{
              lectura_alta[0] = data.results[i];

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
  boton_activo = $('#valPM1024H');
  $('#PM1024H').click(function(){
    var contaminante = 'PM10';
    var tipo = '24h';
    var maximo = 158;
    valores = [];
    etiquetas = [];
    ant_val_arr = [];
    ant_lab_arr = [];
    ant = 28;

    boton_activo.removeClass('active_graf');
    boton_activo = $('#valPM1024H');
    boton_activo.addClass('active_graf');
    get_historico_horas(contaminante,tipo,maximo,i);
    actualizar_grafica_detalle(valores,etiquetas);

    $('#contaminante_grafica').html('PM10');
    reset_botones();
  });
  $('#PM2524H').click(function(){
    var contaminante = 'PM2.5';
    var tipo = '24h';
    var maximo = 158;
    valores = [];
    etiquetas = [];
    ant_val_arr = [];
    ant_lab_arr = [];
    ant = 28;

    boton_activo.removeClass('active_graf');
    boton_activo = $('#valPM2524H');
    boton_activo.addClass('active_graf');

    get_historico_horas(contaminante,tipo,maximo,i);
    $('#contaminante_grafica').html('PM2.5');
    actualizar_grafica_detalle(valores,etiquetas);
    reset_botones();
  });
  $('#SO224H').click(function(){

    var contaminante = 'SO2';
    var tipo = '24h';
    var maximo = 0.32;
    valores = [];
    etiquetas = [];
    ant_val_arr = [];
    ant_lab_arr = [];
    ant = 28;

    boton_activo.removeClass('active_graf');
    boton_activo = $('#valS0224H');
    boton_activo.addClass('active_graf');

      get_historico_horas(contaminante,tipo,maximo,i);
    $('#contaminante_grafica').html('SO2');
    actualizar_grafica_detalle(valores,etiquetas);
    reset_botones();
  });
  $('#SO28H').click(function(){
    var contaminante = 'SO2';
    var tipo = '8h';
    var maximo = 0.32;
    valores = [];
    etiquetas = [];
    ant_val_arr = [];
    ant_lab_arr = [];
    ant = 28;

    boton_activo.removeClass('active_graf');
    boton_activo = $('#valS028H');
    boton_activo.addClass('active_graf');
      get_historico_horas(contaminante,tipo,maximo,i);
    $('#contaminante_grafica').html('SO2');
    actualizar_grafica_detalle(valores,etiquetas);
    reset_botones();
  });
  $('#O38H').click(function(){
    var contaminante = 'O3';
    var tipo = '8h';
    var maximo = 0.181;
    valores = [];
    etiquetas = [];
    ant_val_arr = [];
    ant_lab_arr = [];
    ant = 28;

    boton_activo.removeClass('active_graf');
    boton_activo = $('#valO38H');
    boton_activo.addClass('active_graf');
    get_historico_horas(contaminante,tipo,maximo,i);
    $('#contaminante_grafica').html('O3');
    actualizar_grafica_detalle(valores,etiquetas);
    reset_botones();
  });
  $('#SO2DH').click(function(){
    var contaminante = 'SO2';
    var tipo = '8h';
    var maximo = 0.32;
    valores = [];
    etiquetas = [];
    ant_val_arr = [];
    ant_lab_arr = [];
    ant = 28;

    boton_activo.removeClass('active_graf');
    boton_activo = $('#valS02DH');
    boton_activo.addClass('active_graf');
    get_historico_horas(contaminante,tipo,maximo,i);
    $('#contaminante_grafica').html('SO2');
    actualizar_grafica_detalle(valores,etiquetas);
    reset_botones();
  });
  $('#O3DH').click(function(){
    var contaminante = 'O3';
    var tipo = 'D';
    var maximo =  0.181;
    valores = [];
    etiquetas = [];
    ant_val_arr = [];
    ant_lab_arr = [];
    ant = 28;

    boton_activo.removeClass('active_graf');
    boton_activo = $('#valO3DH');
    boton_activo.addClass('active_graf');
    get_historico_horas(contaminante,tipo,maximo,i);
    $('#contaminante_grafica').html('O3');
    actualizar_grafica_detalle(valores,etiquetas);
    reset_botones();
  });

  $('#NO2DH').click(function(){
    var contaminante = 'NO2';
    var tipo = 'D';
    var maximo =  0.315;
    valores = [];
    etiquetas = [];
    ant_val_arr = [];
    ant_lab_arr = [];
    ant = 28;

    boton_activo.removeClass('active_graf');
    boton_activo = $('#valN02DH');
    boton_activo.addClass('active_graf');
    get_historico_horas(contaminante,tipo,maximo,i);
    actualizar_grafica_detalle(valores,etiquetas);
    $('#contaminante_grafica').html('NO2');
    reset_botones();
  });

  $('#CO8H').click(function(){
    var contaminante = 'CO';
    var tipo = '8h';
    var maximo =  16.5;
    valores = [];
    etiquetas = [];
    ant_val_arr = [];
    ant_lab_arr = [];
    ant = 28;

    boton_activo.removeClass('active_graf');
    boton_activo = $('#valCO8H');
    boton_activo.addClass('active_graf');
    get_historico_horas(contaminante,tipo,maximo,i);
    actualizar_grafica_detalle(valores,etiquetas);
    $('#contaminante_grafica').html('CO');
    reset_botones();
  });

});// fin de document ready

//funcion para quitar repetidos
Array.prototype.unique=function(a){
  return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
});

  var arrEstaciones;
  function getTop3ciudadesV2(contaminante,tipo,maximo){

  $('#linecustom1').hide();
  $('#linecustom2').hide();
  $('#linecustom3').hide();

  const dActual = new Date();
  var dPasada = new Date();
  var reMin = 1;
  var horas = 1;

  if('8h' ==  tipo){
    dPasada.setHours(dActual.getHours() - 8);
    reMin = 4;
    horas = 8;
  }else if('24h' == tipo){
    dPasada.setHours(dActual.getHours() - 24);
    reMin = 12;
    horas = 24;
  }else{
    dPasada.setHours(dActual.getHours() - 2);
  }

  var ruta = "https://api.datos.gob.mx/v1/sinaica?pageSize=1200&parametro="+ contaminante +"&date-insert=[range:"+getFormatDateAPI(dPasada)+"%7C"+getFormatDateAPI(dActual)+"]";

  $.ajax({
    type: 'GET',
    url: ruta,
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
            if(item2.valororig < maximo){
              sum = sum + item2.valororig;
            }
          });
          promedio = sum / item.length;
          //agregamos la suma y el pormedio al json de las estacion
          item.suma  =  sum;
          item.promedio =  promedio;
        }
        else{
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

      //preguntamos se lleno el arreglo con los datos necesarios
      if(arrEstaciones.length > 0){

        //creamos un arreglo de ciudades para poder comparar
        //las ciudades y que estas no se repitan
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

        //guardamos los valores de las 3 ciudades
        var valor =  ciudades['0'].promedio;
        var valor2 = ciudades['1'].promedio;
        var valor3 = ciudades['2'].promedio;

        //se truncan al numero de decimales deceado
        if(contaminante ==  'PM10' || contaminante == 'PM2.5'){
          valor = valor.toFixed(1);
          valor2 = valor2.toFixed(1);
          valor3 = valor3.toFixed(1);
        }
        else{
          valor = valor.toFixed(3);
          valor2 = valor2.toFixed(3);
          valor3 = valor3.toFixed(3);
        }

        //se llama a la funcion que crea los odometros
        $('.chart-gauge').html('');
        $('.chart-gauge').gaugeIt({selector:'.chart-gauge',value:valor,gaugeMaxValue:maximo});
        $('.chart-gauge2').html('');
        $('.chart-gauge2').gaugeIt({selector:'.chart-gauge2',value:valor2,gaugeMaxValue:maximo});
        $('.chart-gauge3').html('');
        $('.chart-gauge3').gaugeIt({selector:'.chart-gauge3',value:valor3,gaugeMaxValue:maximo});

        //se pasan la etiquetas correspondientes
        $('#label1').html(ciudades['0'][0].city);
        $('#label2').html(ciudades['1'][0].city);
        $('#label3').html(ciudades['2'][0].city);

        var estacion1;
        for (var i = 0; i < estaciones_json.length; i++) {
          if(estaciones_json[i].id == ciudades[0][0].estacionesid){
            estacion1  =  estaciones_json[i];
            $('#estacion1').html('Estación: '+ estacion1.nombre);
            break;
          }
        }

        var estacion2;
        for (var i = 0; i < estaciones_json.length; i++) {
          if(estaciones_json[i].id == ciudades[1][0].estacionesid){
            estacion2  =  estaciones_json[i];
            $('#estacion2').html('Estación: '+estacion2.nombre);
            break;
          }
        }

        var estacion3;
        for (var i = 0; i < estaciones_json.length; i++) {
          if(estaciones_json[i].id == ciudades[2][0].estacionesid){
            estacion3  =  estaciones_json[i];
            $('#estacion3').html('Estación: '+estacion3.nombre);
            break;
          }
        }
        //hasta esta parte llega el odometro con sus etiquetas

        //generamos el historico de las graficas pequeñas
        get_historico(ciudades[0][0],$('#linecustom1'),maximo);
        get_historico(ciudades[1][0],$('#linecustom2'),maximo);
        get_historico(ciudades[2][0],$('#linecustom3'),maximo);

        var historico1 = get_historico_dias(contaminante,horas,reMin,maximo,estacion1.id);
        var historico2 = get_historico_dias(contaminante,horas,reMin,maximo,estacion2.id);
        var historico3 = get_historico_dias(contaminante,horas,reMin,maximo,estacion3.id);

        console.log(historico1);
        console.log(historico2);
        console.log(historico3);

        var mini_graf_local = [[],[],[]];
        var mini_etiquetas_local = [[],[],[]];

        for (var i = 0; i < historico1.length; i++) {
          mini_graf_local[0].push(historico1[i].promedio);
          mini_etiquetas_local[0].push(historico1[i].fecha);
          var today = new Date(historico1[i].fecha);
          var dd = today.getDate();
          var mm = today.getMonth(); //January is 0!
          mini_etiquetas_local[0].push(dd+'-'+meses_abr[mm]);
        }


        for (var i = 0; i < historico2.length; i++) {
          mini_graf_local[1].push(historico2[i].promedio);
          mini_etiquetas_local[1].push(historico2[i].fecha);
          var today = new Date(historico2[i].fecha);
          var dd = today.getDate();
          var mm = today.getMonth(); //January is 0!
          mini_etiquetas_local[1].push(dd+'-'+meses_abr[mm]);
        }


        for (var i = 0; i < historico3.length; i++) {
          mini_graf_local[2].push(historico3[i].promedio);


          var today = new Date(historico3[i].fecha);
          var dd = today.getDate();
          var mm = today.getMonth(); //January is 0!
          mini_etiquetas_local[2].push(dd+'-'+meses_abr[mm]);
        }

        var max = 0;
        for (var i = 0; i < mini_graf_local.length; i++) {
          for (var j = 0; j < mini_graf_local[i].length; j++) {
            if(mini_graf_local[i][j] > max){
              max = mini_graf_local[i][j];
            }
          }
        }

        min_grafMax = max;
        console.log(max);

        console.log(mini_graf_local[0]);
        put_grafica_inline(mini_graf_local[0],$('#linecustom1'),mini_etiquetas_local[0]);
        put_grafica_inline(mini_graf_local[1],$('#linecustom2'),mini_etiquetas_local[1]);
        put_grafica_inline(mini_graf_local[2],$('#linecustom3'),mini_etiquetas_local[2]);


        // put_grafica_inline(mini_graf[0],$('#linecustom1'),mini_etiquetas[0]);
        // put_grafica_inline(mini_graf[1],$('#linecustom2'),mini_etiquetas[1]);
        // put_grafica_inline(mini_graf[2],$('#linecustom3'),mini_etiquetas[2]);

        var ciudades2 = [];
        ciudades2.push(ciudades[0][0]);
        ciudades2.push(ciudades[1][0]);
        ciudades2.push(ciudades[2][0]);
        top_ciudades = ciudades2;
      }//fin de if que valida que tenga valores el arreglo inicial
    },
    xhrFields: {
      withCredentials: false
    },
    crossDomain: true,
    async:true
  });
}//fin de get top 3

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
    poner_botones(valores);
  }

  function poner_botones(valores){
    ant = valores.length;
    var parametro =  valores.length/4
    console.log(parametro);

    $('.parametro').each(function(index){
      $( this ).text(Math.round(parametro*(index+1))+' días');
      $( this ).val(Math.round(parametro*(index+1)));
      console.log($( this ).val());
    });
  }

  var valores = [];
  var etiquetas = [];
  function put_his_estacion_val_max(lectura,estacion){
    //llamada para crear la grafica

    var hoy = convertDate(new Date());
    var menos28 = convertDate(sumarDias(new Date(), -28));

    $.ajax({
      type: 'GET',
      url:"https://api.datos.gob.mx/v1/sinaica?parametro="+lectura.parametro+"&city="+lectura.city+"&date-insert=[range:"+menos28+"T00:00:00%7C"+hoy+"T23:59:59]&pageSize=22245",
      data: {},
      success: function( data, textStatus, jqxhr ) {
        var estacionesid = lectura.estacionesid;
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
        // creacion del arreglo que contiene los 28 dias
        var array28 =  [];

        for (var i = 0; i < 28; i++) {
          var f = convertDate(sumarDias(new Date(), -i));
          var r = {fecha:f, valororig:null};
          for (var j = 0; j < his_estacion.length; j++) {
            if(r.fecha == his_estacion[j].fecha){

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


        actualizar_grafica_detalle(valores,etiquetas);
        poner_botones(valores);
        $('#modal1').modal('open');

        $('#PM1024H').trigger('click');
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
      $('#estacion').val(estacion.id);

      console.log(top_ciudades[indice-1]);


      put_his_estacion_val_max(top_ciudades[indice-1],estacion);
      put_contaminantes(top_ciudades[indice-1].city,estacion.id);
  }

  function put_contaminantes(city,estacion){
    put_temperatura(estacion.id,$('#temperatura_detalle'));

    var valPM10 = $('#valPM1024H');
    getMasAlto('PM10',city,estacion,valPM10,'24h');
    var valPM25 = $('#valPM2524H');
    getMasAlto('PM2.5',city,estacion,valPM25,'24h');
    var valN02 = $('#valN02DH');
    getMasAlto('NO2',city,estacion,valN02,'DH');
    var valS02 = $('#valS0224H');
    getMasAlto('SO2',city,estacion,valS02,'24h');
    var valS02 = $('#valS028H');
    getMasAlto('SO2',city,estacion,valS02,'8h');
    var valS02 = $('#valS02DH');
    getMasAlto('SO2',city,estacion,valS02,'DH');
    var valO3 = $('#valO38H');
    getMasAlto('O3',city,estacion,valO3,'8h');
    var valO3 = $('#valO3DH');
    getMasAlto('O3',city,estacion,valO3,'DH');
    var valCO = $('#valCO8H');
    getMasAlto('CO',city,estacion,valCO,'8h');
    $('#estacion_id').val(estacion);
    $('#ciudad').val(city);
  }

  // function getTop3ciudades(contaminante){
  //   var datedate = anio+"-"+mes+"-"+dia;
  //
  //   $.ajax({
  //     type: 'GET',
  //     url: "https://api.datos.gob.mx/v1/sinaica?fecha="+datedate+"&pageSize=12000&parametro="+contaminante,
  //     data: {},
  //     success: function( data, textStatus, jqxhr ) {
  //       var ciudades = [];
  //       for (var i = 0; i < data.results.length; i++)
  //       {
  //         var objeto = data.results[i];
  //         var bandera =  false;
  //
  //         if(ciudades.length != 0)
  //         {
  //           for (var j = 0; j < ciudades.length; j++)
  //           {
  //             if(ciudades[j].city == objeto.city )
  //             {
  //               bandera = true;
  //               if(ciudades[j].valororig < objeto.valororig){
  //                 ciudades[j] = objeto;
  //               }
  //             }
  //            }
  //           if(!bandera)
  //           {
  //             ciudades.push(objeto);
  //           }
  //         }
  //         else
  //         {
  //           ciudades.push(objeto);
  //         }
  //       }
  //
  //       //ordenamos el arreglo para tomar los valores mas altos
  //       ciudades.sort(function (a, b) {
  //         if (a.valororig < b.valororig) {
  //           return 1;
  //         }
  //         if (a.valororig > b.valororig) {
  //           return -1;
  //         }
  //         // a must be equal to b
  //         return 0;
  //       });
  //
  //       if(ciudades.length > 0){
  //         var valor =  ciudades[0].valororig;
  //         var valor2 = ciudades[1].valororig;
  //         var valor3 = ciudades[2].valororig;
  //
  //         //validamos si tenesmos que tratar el valor
  //         if (valor > Math.floor(valor)) valor = valor.toFixed(2);
  //         if (valor2 > Math.floor(valor2)) valor2 = valor2.toFixed(2);
  //         if (valor3 > Math.floor(valor3)) valor3 = valor3.toFixed(2);
  //
  //
  //         var tipoCon;
  //         switch(contaminante){
  //           case "NO2":
  //             tipoCon = 0.315;
  //           break;
  //           case "O3":
  //             tipoCon = 0.181;
  //           break;
  //           case "PM10":
  //               tipoCon = 158;
  //           break;
  //           case "PM2.5":
  //             tipoCon = 158;
  //           break;
  //           case "SO2":
  //             tipoCon = 0.32;
  //           break;
  //           case "CO":
  //             tipoCon = 16.5;
  //           break;
  //         }
  //
  //         $('.chart-gauge').html('');
  //         $('.chart-gauge').gaugeIt({selector:'.chart-gauge',value:valor,gaugeMaxValue:tipoCon});
  //         $('.chart-gauge2').html('');
  //         $('.chart-gauge2').gaugeIt({selector:'.chart-gauge2',value:valor2,gaugeMaxValue:tipoCon});
  //         $('.chart-gauge3').html('');
  //         $('.chart-gauge3').gaugeIt({selector:'.chart-gauge3',value:valor3,gaugeMaxValue:tipoCon});
  //
  //         $('#label1').html(ciudades[0].city);
  //         $('#label2').html(ciudades[1].city);
  //         $('#label3').html(ciudades[2].city);
  //
  //         for (var i = 0; i < estaciones_json.length; i++) {
  //             if(estaciones_json[i].id == ciudades[0].estacionesid){
  //               estacion  =  estaciones_json[i];
  //               $('#estacion1').html('Estación: '+ estacion.nombre);
  //               break;
  //             }
  //         }
  //
  //         for (var i = 0; i < estaciones_json.length; i++) {
  //             if(estaciones_json[i].id == ciudades[1].estacionesid){
  //               estacion  =  estaciones_json[i];
  //               $('#estacion2').html('Estación: '+estacion.nombre);
  //               break;
  //             }
  //         }
  //
  //         for (var i = 0; i < estaciones_json.length; i++) {
  //             if(estaciones_json[i].id == ciudades[2].estacionesid){
  //               estacion  =  estaciones_json[i];
  //               $('#estacion3').html('Estación: '+estacion.nombre);
  //               break;
  //             }
  //         }
  //
  //
  //         get_historico(ciudades[0],$('#linecustom1'),maximo);
  //         get_historico(ciudades[1],$('#linecustom2'),maximo);
  //         get_historico(ciudades[2],$('#linecustom3'),maximo);
  //
  //         put_grafica_inline(mini_graf[0],$('#linecustom1'),mini_etiquetas[0]);
  //         put_grafica_inline(mini_graf[1],$('#linecustom1'),mini_etiquetas[1]);
  //         put_grafica_inline(mini_graf[2],$('#linecustom1'),mini_etiquetas[2]);
  //
  //       }
  //
  //       top_ciudades = ciudades;
  //     },
  //     xhrFields: {
  //       withCredentials: false
  //     },
  //     crossDomain: true,
  //     async:true
  //   });
  // }

  function get_historico(lectura,contenedor,maximo){
    var hoy = convertDate(new Date());
    var menos28 = convertDate(sumarDias(new Date(), -28));

    $.ajax({
      type: 'GET',
      url:"https://api.datos.gob.mx/v1/sinaica?parametro="+lectura.parametro+"&estacionesid="+lectura.estacionesid+"&date-insert=[range:"+menos28+"T00:00:00%7C"+hoy+"T23:59:59]&pageSize=22245",
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

                  if(his_estacion[j].valororig < objeto.valororig && objeto.valororig < maximo){
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
        mini_graf.push(valores2);
        mini_etiquetas.push(etiquetas2);
        //put_grafica_inline(valores2,contenedor,etiquetas2);

      },
      xhrFields: {
        withCredentials: false
      },
      crossDomain: true,
      async:false
    });
  }

  function put_grafica_inline(valores,contenedor,etiquetas2,maxRage){
    var options =  {
      type: "line",
      height: '3em',
      width: '8em',
      lineColor: '#fff',
      lineWidth: 2,
      fillColor: false,
      minSpotColor: false,
      maxSpotColor: false,
      spotColor: false,
      spotRadius: 3,
      highlightLineColor: '#fff',
      highlightSpotColor: '#000',
      chartRangeMin: 0,
      chartRangeMax: min_grafMax,
      tooltipFormat: '{{offset:offset}} {{value}} <br> {{prefix}}{{y}}{{suffix}}' ,
      tooltipValueLookups: {
        'offset': etiquetas2
    },
    }
    contenedor.show();
    contenedor.sparkline(valores,options);
  }

  var estaciones_global =  [];
  function get_estaciones(){
      var datedate = anio+"-"+mes+"-"+dia;

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

          estaciones_global = estations;
        },
        xhrFields: {
          withCredentials: false
        },
        crossDomain: true,
        async:false
      });
    }

  function getMasAlto(contaminante,ciudad,idEstacion,contenedor,tipo){
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
      //default ponemos 8 horas para que logre conseguir un valor
      dPasada.setHours(dActual.getHours() - 8);
    }

    //ruta con horas de un dia
    var ruta = "https://api.datos.gob.mx/v1/sinaica?parametro="+ contaminante +"&estacionesid="+idEstacion+"&pageSize=1200";

    console.log(ruta);
    console.log(idEstacion);

      $.ajax({
        type: 'GET',
        url: ruta,
        data: {},
        success: function( data, textStatus, jqxhr ) {
          console.log(data);
          if(data.results.length > 0){
            var masAlto = [];
            for (var i = 0; i < data.results.length; i++)
            {
              if(masAlto.length == 0 ){
                masAlto =  data.results[0];
              }
              else if( data.results[i].valororig > masAlto.valororig ){
                  masAlto =  data.results[i];
              }
            }

            if(masAlto.length != 0){
              if(contaminante ==  'PM10' || contaminante == 'PM2.5')
                contenedor.html(''+masAlto.valororig.toFixed(1));
              else
                contenedor.html(''+masAlto.valororig.toFixed(3));
            }else{
                contenedor.html('Sin valor');
            }
          }else{
              contenedor.html('Sin valor');
          }
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
        return resultado;
    }

  function groupClick(event) {

    var popup = event.layer._popup;
    var estacion  = event.layer.idestacion;
    var array  = event.layer.idarray;

    var info = '<b>Estación:</b> '+estaciones_json[array].id+'<br><b>Nombre: </b>'+ estaciones_json[array].nombre +'<br><b>Codigo: </b>'+estaciones_json[array].codigo+'<br><div style="margin-bottom: 25px; margin-top: 25px;" class="botonera"><a class="modal_mapa" data-id="'+ estaciones_json[array].id +'">Detalle Estación</a></div>';

    popup.setContent(info);
    popup.update();
  }

  //funcucion que consigue agrupar los datos de una estacion
  function getUniqueEstation_id(json, id_estacion){
    var arrEstacion = [];
    for (var i = 0; i < json.length; i++) {
      // if(!arrEstaciones[json[i].estacionesid])
      //   arrEstaciones[json[i].estacionesid] = [];
      // arrEstaciones[json[i].estacionesid].push(json[i]);
      if(json[i].estacionesid ==  id_estacion){
        arrEstacion.push(json[i]);
      }
    }
    return arrEstacion;
  }


  function get_historico_horas(contaminante,tipo,maximo,menos_horas){
    var dActual = new Date();

    var dPasada = new Date();
    var dias = 24*28;
    dPasada.setHours(dActual.getHours() - dias);

    var ciudad =  $('#ciudad').val();
    var ruta = "https://api.datos.gob.mx/v1/sinaica?&city="+ciudad+"&parametro="+ contaminante +"&date-insert=[range:"+getFormatDateAPI(dPasada)+"%7C"+getFormatDateAPI(dActual)+"]";
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
              var estacionesid = $('#estacion_id').val();
              var his_estacion =  [];
              var labels_temp = [];
              var values_temp = [];
              for (var i = 0; i < data.results.length; i++) {

                if(data.results[i].estacionesid == estacionesid){
                  if(!Array.isArray(his_estacion[data.results[i].fecha])){
                    his_estacion[data.results[i].fecha] = [];
                    labels_temp.push(data.results[i].fecha);
                  }

                  //validacion desde el api para valores correctos
                  if(data.results[i].validoorig == 1){
                    his_estacion[data.results[i].fecha].push(data.results[i]);
                  }

                }

              }

              for (var i = 0; i < labels_temp.length; i++) {
                var promedio = his_estacion[labels_temp[i]].length;
                var suma = 0;
                var arreglo = his_estacion[labels_temp[i]];
                for (var j = 0; j < promedio; j++) {
                  if(arreglo[j].valororig < maximo)
                    suma += arreglo[j].valororig;
                }

                if(contaminante ==  'PM10' || contaminante == 'PM2.5')
                  values_temp.push((suma/promedio).toFixed(1));
                else
                  values_temp.push((suma/promedio).toFixed(3));

              }

              valores = values_temp;
              var labels_temp2 = [];
              for (var i = 0; i < labels_temp.length; i++) {
                labels_temp2[i] = get_fecha_formato(labels_temp[i]);
              }
              etiquetas =  labels_temp2;
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
    }
