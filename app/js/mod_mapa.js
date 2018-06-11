$(document).ready(function()
{
    var marker_mymap;
    var myFeatureGroup = L.featureGroup().addTo(mymap).on("click", groupClick);
    var greenIcon = L.icon({
        iconUrl: "imagenes/punto.png",
        iconAnchor:   [12, 24], // point of the icon which will correspond to 
    });

    //recorremos las estaciones para pintarlas en el mapa
    for (var i = 0; i < estaciones_json.length; i++)
    {
        //v 2.0 validacion de la actividad de la estación
        if(estaciones_json[i].activa)
        {
            if(estaciones_json[i].lat !== 0 && estaciones_json[i].lat !== 0)
            {
                marker_mymap  = L.marker([estaciones_json[i].lat, estaciones_json[i].long],{icon: greenIcon}).addTo(myFeatureGroup).bindPopup("Cargando...");;
                marker_mymap.idestacion = estaciones_json[i].id;
                marker_mymap.idarray = i;
            }
        }
    }

    $(document).on("click", ".modal_mapa", function()
    {
        //sacar la estacion en particular solo id
        var estacion = $(this).data().id;
        
        $(".forLoader").show();

        //ponemos los parametros en la ventana
        $("#fecha_detalle").html(convertDate(new Date()));
        $("#fecha_detalle_m").html(convertDate(new Date()));

        var objEstacion = buscarEstacion(estacion);
        
        $("#titulo_detalle").html(buscarCiudad(estacion))
        $("#estacion_detalle").html( objEstacion.city+" - "+objEstacion.nombre);
        $("#estacion_detalle_m").html("<b>"+objEstacion.city+" - "+objEstacion.nombre+"</b>");

        var idPollutant = "botonPM10";
        $("#textoTitulo").html($("#" + idPollutant).attr("data-original-title"));
        cambioBotonActivo(idPollutant);

        resetButtonDays();

        // Set station selected (because exist 2 different ways to get station)
        stationSelected = estacion;
        // Reset the hour selected to prevent pollutants with unexist hours
        hourSelected = "";

        //vamos a llenar los arreglos de todos los coantaminantes
        llenarConstaminantes(generaUrl("PM10", estacion, (24*28)),"PM10");
        llenarConstaminantes(generaUrl("PM2.5", estacion, (24*28)),"PM2.5");
        llenarConstaminantes(generaUrl("NO2", estacion, (24*28)),"NO2");
        llenarConstaminantes(generaUrl("SO2", estacion, (24*28)),"SO2");
        llenarConstaminantes(generaUrl("O3", estacion, (24*28)),"O3");
        llenarConstaminantes(generaUrl("CO", estacion, (24*28)),"CO");
        ponerTemperatura(generaUrl("TMP", estacion, (3)),"TMP");
    });


});

function groupClick(e)
{
  var popup = e.layer._popup;
  var estacion  = e.layer.idestacion;
  var idArray  = e.layer.idarray;

  var info = "<b>Estación:</b> "+estaciones_json[idArray].id+"<br><b>Nombre: </b>"+ estaciones_json[idArray].nombre +"<br><b>Código: </b>"+estaciones_json[idArray].codigo+'<br><div style="margin-bottom: 25px; margin-top: 25px;" class="botonera"><a class="modal_mapa" data-id="'+ estaciones_json[idArray].id +'">Detalle Estación</a></div>';

  popup.setContent(info);
  popup.update();
}