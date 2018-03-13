var dataLocal = [];
var chart;
var ctx;
var color;
var mymap = L.map('mapid').setView([16.8889,-100], 5);

var valores = [];
var valoresRango = [];
var etiquetas = [];

var ant_val_arr = [];
var ant_lab_arr = [];

var d = new Date();
var anio = d.getFullYear();
var mes = meis[d.getMonth()];
var dia = deis[d.getDate()];

//catalogo de constantes de configuración
const pageSize_estaciones = 2000;
var arrPM2 = arrPM2 = arrNO2 = arrCO = arrO3 = arrSO2 = [];

//emulacion de states
var pm10Vacio = false;
var indicadorMostrado = false;


$(document).ready(function()
{
  $('.forLoader').removeClass('hide').slideUp();
  
  $("#myModal").on("hidden.bs.modal", function () {

    $('.boton_pop').each(function(){
      $(this).removeClass("bloqueado");
    });

    var arr_vacio = [];
    chart.data.datasets[0].data =  arr_vacio;
    chart.data.datasets[1].data =  arr_vacio;
    chart.data.labels =  arr_vacio;
    chart.update();
    poner_botones(arr_vacio);

    $('.chart-gauge').html('');
    $('.chart-gauge').gaugeIt({selector:'.chart-gauge',value:0,gaugeMaxValue:10});

    $("#alerta").hide();

  });

  $('[data-toggle="tooltip"]').tooltip();

  /* instancia del mapa*/
  mymap.panTo(new L.LatLng(24.8, -100));

  var OpenStreetMap_BlackAndWhite = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
  {
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });

  OpenStreetMap_BlackAndWhite.addTo(mymap);
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) mymap.dragging.disable();
  mymap.scrollWheelZoom.disable();
  /*fin de instancia del mapa*/

  $('#estado_primer_select').html(options_estado());
  //$('#estaciones_select').html(options_estaciones());
  $('#contaminantes').change(function()
  {
    $('.forLoader').show();
    //conseguimos todas las variables necesarias para hacer la llamada a el API
    var estado =  $('#estado_primer_select').val();
    var estacion =  $('#estaciones_select').val();

    var b = $('#contaminantes').val();
    var a = b.split('_');
    var parametro = a[0];
    var horas = a[1];

    horas = 24;
    parametro = 'PM10';

    //ponemos los parametros en la ventana
    $('#fecha_detalle').html(convertDate(new Date()));
    $('#contaminante_detalle').html(parametro);
    $('#contaminante_grafica').html(parametro);
    $('#titulo_detalle').html(buscarCiudad(estacion));
    $('#estacion_detalle').html($('#estaciones_select option:selected').text());
    $('#tituloTexto').html(parametro);
    $('#textoTitulo').html($('#'+id).attr('data-original-title'));

    var id = 'botonPM10';
    cambioBotonActivo(id);

    //vamos a llenar los arreglos de todos los coantaminantes
    llenarConstaminantes(generaUrl('PM10', estacion, (24*28)),'PM10');
    llenarConstaminantes(generaUrl('PM2.5', estacion, (24*28)),'PM2.5');
    llenarConstaminantes(generaUrl('NO2', estacion, (24*28)),'NO2');
    llenarConstaminantes(generaUrl('SO2', estacion, (24*28)),'SO2');
    llenarConstaminantes(generaUrl('O3', estacion, (24*28)),'O3');
    llenarConstaminantes(generaUrl('CO', estacion, (24*28)),'CO');
  });

  /*instancia de la grafica*/
  ctx = document.getElementById('myChart').getContext('2d');
  color = Chart.helpers.color;
  chart = new Chart(ctx,
  {
    type: 'line',
    data:
    {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets:
      [
        {
          label: "Contaminantes",
          backgroundColor: color(window.chartColors.blue).alpha(0.2).rgbString(),
          borderColor: window.chartColors.blue,
          pointBackgroundColor: window.chartColors.blue,
          data: [0, 10, 5, 2, 20, 30, 45],
        },
          {
              label: "Valores máximos",
              borderColor: window.chartColors.red,
              backgroundColor: window.chartColors.red,
              fill: false,
              data:[10, 10, 10, 10, 10, 10, 10]
          }
      ]
    },
    options:
    {
      legend:
      {
        display: false
      },
      tooltips: {
        enabled: true
      },
      scales: {
        xAxes: [{
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 90
          }
        }]
      }
    },
  });
  // fin de instancia de la grafica

  $('.parametro').click(function()
  {
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

  //select para version movil
  $('#conataminatesMovil').change(function ()
  {
    if('PM10' == $(this).val())
    {
      cambioParametro('PM10',24,'botonPM10','Las partículas menores o iguales a 10 micras (PM10) se depositan en la región extratorácica del tracto respiratorio (nariz, boca, naso, oro y laringofarínge); contienen principalmente materiales de la corteza terrestre y se originan en su mayoría por procesos de desintegración de partículas más grandes. También pueden contener material biológico como polen, esporas, virus o bacterias o provenir de la combustión incompleta de combustibles fósiles.','PM10 (µg/m&sup3;)')
    }
    else if('PM2.5' == $(this).val())
    {
      cambioParametro('PM2.5',24,'botonPM25','Las partículas menores o iguales a 2.5 micras (PM2.5) están formadas primordialmente por gases y por material proveniente de la combustión. Se depositan fundamentalmente en la región traqueobronquial (tráquea hasta bronquiolo terminal), aunque pueden ingresar a los alvéolos.', 'PM2.5 (µg/m&sup3;)');
    }
    else if('NO2' == $(this).val())
    {
      cambioParametro('NO2','D','botonNO2','El dióxido de nitrógeno es un compuesto químico gaseoso de color marrón amarillento, es un gas tóxico e irritante. La exposición a este gas disminuye la capacidad de difusión pulmonar.','NO2 (ppm)')
    }
    else if('SO2D' == $(this).val())
    {
      cambioParametro('SO2','D','botonSO2D','Gas incoloro que se forman al quemar azufre. La exposición a niveles altos de este contaminante produce irritación e inflamación de garganta y bronquios.','SO2 (ppm)')
    }
    else if('SO28' == $(this).val())
    {
      cambioParametro('SO2',8,'botonSO28','Gas incoloro que se forman al quemar azufre. La exposición a niveles altos de este contaminante produce irritación e inflamación de garganta y bronquios.','SO2 (ppm)');
    }
    else if('SO224' == $(this).val())
    {
      cambioParametro('SO2',24,'botonSO224','Gas incoloro que se forman al quemar azufre. La exposición a niveles altos de este contaminante produce irritación e inflamación de garganta y bronquios.','SO2 (ppm)');
    }
    else if('O3D' == $(this).val())
    {
      cambioParametro('O3','D','botonO3D','Es un compuesto gaseoso incoloro, que posee la capacidad de oxidar materiales, y causa irritación ocular y en las vías respiratorias.','O3 (ppm)');
    }
    else if('O38' == $(this).val())
    {
      cambioParametro('O3',8,'botonO38','Es un compuesto gaseoso incoloro, que posee la capacidad de oxidar materiales, y causa irritación ocular y en las vías respiratorias.','O3 (ppm)');
    }
    else if('CO8' == $(this).val())
    {
      cambioParametro('CO',8,'botonCO','Es un gas incoloro e inodoro que en concentraciones altas puede ser letal ya que forma carboxihemoglobina, la cual impide la oxígenación de la sangre.','CO (ppm)');
    }
  });
}); // fin de document ready

