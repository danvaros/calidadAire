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

        $("#contaminante_detalle").html("PM10");
        $("#contaminante_grafica").html("PM10");

        var objEstacion = buscarEstacion(estacion);
        
        $("#titulo_detalle").html(buscarCiudad(estacion));
        
        $("#estacion_detalle").html( objEstacion.city+" - "+objEstacion.nombre);
        $("#estacion_detalle_m").html("<b>"+objEstacion.city+" - "+objEstacion.nombre+"</b>");

        $("#tituloTexto").html("PM10");
        $("#textoTitulo").html("Las partículas menores o iguales a 2.5 micras (PM2.5) están formadas primordialmente por gases y por material proveniente de la combustión. Se depositan fundamentalmente en la región traqueobronquial (tráquea hasta bronquiolo terminal), aunque pueden ingresar a los alvéolos.");

        //vamos a llenar los arreglos de todos los coantaminantes
        llenarConstaminantes(generaUrl("PM10", estacion, (24*28)),"PM10");
        llenarConstaminantes(generaUrl("PM2.5", estacion, (24*28)),"PM2.5");
        llenarConstaminantes(generaUrl("NO2", estacion, (24*28)),"NO2");
        llenarConstaminantes(generaUrl("SO2", estacion, (24*28)),"SO2");
        llenarConstaminantes(generaUrl("O3", estacion, (24*28)),"O3");
        llenarConstaminantes(generaUrl("CO", estacion, (24*28)),"CO");
    });


});

function groupClick(event)
{
  var popup = event.layer._popup;
  var estacion  = event.layer.idestacion;
  var array  = event.layer.idarray;

  var info = "<b>Estación:</b> "+estaciones_json[array].id+"<br><b>Nombre: </b>"+ estaciones_json[array].nombre +"<br><b>Codigo: </b>"+estaciones_json[array].codigo+'<br><div style="margin-bottom: 25px; margin-top: 25px;" class="botonera"><a class="modal_mapa" data-id="'+ estaciones_json[array].id +'">Detalle Estación</a></div>';

  popup.setContent(info);
  popup.update();
}