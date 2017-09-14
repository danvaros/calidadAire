//poner todas las funciones generale que hagan cosas muy generales

var meis = ["01","02","03","04","05","06","07","08","09","10","11","12"];

var deis = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];

//regresa la fecha con el formato que requiere el api
//
function getFormatDateAPI(d){
  var fecha = d.getFullYear()+'-'+ meis[d.getMonth()] +'-'+((d.getDate() < 10?'0':'') + d.getDate())      +'T'+ ( (d.getHours() < 10?'0':'') + d.getHours() ) +':'+( (d.getMinutes()<10?'0':'') + d.getMinutes() )+':00';
  return fecha;
}

function restaHoras(d,h){
  return d.getHours() - h;
}
