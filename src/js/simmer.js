/*global Barba*/
/*global Rellax*/

'use strict';

function run() {

  var rellaxables = document.querySelectorAll('.rellax');
  if (rellaxables.length > 0) {
    var rellax = new Rellax('.rellax'); // jshint ignore:line
  }

  // var getUrl = window.location;
  // var getHomeUrl = getUrl.protocol + '//' + getUrl.host;
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
      var deferred = Barba.Utils.deferred();
      this.oldContainer.classList.add('fade-out');
      deferred.resolve();
      return deferred.promise;
    },

    fadeIn: function fadeIn() {
      // var _this = this;
      var el = this.newContainer;

      var body = document.querySelector('body');
      body.classList = newBodyClasses;

      this.oldContainer.classList.add('hide');

      el.classList.add('is-paused');
      el.classList.add('fade-in');
      setTimeout(function() {
        el.classList.remove('is-paused');
      }, 250);

      window.scrollTo(0,0);

      this.done();
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

  Barba.Dispatcher.on('transitionCompleted', function() {
    var rellaxables = document.querySelectorAll('.rellax');
    if (rellaxables.length > 0) {
      var rellax = new Rellax('.rellax'); // jshint ignore:line
    }
  });

}

// in case the document is already rendered
if (document.readyState !== 'loading') {
  run();
}
// modern browsers
else if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', run);
}
// IE <= 8
else {
  document.attachEvent('onreadystatechange', function () {
    if (document.readyState === 'complete') {
      run();
    }
  });
}
