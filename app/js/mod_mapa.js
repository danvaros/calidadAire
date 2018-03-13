var estaciones_global =  [];


$(document).ready(function()
{
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

    //recorremos las estaciones para pintarlas en el mapa
    for (var i = 0; i < estaciones_json.length; i++)
    {
        //v 2.0 validacion de la actividad de la estación
        if(estaciones_json[i].activa)
        {
            marker_mymap  = L.marker([estaciones_json[i].lat, estaciones_json[i].long],{icon: greenIcon}).addTo(myFeatureGroup).bindPopup("Cargando...");;
            marker_mymap.idestacion = estaciones_json[i].id;
            marker_mymap.idarray = i;
        }
    }

    $(document).on('click', '.modal_mapa', function()
    {
        //sacar la estacion en particular solo id
        var estacion = $(this).data().id;
        
        $('.forLoader').show();

        //ponemos los parametros en la ventana
        $('#fecha_detalle').html(convertDate(new Date()));
        $('#contaminante_detalle').html("PM10");
        $('#contaminante_grafica').html("PM10");

        var objEstacion = buscarEstacion(estacion);

        $('#titulo_detalle').html(buscarCiudad(estacion));
        $('#estacion_detalle').html(objEstacion.nombre);
        $('#tituloTexto').html("PM10");
        $('#textoTitulo').html("Las partículas menores o iguales a 2.5 micras (PM2.5) están formadas primordialmente por gases y por material proveniente de la combustión. Se depositan fundamentalmente en la región traqueobronquial (tráquea hasta bronquiolo terminal), aunque pueden ingresar a los alvéolos.");

        //vamos a llenar los arreglos de todos los coantaminantes
        llenarConstaminantes(generaUrl('PM10', estacion, (24*28)),'PM10');
        llenarConstaminantes(generaUrl('PM2.5', estacion, (24*28)),'PM2.5');
        llenarConstaminantes(generaUrl('NO2', estacion, (24*28)),'NO2');
        llenarConstaminantes(generaUrl('SO2', estacion, (24*28)),'SO2');
        llenarConstaminantes(generaUrl('O3', estacion, (24*28)),'O3');
        llenarConstaminantes(generaUrl('CO', estacion, (24*28)),'CO');
    });


});

function groupClick(event)
{
  var popup = event.layer._popup;
  var estacion  = event.layer.idestacion;
  var array  = event.layer.idarray;

  var info = '<b>Estación:</b> '+estaciones_json[array].id+'<br><b>Nombre: </b>'+ estaciones_json[array].nombre +'<br><b>Codigo: </b>'+estaciones_json[array].codigo+'<br><div style="margin-bottom: 25px; margin-top: 25px;" class="botonera"><a class="modal_mapa" data-id="'+ estaciones_json[array].id +'">Detalle Estación</a></div>';

  popup.setContent(info);
  popup.update();
}

function get_estaciones()
{
    var datedate = anio+"-"+mes+"-"+dia;

    $.ajax({
        type: 'GET',
        url: "https://api.datos.gob.mx/v1/sinaica?fecha="+datedate+"&pageSize=12000",
        data: {},
        success: function( data, textStatus, jqxhr )
        {
            var estations = [];

            for (var i = 0; i < data.results.length; i++) {
                estations.push(data.results[i]);
            }
            //estaciones.push(data.results.parametro);

            estaciones_global = estations;
        },
        xhrFields:
        {
            withCredentials: false
        },
        crossDomain: true,
        async:false
    });
}


/*********************** codigo usado para crear el json de estaciones con estados y ciudades */


  // console.log(estaciones_json);
    // for (let index = 0; index < estaciones_json.length; index++) {
    //     temporal(estaciones_json[index].id,index);
    // }
    // console.log(estaciones_json);

    // function temporal(id_estacion,index){

    //     var url =  'https://api.datos.gob.mx/v1/sinaica?estacionesid='+id_estacion+'&pageSize=1';

    //     $.ajax({
    //         type: 'GET',
    //         url: url,
    //         data: {},
    //         success: function( data, textStatus, jqxhr )
    //         {
    //             if (data.results.length > 0)
    //             {
    //                 estaciones_json[index].state =  data.results[0].state;
    //                 estaciones_json[index].city =  data.results[0].city; estaciones_json[index].activa =  true;
    //             }
    //             else
    //             {
    //                 estaciones_json[index].state =  '';
    //                 estaciones_json[index].city =  '';
    //                 estaciones_json[index].activa =  false;
    //             }


    //           //  console.log(estaciones_json[index]);
    //         },
    //         xhrFields:
    //         {
    //             withCredentials: false
    //         },
    //         crossDomain: true,
    //         async:false
    //     });
    // }
