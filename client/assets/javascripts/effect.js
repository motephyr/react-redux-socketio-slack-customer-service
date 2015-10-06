$(document).ready(function() {

//  initialize bootstrap tooltip
  $('[data-toggle="tooltip"]').tooltip();


// 切換定價方式表單
  $('.show-pricing-method').click(function(){
    $('#pricing-method').slideDown();
  });
  $('.hide-pricing-method').click(function(){
    $('#pricing-method').slideUp();
  });


// 切換運送方式表單
  $('.show-shipping-indie').click(function(){
    $('#shipping-store').slideUp(function(){
        $('#shipping-indie').slideDown();
    });
  });

  $('#shipping-store').hide();
  $('.show-shipping-store').click(function(){
    $('#shipping-indie').slideUp(function(){
        $('#shipping-store').slideDown();
    });
  });

// 切煥發票處理方式

  $('#receipt-handling').hide();

  $('.show-receipt-handling').click(function(){
    $('#receipt-handling').slideDown();
  });

  $('.hide-receipt-handling').click(function(){
    $('#receipt-handling').slideUp();
  });


// 切換二聯三聯

  $('#three').hide();

  $('#receipt-format').change(function(){
    $('.receipt-format').hide();
    $('#' + $(this).val()).show();
  });

});