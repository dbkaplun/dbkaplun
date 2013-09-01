require.config({
  baseUrl: '../bower_components',
  paths: {
    jquery: ['https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min', 'jquery/jquery'],
    bootstrap: 'bootstrap/js'
  },
  shim: {
    'bootstrap/tooltip': {
      deps: ['jquery'],
      exports: 'jQuery.fn.tooltip'
    }
  }
});

require(['jquery', 'bootstrap/tooltip'], function ($) {
  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
    $('#print-button').click(function (evt) {
      $('#me').removeClass('animated');
      window.print();
    });
  });

  // Google Analytics
  var _gaq = _gaq || [['_setAccount', 'UA-32733609-1'], ['_trackPageview']];

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
});