function buscarCiudad(idEstacion)
{
  var city = '';
  for (let index = 0; index < estaciones_json.length; index++) {
    const element = estaciones_json[index];
    if(element.id == idEstacion)
    {
      city =  element.city;
      break;
    }
  }
  return city;
}

function cambioBotonActivo(id)
{
  //cambio de active boton
  $(".boton_pop").each(function()
  {
    $(this).removeClass( "active_pop" )
  });
  $('#'+id).addClass('active_pop');
}

function hacerFechaValida(fecha)
{
  var fechaPartida = fecha.split("T");
  var tiempoPartido =  fechaPartida[1].split(".");

  return fechaPartida[0]+' '+tiempoPartido[0];
}

function convertDate(inputFormat)
{
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat);
  return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
}

function options_estado()
{
  var options  = '<option value="0">1.-Selecciona un estado</option>';
  for (let index = 0; index < coor_estado.length; index++)
  {
    const element = coor_estado[index];
    options += '<option value="'+element.estado+'">'+element.estado+'</option>'
  }

  return options;
}

function desabilitarGrafica()
{
  $('#alertModal').modal('show');
  $('#alertModal').css({'display':'flex','align-items':'center'});
  var valor = 0;
  var maximo = 100;
  $('.chart-gauge').html('');
  $('.chart-gauge').gaugeIt({selector:'.chart-gauge',value:valor,gaugeMaxValue:maximo});

  //vaciamos la grafica para mostrar que no tenemos lectura
  for(var i=0; i< valores.length; i++)
  {
      valores[i] =  null;
      valoresRango[i] = null;
  }
  actualizar_grafica_detalle(valores, etiquetas);
  //ocultamos la botonera para que no se pueda utilizar
  $('.botonera').hide();
}

