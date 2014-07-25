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
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-53185327-1', 'auto');
  ga('require', 'displayfeatures');
  ga('send', 'pageview');
});
