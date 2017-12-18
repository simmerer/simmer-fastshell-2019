'use strict';

function run() {

  var getUrl = window.location;
  var getHomeUrl = getUrl.protocol + '//' + getUrl.host;
  var newBodyClasses = [];

  // •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
  // Barba.js
  // •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
  Barba.Pjax.Dom.wrapperId = 'bw';
  Barba.Pjax.Dom.containerClass = 'bc';

  Barba.Pjax.start();
  // Barba.Prefetch.init();

  var FadeTransition = Barba.BaseTransition.extend({
    start: function start() {
      Promise.all([this.newContainerLoading, this.fadeOut()]).then(this.fadeIn.bind(this));
    },

    fadeOut: function fadeOut() {
      // return $(this.oldContainer).animate({
      //   opacity: 0,
      // }, 1000).promise();
    },

    fadeIn: function fadeIn() {
      var _this = this;
      // let $el = $(this.newContainer);

      var body = document.querySelector('body');
      body.classList = newBodyClasses;

      // $(this.oldContainer).hide();

      // $el.css({
      //   visibility: 'visible',
      //   opacity: 0,
      // });

      // $el.animate({
      //   opacity: 1,
      // }, 1000, function() {
      //   _this.done();
      // });
    }
  });

  Barba.Pjax.getTransition = function () {
    return FadeTransition;
  };

  Barba.Dispatcher.on('newPageReady', function (currentStatus, prevStatus, HTMLElementContainer, newPageRawHTML) {
    var response = newPageRawHTML.replace(/(<\/?)body( .+?)?>/gi, '$1notBody$2>');
    var responseFrag = document.createRange().createContextualFragment(response);
    newBodyClasses = responseFrag.querySelector('notBody').classList;
  });
}

// in case the document is already rendered
if (document.readyState !== 'loading') {
  // run();
}
// modern browsers
else if (document.addEventListener) {
  // document.addEventListener('DOMContentLoaded', run);
}
// IE <= 8
else {
  document.attachEvent('onreadystatechange', function () {
    if (document.readyState === 'complete') {
      // run();
    }
  });
}
