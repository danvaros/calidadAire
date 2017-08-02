$(document).ready(function(){
  // +++++++++++++++++++++++++++++++++ botonera inicial +++++++++++++++++++++++++
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
  // +++++++++++++++++++++++++++++++++ fin botonera inicial +++++++++++++++++++++++++

  //inicializacion de owlCarousel
  $(".owl-carousel").owlCarousel({
    loop:false,
    margin:10,
    nav:false,
    dots: false,
    navText : ["<",">"],
    responsive:{
        0:{
            items:2
        },
    }
  });

  var owl = $('.owl-carousel');
  owl.owlCarousel();

  // Custom Navigation Events
  $('.customNextBtn').click(function(){
    owl.trigger('next.owl.carousel');
  });
  $('.customPrevBtn').click(function(){
    owl.trigger('prev.owl.carousel', [300]);
  });

  //inicializacion selects
  $('select').material_select();
});