function createArrayGrafica(url, parametro, horas,promedio)
{
  $.ajax({
    type: 'GET',
    url: url,
    data: {},
    success: function( data, textStatus, jqxhr )
    {
      arrPM10 = data;
      dataLocal = data;
      putGrafica(parametro, horas,promedio);
      // Oculta Loader
      $('.forLoader').removeClass('show').slideUp();
    },
    xhrFields: {
      withCredentials: false
    },
    crossDomain: true,
    async:true
  });
}

function putGrafica(parametro,horas,promedio2)
{
  var data = dataLocal;
  var maximo = 1580;
        var estacionesid = $('#estacion_id').val();
        var his_estacion =  [];
        var labels_temp = [];
        var values_temp = [];

        for (var i = 0; i < data.results.length; i++)
        {
          if(data.results[i].parametro == parametro)
          {
            if(!Array.isArray(his_estacion[data.results[i].fecha]))
            {
              his_estacion[data.results[i].fecha] = [];
              labels_temp.push(data.results[i].fecha);
            }

            //validacion desde el api para valores correctos
            if(data.results[i].validoorig == 1){
              his_estacion[data.results[i].fecha].push(data.results[i]);
            }

          }

        }

        for (var i = 0; i < labels_temp.length; i++)
        {
          var promedio = his_estacion[labels_temp[i]].length;
          var suma = 0;
          var arreglo = his_estacion[labels_temp[i]];
          for (var j = 0; j < promedio; j++) {
            if(arreglo[j].valororig < maximo)
              suma += arreglo[j].valororig;
          }

          if(parametro ==  'PM10' || parametro == 'PM2.5')
            values_temp.push((suma/promedio).toFixed(1));
          else
            values_temp.push((suma/promedio).toFixed(3));
        }

        valores = values_temp;
        //forzamos el primer valor
        valores[values_temp.length-1] = promedio2;
        rangoInecc(parametro,horas);
        var labels_temp2 = [];
        for (var i = 0; i < labels_temp.length; i++)
        {
          labels_temp2[i] = get_fecha_formato(labels_temp[i]);
        }
        etiquetas =  labels_temp2;

        actualizar_grafica_detalle(valores, etiquetas);
}

function rangoInecc(parametro, horas)
{
    var rango = 0;
    var cadena = parametro+''+horas;
    
    switch(cadena)
    {
        case "PM1024":
            rango = 75;
        break;
        case "PM2.524":
            rango = 45;
        break;
        case "O3D":
            rango = 0.095;
        break;
        case "SO2D":
            rango = 0.025;
        break;
        case "SO224":
            rango = 0.11;
        break;
        case "SO28":
            rango = 0.2;
        break;
        case "O38":
            rango = 0.07;
        break;
        case "NO2D":
            rango = 0.21;
        break;
        case "CO8":
            rango = 11;
        break;
        default:
            rango = 0;
    }

    for(var i = 0; i< valores.length; i++)
    {
      valoresRango[i] = rango;
    }
}

function actualizar_grafica_detalle(valores,etiquetas)
{
  chart.data.datasets[0].data =  valores;
  chart.data.datasets[1].data =  valoresRango;
  chart.data.labels =  etiquetas;
  chart.update();
  poner_botones(valores);
}

