var dataLocal = [];
var dataLocalCP = [];
var chart;
var ctx;
var color;
var mymap = L.map("mapid").setView([16.8889,-100], 5);

var valores = [];
var valoresRango = [];
var etiquetas = [];
var lbls = {
  days: [],
  hours: []
};
var lastAverageOrData = 0;

var ant_val_arr = [];
var ant_val_arr_rango = [];
var ant_val_arr_promedio = [];
var ant_lab_arr = [];
var ant_lab_arr_dias = [];
var ant_lab_arr_horas = [];

var arrPM10 = arrPM2 = arrNO2 = arrCO = arrO3 = arrSO2 = [];

var contador_vacios = 0;
var ant = 0;
var banderaPromedios = true;
var ultimosEstados = [];

$(document).ready(function()
{
  $(".forLoader").removeClass("hide").slideUp();
  
  $("#myModal").on("hidden.bs.modal", function () 
  {
    $("#recomendaciones").hide();
    arrCompleto = [];
    ultimosEstados = [];
    contador_vacios = 0;
    $(".boton_pop").each(function(){
      $(this).removeClass("bloqueado");
    });

    var arr_vacio = [];
    chart.data.datasets[0].data =  arr_vacio;
    chart.data.datasets[1].data =  arr_vacio;
    chart.data.labels =  arr_vacio;
    chart.update();
    poner_botones(arr_vacio);

    $(".chart-gauge").html("");
    $(".chart-gauge").gaugeIt({selector:".chart-gauge",value:0,gaugeMaxValue:10});


     //se desabilita para móvil
    $("#conataminatesMovil option").each(function(e)
      {
        $(this).attr("disabled",false); 
      }
    );


    $("#alerta").hide();

  });

  $('[data-toggle="tooltip"]').tooltip();

  // Get maxvalues
  $("#max-values p").on("click", function() {
  
    cambioParametro(
      $(this).attr("data-id"),
      $(this).attr("data-hour"),
      $(this).attr("id"),
      $(this).attr("data-title")
    );
  });

  // Get states selected
  $("#estado_primer_select").on("change", function() { ponEstacionesSel() });
  // Get station selected
  $("#estaciones_select").on("change", function () { ponContaminantesSel() });
  // Get states map selected
  $("#estados").on("change", function () { cambiaCoor() });

  /* instancia del mapa*/
  mymap.panTo(new L.LatLng(24.8, -100));

  var OpenStreetMap_BlackAndWhite = L.tileLayer("http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png",
  {
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });

  OpenStreetMap_BlackAndWhite.addTo(mymap);
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) mymap.dragging.disable();
  mymap.scrollWheelZoom.disable();
  /*fin de instancia del mapa*/

  $("#estado_primer_select").html(options_estado());
  //$("#estaciones_select").html(options_estaciones());
  $("#contaminantes").change(function()
  {
    $(".forLoader").show();
    var estacion =  $('#estaciones_select').val();

    //ponemos los parametros en la ventana 
    $('#fecha_detalle').html(convertDate(new Date())); 
    $('#fecha_detalle_m').html(convertDate(new Date())); 
    var objEstacion = buscarEstacion(estacion);
    
    $('#titulo_detalle').html(buscarCiudad(estacion)); 
    $('#estacion_detalle').html($('#estaciones_select option:selected').text()); 
    $('#estacion_detalle_m').html('<b>'+$('#estaciones_select option:selected').text()+'</b>'); 
    
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
          fill: false,
          pointRadius: 1.3,
          borderWidth: 1,
        },
        {
          label: "Valores máximos",
          borderColor: window.chartColors.red,
          backgroundColor: window.chartColors.red,
          fill: false,
          data:[10, 10, 10, 10, 10, 10, 10],
          pointRadius: 1.3,
          borderWidth: 1,
        },
        {
          label: "Promedios moviles",
          borderColor: window.chartColors.green,
          backgroundColor: window.chartColors.green,
          fill: false,
          data:[10, 10, 10, 10, 10, 10, 10],
          pointRadius: 1.3,
          borderWidth: 1,
        }
      ]
    },
    options:
    {
      legend:
      {
        display: true
      },
      tooltips: {
        callbacks: {
          title: function (tooltipItem, data) {
            return data.labels.dias[tooltipItem[0]['index']] + "  --  " +
                   data.labels.horas[tooltipItem[0]['index']] + ' hrs';
          },
          label: function(tooltipItem, data) {
            var dat = data.datasets[tooltipItem.datasetIndex].data[tooltipItem['index']].toString();
            return data.datasets[tooltipItem.datasetIndex].label + ': ' +
                   dat.substring(0, dat.indexOf('.') + 4);
          },
        },
      },
      scales: {
        yAxes: [{ 
          ticks: { 
            min: 0 
          } 
        }], 
        xAxes: [{
          gridLines: {
            display: true,
            drawBorder: true,
            drawOnChartArea: false,
          },
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 0
          }
        }]
      },
    },
  });
  // fin de instancia de la grafica

  $(".parametro").click(function(event)
  {
    event.preventDefault();
    $(".parametro").removeClass("active");

    $( this ).addClass("active");

    var boton = parseInt($( this ).val(), 10);
    var tam_dataset = (chart.data.datasets[0].data.length);
    chart.data.labels =  etiquetas;
    
    if(ant > boton){
      var tam =  ant - boton;
      for (var i = 0; i < tam; i++) {
        ant_val_arr.push(chart.data.datasets[0].data.splice(0, 1));
        ant_val_arr_rango.push(chart.data.datasets[1].data.splice(0, 1));
        if (chart.data.datasets.length > 2) {
          ant_val_arr_promedio.push(chart.data.datasets[2].data.splice(0, 1));
        }
        
        ant_lab_arr.push(chart.data.labels.splice(0,1));
        ant_lab_arr_dias.push(chart.data.labels.dias.splice(0,1));
        ant_lab_arr_horas.push(chart.data.labels.horas.splice(0,1));
         
      }
    }else if(ant < boton){
      var tam = boton - ant;
      for (var i = 0; i < tam; i++) {
        chart.data.datasets[0].data.unshift(ant_val_arr.pop()[0]);
        chart.data.datasets[1].data.unshift(ant_val_arr_rango.pop()[0]);
        if (chart.data.datasets.length > 2) {
          chart.data.datasets[2].data.unshift(ant_val_arr_promedio.pop()[0]);
        }
        
        chart.data.labels.unshift(ant_lab_arr.pop()[0]);
        chart.data.labels.dias.unshift(ant_lab_arr_dias.pop()[0]);
        chart.data.labels.horas.unshift(ant_lab_arr_horas.pop()[0]);
      }
      
    }

    ant = boton;
    chart.update();
  });

  //select para version movil
  $("#conataminatesMovil").change(function ()
  {
    if("PM10" === $(this).val())
    {
      cambioParametro("PM10","24","botonPM10","Las partículas menores o iguales a 10 micras (PM10) se depositan en la región extratorácica del tracto respiratorio (nariz, boca, naso, oro y laringofarínge); contienen principalmente materiales de la corteza terrestre y se originan en su mayoría por procesos de desintegración de partículas más grandes. También pueden contener material biológico como polen, esporas, virus o bacterias o provenir de la combustión incompleta de combustibles fósiles.","PM10 (µg/m&sup3;)")
    }
    else if("PM2.5" === $(this).val())
    {
      cambioParametro("PM2.5","24","botonPM25","Las partículas menores o iguales a 2.5 micras (PM2.5) están formadas primordialmente por gases y por material proveniente de la combustión. Se depositan fundamentalmente en la región traqueobronquial (tráquea hasta bronquiolo terminal), aunque pueden ingresar a los alvéolos.", "PM2.5 (µg/m&sup3;)");
    }
    else if("NO2" === $(this).val())
    {
      cambioParametro("NO2","D","botonNO2","El dióxido de nitrógeno es un compuesto químico gaseoso de color marrón amarillento, es un gas tóxico e irritante. La exposición a este gas disminuye la capacidad de difusión pulmonar.","NO2 (ppm)")
    }
    else if("SO2D" === $(this).val())
    {
      cambioParametro("SO2","D","botonSO2D","Gas incoloro que se origina durante la combustión de carburantes fósiles que contienen azufre (petróleo, carbón, entre otros). La exposición a niveles altos de este contaminante produce irritación e inflamación de garganta y bronquios.","SO2 (ppm)")
    }
    else if("SO28" === $(this).val())
    {
      cambioParametro("SO2","8","botonSO28","Gas incoloro que se origina durante la combustión de carburantes fósiles que contienen azufre (petróleo, carbón, entre otros). La exposición a niveles altos de este contaminante produce irritación e inflamación de garganta y bronquios.","SO2 (ppm)");
    }
    else if("SO224" === $(this).val())
    {
      cambioParametro("SO2","24","botonSO224","Gas incoloro que se origina durante la combustión de carburantes fósiles que contienen azufre (petróleo, carbón, entre otros). La exposición a niveles altos de este contaminante produce irritación e inflamación de garganta y bronquios.","SO2 (ppm)");
    }
    else if("O3D" === $(this).val())
    {
      cambioParametro("O3","D","botonO3D","Es un compuesto gaseoso incoloro, que posee la capacidad de oxidar materiales, y causa irritación ocular y en las vías respiratorias.","O3 (ppm)");
    }
    else if("O38" === $(this).val())
    {
      cambioParametro("O3","8","botonO38","Es un compuesto gaseoso incoloro, que posee la capacidad de oxidar materiales, y causa irritación ocular y en las vías respiratorias.","O3 (ppm)");
    }
    else if("CO8" === $(this).val())
    {
      cambioParametro("CO","8","botonCO","Es un gas incoloro e inodoro que en concentraciones altas puede ser letal ya que forma carboxihemoglobina, la cual impide la oxígenación de la sangre.","CO (ppm)");
    }
  });

  // go-map action
  $("#go-map").click(function(e) {
    e.preventDefault();

    var mapSecPos = $("#map-section").position().top;

    $("html, body").animate({scrollTop: mapSecPos}, 300);
  });

  // Cover video-background
  function setCoverVideo() {
    var desition, h_original, height, rest, setting, w_original, width;
    width = $(window).width();
    height = $(window).height();
    rest = width / height;
    w_original = 846;
    h_original = 476;
    setting = w_original / h_original;
    desition = height / h_original;

    if (rest >= setting) {
      desition = width / w_original;
    }
    
    if (width < 569) {
      $("#video").css({
        width: 1600,
        height: 970
      });
    } else {
      $("#video").css({
        width: desition * w_original,
        height: desition * h_original
      });
    }

    $("#videoBlock").css("height", height);
  }
  $(window).resize(function() { setCoverVideo(); });
  setCoverVideo();
}); // fin de document ready

