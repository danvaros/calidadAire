var temporale=[],avg=0,totalt=0,d=new Date,anio=d.getFullYear(),meis=["01","02","03","04","05","06","07","08","09","10","11","12"],mes=meis[d.getMonth()],deis=["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"],dia=deis[d.getDate()],meses_abr=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];function restaHoras(a,t){return a.getHours()-t}function get_fecha_corta(a){return a.getFullYear()+"-"+meis[a.getMonth()]+"-"+(a.getDate()<10?"0":"")+a.getDate()}function put_temperatura(a,r){var t="https://api.datos.gob.mx/v1/sinaica?parametro=TMP&fecha="+get_fecha_corta(new Date)+"&estacionesid="+a;$.ajax({type:"GET",url:t,data:{},success:function(a,t,e){0<a.results.length?r.html(a.results[a.results.length-1].valororig):r.html("ND")},xhrFields:{withCredentials:!1},crossDomain:!0,async:!0})}function reset_botones(){$(".parametro").each(function(a){$(this).removeClass("active")}),$("#pinta_primero").addClass("active"),ant_val_arr=[],ant_val_arr_rango=[],ant_val_arr_promedio=[],ant_lab_arr=[],ant_lab_arr_dias=[],ant_lab_arr_horas=[]}function get_fecha_formato(a){var t=a.split("-"),e=t[1]+"/"+t[2]+"/"+t[0],r=new Date(e);return r.getDate()+"-"+meses_abr[r.getMonth()]}