function poner_botones(valores)
{
  ant = valores.length;
  var parametro =  valores.length/4

  $('.parametro').each(function(index){
    $( this ).text(Math.round(parametro*(index+1))+' días');
    $( this ).val(Math.round(parametro*(index+1)));
  });
}

function convertDate(date)
{
  var yyyy = date.getFullYear().toString();
  var mm = (date.getMonth()+1).toString();
  var dd  = date.getDate().toString();

  var mmChars = mm.split('');
  var ddChars = dd.split('');

  return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
}

function sumarDias(fecha, dias)
{
  fecha.setDate(fecha.getDate() + dias);
  return fecha;
}

function getFormatDateAPI(d)
{
  var fecha = d.getFullYear()+'-'+ meis[d.getMonth()] +'-'+((d.getDate() < 10?'0':'') + d.getDate())      +'T'+ ( (d.getHours() < 10?'0':'') + d.getHours() ) +':'+( (d.getMinutes()<10?'0':'') + d.getMinutes() )+':00';
  return fecha;
}

function ponEstacionesSel()
{
  var x = document.getElementById("estado_primer_select").value;
  var contenido = '<option value="0">2.-Seleccionar estación</option>';
  var numEstaciones = 0;
  for (let index = 0; index < estaciones_json.length; index++)
  {
    var element =  estaciones_json[index];
    if(element.state == x && element.activa)
    {
      contenido += '<option value="'+element.id+'">'+element.city+' - '+element.nombre+'</option>';
      numEstaciones ++;
    }
  }

  if(numEstaciones > 0)
  {
    $('#estaciones_select').html(contenido);
  }
  else
  {
    $('#estaciones_select').html('<option value="0">Sin estaciones</option>');
  }
}

function cambiaCoor()
{
    var seleccionado = document.getElementById("estados").value;

    jQuery.each( coor_estado, function( i, val )
    {
      if(seleccionado == val.estado)
      {
          mymap.setView([val.lat, val.long], (val.zoom-1));
      }
    });
}

function DateFalsa()
{
  return new Date("2018-03-07 00:00:00");
}

function llenarConstaminantes(url, parametro)
{
  $.ajax({
    type: 'GET',
    url: url,
    data: {},
    success: function( data, textStatus, jqxhr )
    {
      if(data.results.length > 0)
      {
        if('PM10' == parametro)
        {
          arrPM10 = data;
          $('#botonPM10').trigger('click');
          $('#myModal').modal('show');
          $('.forLoader').removeClass('hide').slideUp();
        }
        else if('PM2.5' == parametro)
        {
          arrPM2 = data;
        }
        else if('NO2' == parametro)
        {
          arrNO2 = data;
        }
        else if('CO' == parametro)
        {
          arrCO = data;
        }
        else if('O3' == parametro)
        {
          arrO3 = data;
        }
        else if('SO2' == parametro)
        {
          arrSO2 = data;
        }
      }
      else
      {

        $('#conataminatesMovil option').each(function(e)
          {
            if($(this).val().includes(parametro))
            {
              $(this).attr('disabled','disabled');
            }
          }
        );

        if('PM2.5' == parametro)
        {
          $('#botonPM25').addClass('bloqueado');
        }
        else if('PM10' == parametro)
        {
          $('#botonPM10').addClass('bloqueado');
          setTimeout(function()
            {
              buscarOtroParametro();
            }, 5000);
        }
        else if('NO2' == parametro)
        {
          $('#botonNO2').addClass('bloqueado');
        }
        else if('CO' == parametro)
        {
          $('#botonCO').addClass('bloqueado');
        }
        else if('O3' == parametro)
        {
          $('#botonO38').addClass('bloqueado');
          $('#botonO3D').addClass('bloqueado');
        }
        else if('SO2' == parametro)
        {
          $('#botonSO2D').addClass('bloqueado');
          $('#botonSO28').addClass('bloqueado');
          $('#botonSO224').addClass('bloqueado');
        }
      }

    },
    xhrFields: {
      withCredentials: false
    },
    crossDomain: true,
    async:true
  });
}

