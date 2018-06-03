var dataLocal = [];
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

var arrPM10 = [];
var arrPM2 = [];
var arrNO2 = [];
var arrCO = [];
var arrO3 = [];
var arrSO2 = [];
var extension = "";

var hourSelected = "";

var dataHour = {
  "D": "1hr",
  "8": "8hrs",
  "24": "24hrs"
}

var contador_vacios = 0;
var ant = 0;
var banderaPromedios = true;
var ultimosEstados = [];

var pollutantsDescription = {
  "PM10": "Las partículas menores o iguales a 10 micras (PM<sub>10</sub>) se depositan en la región extratorácica del tracto respiratorio (nariz, boca, naso, oro y laringofarínge); contienen principalmente materiales de la corteza terrestre y se originan en su mayoría por procesos de desintegración de partículas más grandes. También pueden contener material biológico como polen, esporas, virus o bacterias o provenir de la combustión incompleta de combustibles fósiles.",
  "PM2.5": "Las partículas menores o iguales a 2.5 micras (PM<sub>2.5</sub>) están formadas primordialmente por gases y por material proveniente de la combustión. Se depositan fundamentalmente en la región traqueobronquial (tráquea hasta bronquiolo terminal), aunque pueden ingresar a los alvéolos.",
  "NO2": "El dióxido de nitrógeno es un compuesto químico gaseoso de color marrón amarillento, es un gas tóxico e irritante. La exposición a este gas disminuye la capacidad de difusión pulmonar.",
  "SO2": "Gas incoloro que se forma al quemar combustibles fósiles que contienen azufre. La exposición a niveles altos de este contaminante produce irritación e inflamación de garganta y bronquios.",
  "O3": "Es un compuesto gaseoso incoloro, que posee la capacidad de oxidar materiales, y causa irritación ocular y en las vías respiratorias.",
  "CO": "Es un gas incoloro e inodoro que en concentraciones altas puede ser letal ya que forma carboxihemoglobina, la cual impide la oxigenación de la sangre."
}