function buscarCiudad(idEstacion)
{
  var city = "";
  for (let index = 0; index < estaciones_json.length; index++) {
    const element = estaciones_json[index];
    if(element.id.toString() === idEstacion.toString())
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
  $("#"+id).addClass("active_pop");
}

function hacerFechaValida(fecha)
{
  var fechaPartida = fecha.split("T");
  var tiempoPartido =  fechaPartida[1].split(".");
  
  var year = fechaPartida[0].split("-")[0];
  var mes = parseInt(fechaPartida[0].split("-")[1], 10) - 1;
  var dia = fechaPartida[0].split("-")[2];

  var hora = tiempoPartido[0].split(":")[0];
  var minuto = tiempoPartido[0].split(":")[1];
  var segundo = tiempoPartido[0].split(":")[2];

  return new Date(year, mes, dia, hora, minuto, segundo);
}

function convertDate(inputFormat)
{
  function pad(s) { return (s < 10) ? "0" + s : s; }
  var d = new Date(inputFormat);
  return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join("/");
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

function dateMasUno(dateEvaluar, horas)
{
  
  return date;
}

function getNewDatas(data) {
  var newData = [];
  var missing = 0;

  data.results.forEach(function(val, ind) {
    if (ind < data.results.length - 1) {
      missing = data.results[ind + 1].hora - val.hora - 1;

      newData.push(val);

      if (missing >= 1) {
        for (var i = 1; i <= missing; i++) {
          newData.push({
            date: val.date,
            'date-insert': val['date-insert'],
            fecha: val.fecha,
            hora: val.hora + i,
            parametro: val.parametro,
            validoorig: val.validoorig,
            valororig: null
          });
        }
      } else if (data.results[ind + 1].hora >= 0 && data.results[ind + 1].fecha !== val.fecha) {
        for (var i = val.hora + 1; i <= 23; i++) {
          newData.push({
            date: val.date,
            'date-insert': val['date-insert'],
            fecha: val.fecha,
            hora: i,
            parametro: val.parametro,
            validoorig: val.validoorig,
            valororig: null
          });
        }
        for (var i = 0; i <= data.results[ind + 1].hora - 1; i++) {
          newData.push({
            date: data.results[ind].date,
            'date-insert': val['date-insert'],
            fecha: data.results[ind + 1].fecha,
            hora: i,
            parametro: val.parametro,
            validoorig: val.validoorig,
            valororig: null
          });
        }
      }
    } else {
      newData.push({
        date: val.date,
        'date-insert': val['date-insert'],
        fecha: val.fecha,
        hora: val.hora,
        parametro: val.parametro,
        validoorig: val.validoorig,
        valororig: val.valororig
      });
    }
  });

  return newData;
}

function redondearFecha(fecha)
{
  var mm = fecha.getMonth() + 1; // getMonth() is zero-based
  var dd = fecha.getDate();
  var yy = fecha.getFullYear();
  var hh = fecha.getHours();

  return new Date(yy+'-'+mm+'-'+dd+' '+hh+':00:00');
}

function crearArrCompleto()
{
  var a = [];
  dataLocalCP = dataLocal.results.slice(0);
  //tomar la fecha actual
  var fecha =  new Date();
  //llevamos la fecha a cero minutos y cero segundos
  fecha = redondearFecha(fecha);
  const horasTotales = 24*28;
  const limiteIndex = horasTotales-1;
  for (let i = 0; i < horasTotales; i++) 
  {
    var hora = fecha.getHours();
    var r  = buscaData(new Date(getFormatDateAPI(fecha)).getTime())
    if( r !== 0)
    {
      a[limiteIndex-i] = r;
    }
    else
    {
      a[limiteIndex-i] = 
      {
        date: getFormatDateAPI(fecha)+'',
        'date-insert':fecha+'',
        fecha: convertDate(fecha)+'',
        hora: hora,
        parametro: null,
        validoorig: null,
        valororig: null
      };
    }

    //restamos una hora y volvemos a crear la fecha
    fecha = new Date(fecha.getTime() - 3600000);
  }

  return a;
}

function fusionar(a)
{
  for (let i = 0; i < a.length; i++) 
  {
    var r  = buscaData(new Date(a[i].date).getTime())
    if( r !== 0)
    {
      a[i] = r;
    }
  }
  
  return a;
}

function buscaData(time)
{ 
  var BreakException = {};
  var d = dataLocalCP;
  var indicador = 0;
  var objeto = 0;

  try {
    d.forEach(function(el,i) {
      indicador = i;
      if (time === hacerFechaValida(el.date).getTime()) throw BreakException;
    });
  } catch (e) {
    if (e !== BreakException) throw e;
    objeto = d[indicador];
    delete dataLocalCP[indicador];
  }

  // for (let i = 0; i < d.length; i++) 
  // {
  //   if(hacerFechaValida(d[i].date).getTime() === time)
  //   {
  //     return d[i];
  //     break;
  //   }    
  // }

   return objeto;
}

function existeUltimoPromedio(e)
{  
  for (let l = 0; l < ultimosEstados.length; l++) 
  {  
    if(ultimosEstados[l].etiqueta == e)
    {
      return l;
      break;
    }
  }
  return -1;  
}

function putGrafica(parametro,horas,maximo)
{
  //dataLocal.results = getNewDatas(dataLocal);
  // var a = crearArrCompleto();
  // var data = fusionar(a);
  var data = crearArrCompleto();
  var valores = [];
  var promediosMoviles = [];
  const hora = 3600000;
  etiquetas = [];
  lbls.days = [];
  lbls.hours = [];
  var e = parametro+''+horas;
  
  for (let index = 0; index < data.length; index++) 
  {
    if(data[index].valororig < maximo && data[index].valororig !== null && data[index].valororig >= 0)
    { 
      valores.push(data[index].valororig); 

      var r = existeUltimoPromedio(e);
          
      if(r !== -1) //si existe se sustitulle
      {
        ultimosEstados[r].valor = data[index].valororig;
      }
      else //si no existe se crea
      { 
        ultimosEstados.push({
          etiqueta : e,
          horas : horas,
          parametro : parametro, 
          valor: data[index].valororig,
        });
      }
    } 
    else
      valores.push(null); 

    // Agrega todas las fechas
    lbls.days.push(data[index].fecha);
    // Agrega todas las horas
    lbls.hours.push(data[index].date.substring(11, 16));

    if(data[index].hora === 0) {
      etiquetas.push(data[index].fecha);
    } else { 
     etiquetas.push('');
    }

    if(horas != "D")
    {
      if(index >= horas-1)
      {
        var acumulado = 0;
        var numValoresValidos = 0;
        const dActual = hacerFechaValida(data[index].date).getTime();
        var dPasada = dActual - (hora * horas);

        for (let l = index; l >= index - (horas-1); l--) 
        {
          var fechaValidar = hacerFechaValida(data[l].date);
       
            var valororig = data[l].valororig;
            if(valororig < maximo && valororig !== null &&  valororig >= 0 )
            {
              acumulado += valororig;
              numValoresValidos++;
            }
        }

        if(numValoresValidos  >= (horas * .75)) 
        {
          var p = acumulado/horas;
          promediosMoviles.push(p);

          var r = existeUltimoPromedio(e);
          
          if(r !== -1) //si existe se sustitulle
          {
            ultimosEstados[r].valor = p;
          }
          else //si no existe se crea
          { 
            ultimosEstados.push({
              etiqueta : e,
              horas : horas,
              parametro : parametro,
              valor: p,
            });
          }
        }
        else
          promediosMoviles.push(null); 
      }
      else
      {
        promediosMoviles.push(null);
      }
    }
    else
    {
      promediosMoviles.push(null); 
    }          
  }

  //validamos si es dato horario
  if(horas != "D")
  {
    // Obtiene el último promedio
    if(promediosMoviles[promediosMoviles.length - 1] !== null  && promediosMoviles[promediosMoviles.length - 1] >= 0 )
    {
      lastAverageOrData =  promediosMoviles[promediosMoviles.length - 1] ;
      $('.chart-gauge').show();
    }
    else
    {
      lastAverageOrData =  0;
      $('.chart-gauge').hide();
    }
    
  }else
  {
    // Obtiene el último dato horario
    if( valores[valores.length - 1] !== null && valores[valores.length - 1] >= 0 )
    {
      lastAverageOrData =  data[data.length - 1] ;
      $('.chart-gauge').show();
    }
    else
    {
      lastAverageOrData =  0;
      $('.chart-gauge').hide();
    }
  }
  
  if(lastAverageOrData == 0)
  {

  }
  // Corta el valor a sólo 3 decimales
  lastAverageOrData = lastAverageOrData.toString();
  lastAverageOrData = lastAverageOrData.substring(0, lastAverageOrData.indexOf('.') + 4);

  var rango = rangoInecc(parametro,horas);
  var valoresRango = [];
  for(var i = 0; i < valores.length; i++)
  {
    valoresRango[i] = rango;
  }

  //crear la label a mostrar
  if(horas != "D")
    var label =  "Promedio móvil de "+parametro+" en "+horas+" horas";
  else  
    var label =  horas;
    
  actualizar_grafica_detalle(valores, etiquetas, lbls, valoresRango, promediosMoviles, label);
}

function rangoInecc(parametro, horas)
{
    var rango = 0;
    var cadena = parametro+""+horas;
    
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
    return rango;
}

function actualizar_grafica_detalle(valores,etiquetas, lbls, valoresRango,promediosMoviles,label)
{
  chart.data.datasets[0].data =  valores;
  chart.data.datasets[1].data =  valoresRango;
  
  if(label != "D" && banderaPromedios ===  true)
  {
    chart.data.datasets[2].data =  promediosMoviles;
    chart.data.datasets[2].label =  label;
  }
  else if(label != "D" && banderaPromedios ===  false)
  {
    var objtemp = 
    {
      label: label,
      borderColor: window.chartColors.green,
      backgroundColor: window.chartColors.green,
      fill: false,
      data:promediosMoviles,
      pointRadius: 1.3,
      borderWidth: 1,
    };

    chart.data.datasets.push(objtemp);
    banderaPromedios = true;
  }
  else if(label === "D" && banderaPromedios ===  true)
  {
    chart.data.datasets.pop();
    banderaPromedios = false;
  }
  
  chart.data.labels =  etiquetas;
  chart.data.labels.dias = lbls.days;
  chart.data.labels.horas = lbls.hours;
  chart.update();
  
  poner_botones(valores);
}

function poner_botones(valores)
{
  ant = valores.length;
  var parametro = valores.length / 4;
  var numDays = [
    { scope: Math.round(parametro * .4), num: 0 },
    { scope: Math.round(parametro * 1), num: 0 },
    { scope: Math.round(parametro * 2), num: 0 },
    { scope: Math.round(parametro * 4), num: 0 }
  ];
  var ind = 0;

  // Suma únicamente las fechas que se muestran en la gráfica
  // de acuerdo a su parámetro
  for (var i = etiquetas.length - 1; i >= 0; i--) {
    if (etiquetas[i] !== "" && i >= (etiquetas.length - 1) - numDays[ind].scope) {
      numDays[ind].num += 1;
    }

    if ((etiquetas.length - 1) - numDays[ind].scope === i) {
      ind += 1;
      numDays[ind].num += numDays[ind - 1].num;
    }
  }

  $(".parametro").each(function(index) {
    $( this ).text(numDays[index].num + " días");
    $(this).val(numDays[index].scope);
  });
}

function convertDate(date)
{
  var yyyy = date.getFullYear().toString();
  var mm = (date.getMonth()+1).toString();
  var dd  = date.getDate().toString();

  var mmChars = mm.split("");
  var ddChars = dd.split("");

  return yyyy + "-" + (mmChars[1]?mm:"0"+mmChars[0]) + "-" + (ddChars[1]?dd:"0"+ddChars[0]);
}

function getFormatDateAPI(d)
{
  var fecha = d.getFullYear()+"-"+ meis[d.getMonth()] +"-"+((d.getDate() < 10?"0":"") + d.getDate())      +"T"+ ( (d.getHours() < 10?"0":"") + d.getHours() ) +":"+( (d.getMinutes()<10?"0":"") + d.getMinutes() )+":00"; 
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
    if(element.state === x && element.activa)
    {
      contenido += '<option value="'+element.id+'">'+element.city+' - '+element.nombre+'</option>';
      numEstaciones ++;
    }
  }

  if(numEstaciones > 0)
  {
    $("#estaciones_select").html(contenido);
  }
  else
  {
    $("#estaciones_select").html('<option value="0">Sin estaciones</option>');
  }
}

function cambiaCoor()
{
    var seleccionado = document.getElementById("estados").value;

    jQuery.each( coor_estado, function( i, val )
    {
      if(seleccionado === val.estado)
      {
          mymap.setView([val.lat, val.long], (val.zoom-1));
      }
    });
}

function llenarConstaminantes(url, parametro)
{
  $.ajax({
    type: "GET",
    url: url,
    data: {},
    success: function( data, textStatus, jqxhr )
    {
      if(data.results.length > 0)
      {
        $("#myModal").modal("show");
        $(".forLoader").removeClass("hide").slideUp();

        if("PM10" === parametro)
        {
          arrPM10 = data;
          $("#botonPM10").trigger("click");
        }
        else if("PM2.5" === parametro)
        {
          arrPM2 = data;
          $("#botonPM25").trigger("click");
        }
        else if("NO2" === parametro)
        {
          arrNO2 = data;
          $("#botonNO2").trigger("click");
        }
        else if("CO" === parametro)
        {
          arrCO = data;
          $("#botonCO").trigger("click");
        }
        else if("O3" === parametro)
        {
          arrO3 = data;
          $("#botonO3D").trigger("click");
        }
        else if("SO2" === parametro)
        {
          arrSO2 = data;
          $("#botonSO2D").trigger("click");
        }
      }
      else
      {
        //cuenta los contaminantes que no reportan valores
        contador_vacios++;

        //se desabilita para móvil
        $("#conataminatesMovil option").each(function(e)
          {
            if($(this).val().indexOf(parametro) > -1)
            { 
              $(this).attr("disabled","disabled");
            }
          }
        );

        //desabilitamos el boton del parametro que estamos consultando
        if("PM2.5" === parametro)
        {
          arrPM25 = data;
          $("#botonPM25").addClass("bloqueado");
        }
        else if("PM10" === parametro)
        {

          arrPM10 = data;
          $("#botonPM10").addClass("bloqueado");
        }
        else if("NO2" === parametro)
        {
          arrNO2 = data;
          $("#botonNO2").addClass("bloqueado");
        }
        else if("CO" === parametro)
        {
          arrCO = data;
          $("#botonCO").addClass("bloqueado");
        }
        else if("O3" === parametro)
        {
          arrO3 = data;
          $("#botonO38").addClass("bloqueado");
          $("#botonO3D").addClass("bloqueado");
        }
        else if("SO2" === parametro)
        {
          arrSO2 = data;
          $("#botonSO2D").addClass("bloqueado");
          $("#botonSO28").addClass("bloqueado");
          $("#botonSO224").addClass("bloqueado");
        }
      }
      
      if(contador_vacios === 6)
      {
        $(".forLoader").removeClass("hide").slideUp();
        $("#alertModal").modal("show");
        contador_vacios = 0;
        $(".boton_pop").each(function(){
          $(this).removeClass("bloqueado");
        });
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
  const dActual = new Date();
  var dPasada = new Date();

  dPasada.setHours(dActual.getHours() - horas);

  var url = "https://api.datos.gob.mx/v2/sinaica-30?parametro="+parametro+"&estacionesid="+id_estacion+"&date>"+getFormatDateAPI(dPasada)+"&date<"+getFormatDateAPI(dActual)+"&validoorig=1&pageSize="+1000;

  return url;
}

function changeMovilOption(parametro,horas)
{
  if(parametro === "PM10")
    $("#conataminatesMovil").val("PM10");
  if(parametro === "PM2.5")
    $("#conataminatesMovil").val("PM2.5");
  if(parametro === "NO2")
    $("#conataminatesMovil").val("NO2");
  if(parametro === "SO2" && horas === "D")
    $("#conataminatesMovil").val("SO2D");
  if(parametro === "SO2" && horas === "8")
    $("#conataminatesMovil").val("SO28");
  if(parametro === "SO2" && horas === "24")
    $("#conataminatesMovil").val("SO224");
  if(parametro === "O3" && horas === "D")
    $("#conataminatesMovil").val("O3D");
  if(parametro === "O3" && horas === "8")
    $("#conataminatesMovil").val("O38");
  if(parametro === "CO")
    $("#conataminatesMovil").val("CO8");
}

function cambioParametro(parametro, horas,id,titulo,lb)
{
  $("#alerta").hide();
  

  ponerReocmendaciones();
  reset_botones();
  
  if(!($("#"+id).hasClass("bloqueado")))
  {
    
    cambioBotonActivo(id);
    changeMovilOption(parametro,horas);
    var estado =  $("#estado_primer_select").val();
    var estacion =  $("#estaciones_select").val();

    $("#contaminante_detalle").html(parametro);
    $("#contaminante_grafica").html(parametro);
    $("#tituloTexto").html(parametro);
    $("#textoTitulo").html(titulo);

    //porEstaciones(estado,estacion,parametro,horas);
    var promedioFinal = 0;
    var maximoL = 0;
    var maximoP = 0;
    var label = "";
    if("PM10" === parametro)
    {
      maximoL = 600;
      dataLocal = arrPM10;
      maximoP = rangoInecc(parametro,horas);
      label = "µg/m³";
    }
    else if("PM2.5" === parametro)
    {
      maximoL = 175;
      dataLocal = arrPM2;
      maximoP = rangoInecc(parametro,horas);
      label = "µg/m³";
    }
    else if("NO2" === parametro)
    {
      maximoL = 0.21;
      dataLocal = arrNO2;
      maximoP = rangoInecc(parametro,horas);
      label = "ppm";
    }
    else if("CO" === parametro)
    {
      maximoL = 15;
      dataLocal = arrCO;
      maximoP = rangoInecc(parametro,horas);
      label = "ppm";
    }
    else if("O3" === parametro)
    {
      maximoL = 0.2;
      dataLocal = arrO3;
      maximoP = rangoInecc(parametro,horas);
    
      label = "ppm";
    }
    else if("SO2" === parametro)
    {
      maximoL = 0.2;
      dataLocal = arrSO2;
      maximoP = rangoInecc(parametro,horas);

      label = "ppm";
    }
    

    putGrafica(parametro, horas,maximoL);
    promedioFinal =  lastAverageOrData;


    if(promedioFinal > 0)
    {
      // if(maximoP < promedioFinal)
      //   $("#recomendaciones").show();

      $(".chart-gauge").html("");
      $(".chart-gauge").gaugeIt({ selector: ".chart-gauge", value: lastAverageOrData,label:label,gaugeMaxValue:maximoP*2});
    }
    else
    {
      $(".chart-gauge").html("");
      $(".chart-gauge").gaugeIt({ selector: ".chart-gauge", value: lastAverageOrData, label: label, gaugeMaxValue: maximoP*2});
    }
  }
}

function ponerReocmendaciones()
{
  for (let index = 0; index < ultimosEstados.length; index++) 
  {  
    var r = rangoInecc(ultimosEstados[index].parametro,ultimosEstados[index].horas);
    if(ultimosEstados[index].valor > r)
    {
      $("#recomendaciones").show();
    }
  }
}

function sacaDatoDiario(data,horas,max)
{
  if(horas != "D")
  {
    const dActual = new Date();
    var dPasada = new Date();
    dPasada.setHours(dActual.getHours() - horas);

    var datos =  data.results;
    var arrTemp = [];

    for (let index = datos.length - 1; index > 0;  index--)
    {

      var fechaValida = hacerFechaValida(datos[index]["date"]);
      
      if(fechaValida.getTime() >= dPasada.getTime() && fechaValida.getTime() <= dActual.getTime())

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
      
      if(arrTemp[index].valororig < max && arrTemp[index].validoorig === 1)

      {    
        acumulado += arrTemp[index].valororig;
        promedio++;
      }
    }
    promedio = 0;
    acumulado = 0;
    var tamDatos = datos.length-1;
    for (let l = tamDatos; l > tamDatos - horas; l--)
    {    
      if(datos[l].valororig < max && datos[l].validoorig === 1)
      {   

        acumulado += datos[l].valororig;
        promedio++;
      } 
    }
    if((arrTemp.length * .75) < promedio )
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
    if(data.results[data.results.length-1].valororig < max)
      return data.results[data.results.length-1].valororig;
    else
      return 0;    
  }
}

function ponContaminantesSel()
{
      var options = '<option value="0">3.-Selecciona Contaminate</option>'+
      '<option value="PM10_24" title="Las partículas menores o iguales a 2.5 micras (PM2.5) están formadas primordialmente por gases y por material proveniente de la combustión. Se depositan fundamentalmente en la región traqueobronquial (tráquea hasta bronquiolo terminal), aunque pueden ingresar a los alvéolos.">PM 10 µg/m&sup3;</option>'+
          '<option value="PM2.5_24" title="Las partículas menores o iguales a 2.5 micras (PM2.5) están formadas primordialmente por gases y por material proveniente de la combustión. Se depositan fundamentalmente en la región traqueobronquial (tráquea hasta bronquiolo terminal), aunque pueden ingresar a los alvéolos.">PM 2.5 µg/m&sup3;</option>'+
          '<option value="SO2_24" title="Gas incoloro que se origina durante la combustión de carburantes fósiles que contienen azufre (petróleo, carbón, entre otros). La exposición a niveles altos de este contaminante produce irritación e inflamación de garganta y bronquios.">SO2 (ppm) Promedio 24 horas</option>'+
          '<option value="SO2_8" title="Gas incoloro que se origina durante la combustión de carburantes fósiles que contienen azufre (petróleo, carbón, entre otros). La exposición a niveles altos de este contaminante produce irritación e inflamación de garganta y bronquios.">SO2 (ppm) Promedio 8 horas</option>'+
          '<option value="SO2_D" title="Gas incoloro que se origina durante la combustión de carburantes fósiles que contienen azufre (petróleo, carbón, entre otros). La exposición a niveles altos de este contaminante produce irritación e inflamación de garganta y bronquios.">SO2 (ppm) Dato horario</option>'+
          '<option value="O3_8" title="Es un compuesto gaseoso incoloro, que posee la capacidad de oxidar materiales, y causa irritación ocular y en las vías respiratorias.">Ozono (O3)(ppm) Promedio 8 horas</option>'+
          '<option value="O3_D" title="Es un compuesto gaseoso incoloro, que posee la capacidad de oxidar materiales, y causa irritación ocular y en las vías respiratorias.">Ozono (O3)(ppm) Dato horario</option>'+
          '<option value="NO2_24" title="El dióxido de nitrógeno es un compuesto químico gaseoso de color marrón amarillento, es un gas tóxico e irritante. La exposición a este gas disminuye la capacidad de difusión pulmonar.">NO2 (ppm)</option>'+
          '<option value="CO_24" title="Es un gas incoloro e inodoro que en concentraciones altas puede ser letal ya que forma carboxihemoglobina, la cual impide la oxígenación de la sangre.">CO (ppm)</option>';

    $("#contaminantes").html(options);
    $("#contaminantes").trigger( "change" );
}

function buscarEstacion(id_estacion)
{
  var estacion = 0 ;
  for (let index = 0; index < estaciones_json.length; index++)
  {
    var element =  estaciones_json[index];
    if(element.id === id_estacion)
    {
      estacion = element;
      break;
    }
  }
  return estacion;
}





//manejo de foreach
// function pruebaArreglo()
// {
//   var numbers = [
//     {date: 1,
//         'date-insert':'',
//         fecha: '',
//         hora: 1,
//         parametro: null,
//         validoorig: null,
//         valororig: null},
//         {date: 2,
//           'date-insert':'',
//           fecha: '',
//           hora: 2,
//         parametro: null,
//         validoorig: null,
//         valororig: null},
//         {date: 3,
//           'date-insert':'',
//           fecha: '',
//           hora: 3,
//         parametro: null,
//         validoorig: null,
//         valororig: null},
//         {date: 4,
//           'date-insert':'',
//           fecha: '',
//           hora: 4,
//         parametro: null,
//         validoorig: null,
//         valororig: null},
//         {date: 5,
//           'date-insert':'',
//           fecha: '',
//           hora: 5,
//         parametro: null,
//         validoorig: null,
//         valororig: null}
//   ];
  

//   var BreakException = {};

//   try {
//     numbers.forEach(function(el) {
//       console.log(el);
//       if (4 === el.date) throw BreakException;
//     });
//   } catch (e) {
//     if (e !== BreakException) throw e;
//     delete numbers[1];
//   }

//   console.log('cambiamos');

//   numbers.forEach(function(el) {
//     console.log(el);
//   });

// }