function generaUrl(parametro,id_estacion,horas)
{
  // cambiar estas horas con = new Date();
  // const dActual = DateFalsa();
  // var dPasada = DateFalsa();

  const dActual = new Date();
  var dPasada = new Date();

  dPasada.setHours(dActual.getHours() - horas);

  var url = 'https://api.datos.gob.mx/v2/sinaica?parametro='+parametro+'&estacionesid='+id_estacion+'&date-insert>'+getFormatDateAPI(dPasada)+'&date-insert<'+getFormatDateAPI(dActual)+'&pagesize='+1000;

  return url;
}

function buscarOtroParametro()
{
  if(arrPM2.results.length > 0)
  {
    $('#botonPM25').trigger('click');
    $('#myModal').modal('show');
    $('.forLoader').removeClass('hide').slideUp();
  }
  else if(arrNO2.results.length > 0)
  {
    $('#botonNO2').trigger('click');
    $('#myModal').modal('show');
    $('.forLoader').removeClass('hide').slideUp();
  }
  else if(arrCO.results.length > 0)
  {
    $('#botonCO').trigger('click');
    $('#myModal').modal('show');
    $('.forLoader').removeClass('hide').slideUp();
  }
  else if(arrO3.results.length > 0)
  {
    $('#botonO38').trigger('click');
    $('#myModal').modal('show');
    $('.forLoader').removeClass('hide').slideUp();
  }
  else if(arrSO2.results.length > 0)
  {
    $('#botonSO224').trigger('click');
    $('#myModal').modal('show');
    $('.forLoader').removeClass('hide').slideUp();
  }
}

function cambioParametro(parametro, horas,id,titulo,lb)
{
  $("#alerta").hide();
  if(!($('#'+id).hasClass('bloqueado')))
  {
    cambioBotonActivo(id);
    var estado =  $('#estado_primer_select').val();
    var estacion =  $('#estaciones_select').val();

    $('#contaminante_detalle').html(parametro);
    $('#contaminante_grafica').html(parametro);
    $('#tituloTexto').html(parametro);
    $('#textoTitulo').html(titulo);

    //porEstaciones(estado,estacion,parametro,horas);
    var promedioFinal = 0;
    var maximoL = 0;
    var label = "";
    if('PM10' == parametro)
    {
      promedioFinal = sacaDatoDiario(arrPM10,horas,158);
      dataLocal = arrPM10;
      maximoL = 158;
      label = 'µg/m³';
    }
    else if('PM2.5' == parametro)
    {
      promedioFinal = sacaDatoDiario(arrPM2,horas,158);
      dataLocal = arrPM2;
      maximoL = 158;
      label = 'µg/m³';
    }
    else if('NO2' == parametro)
    {
      promedioFinal = sacaDatoDiario(arrNO2,horas, 0.315);
      dataLocal = arrNO2;
      maximoL = 0.315;
      label = 'ppm';
    }
    else if('CO' == parametro)
    {
      promedioFinal = sacaDatoDiario(arrCO,horas,16.5);
      dataLocal = arrCO;
      maximoL = 16.5;
      label = 'ppm';
    }
    else if('O3' == parametro)
    {
      promedioFinal = sacaDatoDiario(arrO3,horas,0.181);
      dataLocal = arrO3;
      maximoL = 0.181;
      label = 'ppm';
    }
    else if('SO2' == parametro)
    {
      promedioFinal = sacaDatoDiario(arrSO2,horas,0.32);
      dataLocal = arrSO2;
      maximoL = 0.32;
      label = 'ppm';
    }

    if(promedioFinal > 0)
    {
      
      var promedioFinalFix = promedioFinal;
      if(parametro ==  "PM10" || parametro ==  "PM2.5")
      {
        promedioFinalFix = promedioFinal.toFixed(2);
      }
      else
      {
        promedioFinalFix = promedioFinal.toFixed(4);
      }
      
      putGrafica(parametro, horas, promedioFinalFix);
      $('.chart-gauge').html('');
      $('.chart-gauge').gaugeIt({selector:'.chart-gauge',value:promedioFinalFix,label:label,gaugeMaxValue:maximoL});
    }
    else
    {
      $("#alerta").show();
    
      putGrafica(parametro, horas, promedioFinal);
      $('.chart-gauge').html('');
      $('.chart-gauge').gaugeIt({selector:'.chart-gauge',value:0,label:label,gaugeMaxValue:maximoL});
    }
  }
}