$(document).ready(function()
{
  $("#estados").val("Aguascalientes");
  $(".forLoader").removeClass("hide").slideUp();

  $('#infoModal').modal();
  
  $("#myModal").on("hidden.bs.modal", function () 
  {
    contador_vacios = 0;
    ultimosEstados = [];
    $(".boton_pop").each(function(){
      $(this).removeClass("bloqueado");
    });

    var arr_vacio = [];
    chart.data.datasets[0].data =  arr_vacio;
    chart.data.datasets[1].data =  arr_vacio;
    chart.data.labels =  arr_vacio;
    chart.update();
    poner_botones(arr_vacio);
    $(".temperatura").show();

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
    hourSelected = $(this).attr("data-hour");

    llenarConstaminantes(generaUrl(
      $(this).attr("data-id"),
      $("#estaciones_select").val(),
      (24 * 28)),
      $(this).attr("data-id")
    );
  });

  // Get states selected
  $("#estado_primer_select").on("change", function() { ponEstacionesSel() });
  // Get states map selected
  $("#estados").on("change", function () { cambiaCoor() });

  /* instancia del mapa*/
  mymap.panTo(new L.LatLng(24.8, -100));

  var OpenStreetMap_BlackAndWhite = L.tileLayer("http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png",
  {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });

  OpenStreetMap_BlackAndWhite.addTo(mymap);
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) mymap.dragging.disable();
  mymap.scrollWheelZoom.disable();
  /*fin de instancia del mapa*/

  $("#estado_primer_select").html(options_estado());

  $("#estaciones_select").on('change', function()
  {
    $(".forLoader").show();
    var estacion =  $(this).val();

    //ponemos los parametros en la ventana 
    $("#fecha_detalle").html(convertDate(new Date())); 
    $("#fecha_detalle_m").html(convertDate(new Date())); 
    var objEstacion = buscarEstacion(estacion);
    
    $("#titulo_detalle").html(buscarCiudad(estacion)); 
    $("#estacion_detalle").html($("#estaciones_select option:selected").text()); 
    $("#estacion_detalle_m").html('<b>'+$("#estaciones_select option:selected").text()+'</b>'); 
    
    $("#textoTitulo").html($("#" + idPollutant).attr("data-original-title")); 
 
    var idPollutant = "botonPM10";
    cambioBotonActivo(idPollutant); 

    //vamos a llenar los arreglos de todos los coantaminantes
    llenarConstaminantes(generaUrl('PM10', estacion, (24*28)),'PM10');
    llenarConstaminantes(generaUrl('PM2.5', estacion, (24*28)),'PM2.5');
    llenarConstaminantes(generaUrl('NO2', estacion, (24*28)),'NO2');
    llenarConstaminantes(generaUrl('SO2', estacion, (24*28)),'SO2');
    llenarConstaminantes(generaUrl('O3', estacion, (24*28)),'O3');
    llenarConstaminantes(generaUrl('CO', estacion, (24*28)),'CO');
    ponerTemperatura(generaUrl('TMP', estacion, (3)),'TMP');
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
          label: "Límite móvil",
          borderColor: window.chartColors.red,
          backgroundColor: window.chartColors.red,
          fill: false,
          data:[10, 10, 10, 10, 10, 10, 10],
          pointRadius: 1.3,
          borderWidth: 1,
        },
        {
          label: "Promedio horario",
          backgroundColor: color(window.chartColors.blue).alpha(0.2).rgbString(),
          borderColor: window.chartColors.blue,
          pointBackgroundColor: window.chartColors.blue,
          data: [0, 10, 5, 2, 20, 30, 45],
          fill: false,
          pointRadius: 1.3,
          borderWidth: 1,
        },
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
            callback: function (value, index, values) {
              var val = value.toString();
              return val.substring(0, val.indexOf('.') + 4) + extension;
            },
            padding: 5,
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

  $(".parametro").click(function(e)
  {
    e.preventDefault();
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
      cambioParametro("PM10", "24", "botonPM10")
    }
    else if("PM2.5" === $(this).val())
    {
      cambioParametro("PM2.5", "24", "botonPM25");
    }
    else if("NO2" === $(this).val())
    {
      cambioParametro("NO2", "D",  "botonNO2")
    }
    else if("SO2D" === $(this).val())
    {
      cambioParametro("SO2", "D", "botonSO2D")
    }
    else if("SO28" === $(this).val())
    {
      cambioParametro("SO2", "8", "botonSO28");
    }
    else if("SO224" === $(this).val())
    {
      cambioParametro("SO2", "24", "botonSO224");
    }
    else if("O3D" === $(this).val())
    {
      cambioParametro("O3", "D", "botonO3D");
    }
    else if("O38" === $(this).val())
    {
      cambioParametro("O3", "8", "botonO38");
    }
    else if("CO8" === $(this).val())
    {
      cambioParametro("CO", "8", "botonCO");
    }
    else { return 0; }
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

function ponerTemperatura(url)
{
  $.ajax({
    type: "GET",
    url: url,
    data: {},
    success: function( data, textStatus, jqxhr )
    {
      var temperatura = "";
      for (let index = 0; index < data.results.length; index++) {
        if(data.results[index].valororig <= 60 && data.results[index].valororig >= -50)
        {
          temperatura = data.results[index].valororig.toFixed(2);
        }
      }

      if(temperatura !== "")
      {
        $("#temperatura_detalle").text(temperatura+' ℃');
        $("#temperatura_detalle_m").text(temperatura + ' ℃');
      }
      else
      {
        $(".temperatura").hide();
      }
    },
    xhrFields: {
      withCredentials: false
    },
    crossDomain: true,
    async:true
  });
}

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

function cambioBotonActivo(idButton)
{
  //cambio de active boton
  $(".boton_pop").each(function()
  {
    $(this).removeClass( "active_pop" )
  });
  $("#" + idButton).addClass("active_pop");
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
  var stateOptions  = '<option value="0">1.-Selecciona un estado</option>';
  for (let index = 0; index < coor_estado.length; index++)
  {
    const element = coor_estado[index];
    stateOptions += '<option value="'+element.estado+'">'+element.estado+'</option>'
  }

  return stateOptions;
}

function getNewDatas(data) {
  var newData = [];
  var totalHoursMonth = 672; // 24 hrs * 28 days
  var dateInsert = moment();
  // Bander para realmente llenar la última hora
  // debido al cambio de horario
  var noReal672 = false;
  var prevDate = moment().minutes(0).seconds(0).milliseconds(0);
  prevDate.add(-671, 'hour'); // una hora menos aún por causa del cambio de horario

  function addNullValues(prevD) {
    newData.push({
      date: prevD.format(),
      'date-insert': dateInsert.format(),
      fecha: prevD.format('YYYY-MM-DD'),
      hora: prevD.get('hour'),
      parametro: null,
      validoorig: null,
      valororig: null
    });

    prevD.add(1, 'hour');
  }

  data.forEach(function (val, ind) {
    var f = val.fecha;
    var h = val.hora;
    var hora = h < 10 ? "0" + h : h;
    var currentDate = moment(f + ' ' + hora + ':00:00');

    // Condición exclusiva para el horario de verano
    // la hora 2 la convierte en la hora 3, y no se agrega hora del prevDate
    if (currentDate.get('hour') !== h) {
      newData.push(val);
      noReal672 = true;
    } else if (currentDate.format() === prevDate.format() ||
              (prevDate.get('hour') === 1 && h === 2)) { // Condición exclusiva para horario de invierno
      newData.push(val);
      prevDate.add(1, 'hour');
    } else {
      // Llena el array de datos nulos hasta coincidir con 
      while (currentDate.format() !== prevDate.format()) {
        addNullValues(prevDate);
      }

      newData.push(val);
      prevDate.add(1, 'hour');
    }
  });

  // Llena los últimos datos nulos hasta la fecha actual
  if (newData.length < totalHoursMonth) {
    for (var i = newData.length; i <= totalHoursMonth - 1; i++) {
      addNullValues(prevDate);
    }
  }
  // Condicional exclusiva para que nos de realmente la última hora
  // debido al cambio de horario
  if (noReal672) {
    addNullValues(prevDate);
  } else if (!noReal672 && newData.length === 673) { newData.pop(); }

  return newData;
}

function existeUltimoPromedio(e)
{  
  for (let l = 0; l < ultimosEstados.length; l++) 
  {  
    if(ultimosEstados[l].etiqueta === e)
    {
      return l;
      break;
    }
  }
  return -1;  
}

function ponerReocmendaciones()
{
  for (let index = 0; index < ultimosEstados.length; index++) 
  {  
    var r = rangoInecc(ultimosEstados[index].parametro,ultimosEstados[index].horas);
    if(ultimosEstados[index].valor > r) {
      $("#recomendaciones").show();
    }
  }
}

function getUltimoRango(p)
{
  var valor = '';
  for (let index = 0; index < ultimosEstados.length; index++) 
  {
    if(ultimosEstados[index].etiqueta === p)
    {
      valor =  ultimosEstados[index];
    }
  }

  return valor;
}


function putGrafica(parametro,horas,maximo)
{
  if (dataLocal.results.length > 0) {
    dataLocal.results = getNewDatas(dataLocal.results);
  }

  var data = dataLocal.results;
  var valores = [];
  var promediosMoviles = [];
  const hora = 3600000;
  etiquetas = [];
  lbls.days = [];
  lbls.hours = [];
  var e = parametro+''+horas;

  var newInd = 0;
  for (let index = 0; index < data.length; index++) 
  {
    if(data[index].valororig < maximo && data[index].valororig !== null && data[index].valororig >= 0 )
    {
      valores.push(data[index].valororig); 
    
      var r = existeUltimoPromedio(e);
      if(horas === "D")
      {
        if(r !== -1) //si existe se sustitulle
        {
          ultimosEstados[r].valor = data[index].valororig;
          ultimosEstados[r].fecha = data[index].fecha;
          ultimosEstados[r].hora = data[index].hora;
        }
        else //si no existe se crea
        { 
          ultimosEstados.push({
            etiqueta : e,
            fecha:data[index].fecha,
            hora:data[index].hora,
            horas : horas,
            parametro : parametro, 
            valor: data[index].valororig,
          });
        }
      }  
    }
    else
      valores.push(null); 

    // Agrega todas las fechas
    lbls.days.push(data[index].fecha);
    // Agrega todas las horas
    lbls.hours.push((data[index].hora).toString() + ":00");

    if(data[index].hora === 0) {
      etiquetas.push(data[index].fecha);
      newInd = 0;
    } else { 
     etiquetas.push('');
     newInd++;
    }

    if(horas !== "D")
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
            if(valororig < maximo && valororig !== null  && valororig >= 0)
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
            ultimosEstados[r].fecha = data[index].fecha;
            ultimosEstados[r].hora = data[index].hora;
          }
          else //si no existe se crea
          { 
            ultimosEstados.push({
              etiqueta : e,
              fecha:data[index].fecha,
              hora:data[index].hora,
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

//validamos si es Promedio horario
  if(horas !== "D")
  {
    // Obtiene el último promedio
    if(promediosMoviles[promediosMoviles.length - 1] !== null  && promediosMoviles[promediosMoviles.length - 1] >= 0 )
    {
      lastAverageOrData =  promediosMoviles[promediosMoviles.length - 1] ;
      //$(".chart-gauge").show();
    }
    else
    {
      lastAverageOrData =  0;
      //$(".chart-gauge").hide();
    }
    
  }else
  {
    // Obtiene el último Promedio horario
    if( valores[valores.length - 1] !== null && valores[valores.length - 1] >= 0 )
    {
      lastAverageOrData =  data[data.length - 1].valororig  ;
      //$(".chart-gauge").show();
    }
    else
    {
      lastAverageOrData =  0;
      //$(".chart-gauge").hide();
    }
  }

  // Corta el valor a sólo 3 decimales
  if (lastAverageOrData !== null) {
    lastAverageOrData = lastAverageOrData.toString();
    lastAverageOrData = lastAverageOrData.substring(0, lastAverageOrData.indexOf('.') + 4);
  }

  var rango = rangoInecc(parametro,horas);
  var valoresRango = [];
  for(var i = 0; i < valores.length; i++)
  {
    valoresRango[i] = rango;
  }

  var labelsData = {
    labelInfo: "",
    labelLimit: "",
    label: ""
  }

  var prettyParameter = parameter_decorator(parametro, false);
  //crear la label a mostrar
  if(horas !== "D") {
    labelsData.labelInfo = "Promedio horario de " + prettyParameter + " en " + horas + "hrs.";
    labelsData.labelLimit = "Límite NOM";
    labelsData.label = "Promedio móvil de " + horas + " hrs. para " + prettyParameter;
    if (horas === "24")
      labelsData.label += " **";
    else
      labelsData.label += "";
  } else {
    labelsData.labelInfo = "Promedio horario de " + prettyParameter;
    labelsData.labelLimit = "Límite NOM";
    labelsData.label = horas;
  }

  // Actualiza la extensión del eje de las Y
  if (parametro === "PM10" || parametro === "PM2.5")
    extension = " µg/m³";
  else
    extension = " ppm";
    
  actualizar_grafica_detalle(valores, etiquetas, lbls, valoresRango, promediosMoviles, labelsData);
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

function actualizar_grafica_detalle(valores, etiquetas, lbls, valoresRango, promediosMoviles, labelsData)
{
  chart.data.datasets[0].data =  valoresRango;

  if (labelsData.label !== "D" && banderaPromedios ===  true)
  {
    chart.data.datasets[1].data =  promediosMoviles;
    chart.data.datasets[1].label =  labelsData.label;
    chart.data.datasets[1].backgroundColor = color(window.chartColors.green).alpha(0.2).rgbString();
    chart.data.datasets[1].borderColor = window.chartColors.green;
    chart.data.datasets[1].pointBackgroundColor = window.chartColors.green;
  }
  else if (labelsData.label === "D" && banderaPromedios ===  true)
  {
    chart.data.datasets[1].data =  valores;
    chart.data.datasets[1].label = labelsData.labelInfo;
    chart.data.datasets[1].backgroundColor = color(window.chartColors.blue).alpha(0.2).rgbString();
    chart.data.datasets[1].borderColor = window.chartColors.blue;
    chart.data.datasets[1].pointBackgroundColor = window.chartColors.blue;
  }
  
  chart.data.datasets[0].label = labelsData.labelLimit;
  
  chart.data.labels =  etiquetas;
  chart.data.labels.dias = lbls.days;
  chart.data.labels.horas = lbls.hours;
  chart.update();
  
  poner_botones(valores);
}

function poner_botones(valores)
{
  ant = valores.length;
  var numDays = [
    { scope: Math.round(24 * 3), num: 3 },
    { scope: Math.round(24 * 7), num: 7 },
    { scope: Math.round(24 * 14), num: 14 },
    { scope: Math.round(24 * 28), num: 28 }
  ];

  $(".parametro").each(function (index) {
    $(this).text(numDays[index].num + " días");
    $(this).val(numDays[index].scope);
  });
}

function convertDate(dateToConvert)
{
  var yyyy = dateToConvert.getFullYear().toString();
  var mm = (dateToConvert.getMonth()+1).toString();
  var dd  = dateToConvert.getDate().toString();

  var mmChars = mm.split("");
  var ddChars = dd.split("");

  return yyyy + "-" + (mmChars[1]?mm:"0"+mmChars[0]) + "-" + (ddChars[1]?dd:"0"+ddChars[0]);
}

function getFormatDateAPI(d)
{
  var fecha = d.getFullYear() + "-" +
              meis[d.getMonth()] + "-" +
              ( (d.getDate() < 10?"0":"") + d.getDate() )+
              "T" +( (d.getHours() < 10?"0":"") +d.getHours() ) + ":00:00"; 
              
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

function DateFalsa()
{
  return new Date("2018-03-07 00:00:00");
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
          cambioParametro("PM10", "24", "botonPM10");
        }
        else if("PM2.5" === parametro)
        {
          arrPM2 = data;
          cambioParametro("PM2.5", "24", "botonPM25");
        }
        else if("NO2" === parametro)
        {
          arrNO2 = data;
          cambioParametro("NO2", "D", "botonNO2");
        }
        else if("CO" === parametro)
        {
          arrCO = data;
          cambioParametro("CO", "8", "botonCO");
        }
        else if ("O3" === parametro && hourSelected === "")
        {
          arrO3 = data;
          cambioParametro("O3", "D", "botonO3D");
        }
        else if ("O3" === parametro && hourSelected !== "")
        {
          arrO3 = data;
          cambioParametro("O3", hourSelected, "botonO3" + hourSelected);
        }
        else if ("SO2" === parametro && hourSelected === "")
        {
          arrSO2 = data;
          cambioParametro("SO2", "8", "botonSO28");
        }
        else if ("SO2" === parametro && hourSelected !== "")
        {
          arrSO2 = data;
          cambioParametro("SO2", hourSelected, "botonSO2" + hourSelected);
        }
        else { return 0; }
      }
      else
      {
        //cuenta los contaminantes que no reporttan valores
        contador_vacios++;

        //se desabilita para móvil
        $("#conataminatesMovil option").each(function(e)
          {
            if($(this).val().indexOf(parametro) > -1)
            { 
              $(this).attr("disabled","disabled");
            }
            else { return 0; }
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

          //$("#botonSO2D").addClass("bloqueado");
          $("#botonSO28").addClass("bloqueado");
          $("#botonSO224").addClass("bloqueado");
        }
        else { return 0; }
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
      else { return 0; }
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

  var url = "https://api.datos.gob.mx/v2/sinaica-30?parametro="+parametro+"&estacionesid="+id_estacion+"&date>"+getFormatDateAPI(dPasada)+"&date<="+getFormatDateAPI(dActual)+"&validoorig=1&pageSize="+1000;

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

function parameter_decorator(parameter, isHtml) {
  var decorator = "";

  switch (parameter) {
    case "PM10":
      decorator = isHtml ? "PM<sub>10</sub>" : "PM₁₀";
      break;
    case "PM2.5":
      decorator = isHtml ? "PM<sub>2.5</sub>" : "PM₂.₅";
      break;
    case "SO2":
      decorator = isHtml ? "SO<sub>2</sub>" : "SO₂";
      break;
    case "NO2":
      decorator = isHtml ? "NO<sub>2</sub>" : "NO₂";
      break;
    case "O3":
      decorator = isHtml ? "O<sub>3</sub>" : "O₃";
      break;
    default:
      decorator = "CO";
      break;
  }

  return decorator;
}

function cambioParametro(parametro, horas, idButton)
{
  $("#alerta").hide();
  $("#recomendaciones").hide();
  
  //reset_botones();
  //ponerReocmendaciones();
  
  if(!($("#"+idButton).hasClass("bloqueado")))
  {
    cambioBotonActivo(idButton);
    changeMovilOption(parametro,horas);
    var estado =  $("#estado_primer_select").val();
    var estacion =  $("#estaciones_select").val();

    $("#contaminante_detalle").html(parameter_decorator(parametro, true));
    $("#contaminante_grafica").html(parameter_decorator(parametro, true));
    $("#tituloTexto").html(parameter_decorator(parametro, true));
    $("#textoTitulo").html(pollutantsDescription[parametro]);

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
    else { return 0; }

    putGrafica(parametro, horas,maximoL);
    promedioFinal =  lastAverageOrData;

    var ultimoRango =  getUltimoRango(parametro+''+horas);

    if(ultimoRango !== '')
    {
      var vString = ultimoRango.valor.toString();
      vString = vString.substring(0, vString.indexOf('.') + 4);
      $(".chart-gauge").html("");
      $(".chart-gauge").gaugeIt({ selector: ".chart-gauge", value: vString,label:label,gaugeMaxValue:maximoP*2});

      $(".date-gauge").html(ultimoRango.fecha+ " -- " + ultimoRango.hora+':00:00 CST');
    }
    else
    {
      $(".chart-gauge").html("");
      $(".chart-gauge").gaugeIt({ selector: ".chart-gauge", value: 0,label:label,gaugeMaxValue:maximoP*2});

      $(".date-gauge").html("");
    }
    
    if(promedioFinal > 0)
    {
      if(maximoP < promedioFinal)
      {
        $("#recomendaciones").show();      
      }
    }

    // else
    // {
    //   $(".chart-gauge").html("");
    //   $(".chart-gauge").gaugeIt({ selector: ".chart-gauge", value: getUltimoRango(parametro+''+horas).toFixed(3), label: label, gaugeMaxValue: maximoP*2});
    // }
  }
  else { return 0; }
}

function sacaDatoDiario(data,horas,maxValue)
{
  if(horas !== "D")
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
      if(arrTemp[index].valororig < maxValue && arrTemp[index].validoorig === 1)
      {    
        acumulado += arrTemp[index].valororig;
        promedio++;
      }
      else { return 0; }
    }
    promedio = 0;
    acumulado = 0;
    var tamDatos = datos.length-1;
    for (let l = tamDatos; l > tamDatos - horas; l--)
    {    
      if(datos[l].valororig < maxValue && datos[l].validoorig === 1)
      {   

        acumulado += datos[l].valororig;
        promedio++;
      }
      else { return 0; }
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
    if(data.results[data.results.length-1].valororig < maxValue)
      return data.results[data.results.length-1].valororig;
    else
      return 0;    
  }
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
    else { return 0; }
  }
  return estacion;
}
