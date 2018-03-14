//poner todas las funciones

//variables globales de la pagina
var estaciones = [];
var temporale = [];
var avg = 0;
var totalt = 0;
var d = new Date();
var anio = d.getFullYear();
var meis = ["01","02","03","04","05","06","07","08","09","10","11","12"];
var mes = meis[d.getMonth()];
var deis = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];
var dia = deis[d.getDate()];
var meses_abr = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
];


//regresa la fecha con el formato que requiere el api
function getFormatDateAPI(d){
  var fecha = d.getFullYear()+'-'+ meis[d.getMonth()] +'-'+((d.getDate() < 10?'0':'') + d.getDate())      +'T'+ ( (d.getHours() < 10?'0':'') + d.getHours() ) +':'+( (d.getMinutes()<10?'0':'') + d.getMinutes() )+':00';
  return fecha;
}

function restaHoras(d,h){
  return d.getHours() - h;
}

function get_fecha_corta(d){
  var fecha = d.getFullYear()+'-'+ meis[d.getMonth()] +'-'+((d.getDate() < 10?'0':'') + d.getDate());
  return fecha;
}

function put_temperatura(estacion,contenedor){
  var fActual = new Date();
  var url =  "https://api.datos.gob.mx/v1/sinaica?parametro=TMP&fecha="+get_fecha_corta(fActual)+"&estacionesid="+estacion;
  $.ajax({
    type: 'GET',
    url: url,
    data: {},
    success: function( data, textStatus, jqxhr ) {
      if(data.results.length > 0)
        contenedor.html(data.results[data.results.length-1].valororig);
      else
        contenedor.html('ND');
    },
    xhrFields: {
      withCredentials: false
    },
    crossDomain: true,
    async:true
  });
}

function reset_botones(){
  $('.parametro').each(function(index){
    $( this ).removeClass('active');
  });

  $('#pinta_primero').addClass('active');
}

function get_fecha_formato(fecha)
{
    //voltear fecha 
    var voltear  =  fecha.split('-');
    var nuevaFecha  =  voltear[1]+'/'+voltear[2]+'/'+voltear[0];
    var f = new Date(nuevaFecha);
    
    return  f.getDate() + '-' + meses_abr[f.getMonth()];
}
