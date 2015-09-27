(function (document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function () {
    // Hide/show drawer and main toolbar when showing/hiding docs
    document.body.addEventListener('st:show-docs', function () {
      var drawerPanel = document.querySelector('#drawer');
      drawerPanel.forceNarrow = false;
      var mainToolbar = document.querySelector('#main-toolbar');
      mainToolbar.className = 'slide-up';
    });

    document.body.addEventListener('st:hide-docs', function () {
      var drawerPanel = document.querySelector('#drawer');
      drawerPanel.forceNarrow = true;
      var mainToolbar = document.querySelector('#main-toolbar');
      mainToolbar.className = '';
    });

    document.body.addEventListener('st:try-show', function (stackframes) {
      var outputArea = document.querySelector('#try-get pre:last-of-type');
      console.log(stackframes);
      outputArea.value = stackframes.map(function (sf) {
        sf.toString();
      }).join('\n');
    });

    document.body.addEventListener('st:try-error', function (evt) {
      var error = evt.detail;
      var stringified = ErrorStackParser.parse(error).map(function (sf) {
        return sf.toString();
      }).join('\n');

      var outputArea = document.querySelector('#try-get pre:last-of-type');
      outputArea.value = 'Got an Error:' + error.message + '\n' +
        'stacktrace:\n' + stringified + '\n\n' +
        'If you think this shouldn\'t have happened, please file an issue at' +
        'http://git.io/stacktracejs';
    });

    document.querySelector('#try-get').addEventListener('click', function () {
      var textarea = document.querySelector('#try-get pre:first-of-type');
      try {
        eval(textarea.innerText);
      } catch (e) {
        var customEvent = new CustomEvent('st:try-error', {detail: e});
        document.body.dispatchEvent(customEvent);
      }
    });

    // Run syntax highlighter
    var codeElements = document.querySelectorAll('.lang-js');
    [].forEach.call(codeElements, function (el) {
      var event = new CustomEvent('syntax-highlight', {
        detail: {lang: 'js', code: el.textContent}
      });
      document.body.dispatchEvent(event);
      el.innerHTML = event.detail.code;
    });

    // Twitter Button code
    var fjs = document.getElementsByTagName('script')[0];
    if (!document.getElementById('twitter-wjs')) {
      var js = document.createElement('script');
      js.id = 'twitter-wjs';
      js.src = 'http://platform.twitter.com/widgets.js';
      fjs.parentNode.insertBefore(js, fjs);
    }
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function () {
  });

  // Close drawer after menu item is selected if drawerPanel is narrow
  app.onMenuSelect = function () {
    var drawerPanel = document.querySelector('#drawer');
    if (drawerPanel.narrow) {
      drawerPanel.closeDrawer();
    }
  };
})(document);