function sacaDatoDiario(data,horas,max)
{
  if(horas != 'D')
  {
    // const dActual = DateFalsa();
    // var dPasada = DateFalsa();

    const dActual = new Date();
    var dPasada = new Date();

    dPasada.setHours(dActual.getHours() - horas);

    var datos =  data.results;
    var arrTemp = [];
    for (let index = datos.length - 1; index >= 0;  index--)
    {

      var fechaValida = new Date(hacerFechaValida(datos[index]['date-insert']));

      if(fechaValida.getTime() >= dPasada.getTime() )
      {
        arrTemp.push(datos[index]);
      }
      else
      {
        break;
      }
    }

    var promedio = 0;
    var acumulado = 0;
    for (let index = 0; index < arrTemp.length; index++)
    {
      if(arrTemp[index].valororig < max && arrTemp[index].validoorig == 1)
      {
        acumulado += arrTemp[index].valororig;
        promedio++;
      }
    }

    if((arrTemp.length * .75) < promedio)
    {
      return acumulado/promedio;
    }
    else
    {
      return 0;
    }

  }
  else
  {
     return data.results[data.results.length-1].valororig;
  }
}

function ponContaminantesSel()
{
      var options = '<option value="0">3.-Selecciona Contaminate</option>'+
      '<option value="PM10_24" title="Las partículas menores o iguales a 2.5 micras (PM2.5) están formadas primordialmente por gases y por material proveniente de la combustión. Se depositan fundamentalmente en la región traqueobronquial (tráquea hasta bronquiolo terminal), aunque pueden ingresar a los alvéolos.">PM 10 µg/m&sup3;</option>'+
          '<option value="PM2.5_24" title="Las partículas menores o iguales a 2.5 micras (PM2.5) están formadas primordialmente por gases y por material proveniente de la combustión. Se depositan fundamentalmente en la región traqueobronquial (tráquea hasta bronquiolo terminal), aunque pueden ingresar a los alvéolos.">PM 2.5 µg/m&sup3;</option>'+
          '<option value="SO2_24" title="Gas incoloro que se forman al quemar azufre. La exposición a niveles altos de este contaminante produce irritación e inflamación de garganta y bronquios.">SO2 (ppm) Promedio 24 horas</option>'+
          '<option value="SO2_8" title="Gas incoloro que se forman al quemar azufre. La exposición a niveles altos de este contaminante produce irritación e inflamación de garganta y bronquios.">SO2 (ppm) Promedio 8 horas</option>'+
          '<option value="SO2_D" title="Gas incoloro que se forman al quemar azufre. La exposición a niveles altos de este contaminante produce irritación e inflamación de garganta y bronquios.">SO2 (ppm) Dato horario</option>'+
          '<option value="O3_8" title="Es un compuesto gaseoso incoloro, que posee la capacidad de oxidar materiales, y causa irritación ocular y en las vías respiratorias.">Ozono (O3)(ppm) Promedio 8 horas</option>'+
          '<option value="O3_D" title="Es un compuesto gaseoso incoloro, que posee la capacidad de oxidar materiales, y causa irritación ocular y en las vías respiratorias.">Ozono (O3)(ppm) Dato horario</option>'+
          '<option value="NO2_24" title="El dióxido de nitrógeno es un compuesto químico gaseoso de color marrón amarillento, es un gas tóxico e irritante. La exposición a este gas disminuye la capacidad de difusión pulmonar.">NO2 (ppm)</option>'+
          '<option value="CO_24" title="Es un gas incoloro e inodoro que en concentraciones altas puede ser letal ya que forma carboxihemoglobina, la cual impide la oxígenación de la sangre.">CO (ppm)</option>';

    $('#contaminantes').html(options);
    $('#contaminantes').trigger( "change" );
}

function buscarEstacion(id_estacion)
{
  var estacion = 0 ;
  for (let index = 0; index < estaciones_json.length; index++)
  {
    var element =  estaciones_json[index];
    if(element.id == id_estacion)
    {
      estacion = element;
      break;
    }
  }
  return estacion;
}
