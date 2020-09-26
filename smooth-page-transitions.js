/**
 * By: Stevanus Satria
 * Based on:
 *   https://webdesign.tutsplus.com/tutorials/how-to-integrate-smoothstatejs-into-a-wordpress-theme--cms-26610
 *   https://hirecollin.com/2016/05/integrating-smoothstate-wordpress/
 *   https://grayscale.com.hk/blog/adding-page-transitions-wordpress/
 *   As it's just CSS that's not loaded on changes for us, we just enqueue them in functions.php
 *   So far it's just the cool timeline css for its Gutenberg Builder
 *   Thankfully, there's no need for custom JS execution hooks yet via onAfter, but if needed:
 *   We can refer to these:
 *   https://github.com/miguel-perez/smoothState.js/issues/330
 *   https://stackoverflow.com/questions/50579265/background-css-property-not-applied-after-ajax-reload-with-smoothstate
 *   https://stackoverflow.com/questions/37822384/smoothstate-js-conflicting-with-other-plugins/38248466#38248466
 */

jQuery(document).ready(function ($) {
  // Preloader Parameter
  const fadeTime = 500;
  // timeout duration for inner loader (ms)
  const loaderTimeout = 1000;
  // timeout variable (to enable clearTimeout)
  var loaderTimer;

  hidePreloaderAndDisplayPage();
  displayGreeting();

  function hidePreloaderAndDisplayPage() {
    var preloader = $("#outer-loader");
    var page = $("#page");
    preloader.fadeOut(fadeTime);
    page.fadeIn(fadeTime);
  }

  function addBlacklistClass() {
    $("a").each(function () {
      if (
        this.href.indexOf("/wp-admin/") !== -1 ||
        this.href.indexOf("/stevahnes/") !== -1 ||
        this.href.indexOf("/wp-login.php") !== -1 ||
        this.href.indexOf("javascript:void(0)") !== -1
      ) {
        $(this).addClass("wp-link");
      }
    });
  }

  function displayGreeting() {
    const toDisplayGreeting =
      document.getElementById("logo-or-greeting-desktop") ||
      document.getElementById("logo-or-greeting-mobile");
    if (toDisplayGreeting) {
      const currentHour = new Date().getHours();
      let greeting = "";
      if (currentHour >= 4 && currentHour < 12) {
        greeting = "Good morning ⛅";
      } else if (currentHour >= 12 && currentHour < 17) {
        greeting = "Good afternoon ☀️";
      } else if (currentHour >= 17 || currentHour < 4) {
        greeting = "Good evening 🌙";
      }
      const container = document.createElement("div");
      const greetingTag = document.createElement("h2");
      greetingTag.appendChild(document.createTextNode(greeting));
      const welcomeTag = document.createElement("h1");
      welcomeTag.appendChild(document.createTextNode("Steve here 👋"));
      container.appendChild(greetingTag);
      container.appendChild(welcomeTag);
      if (document.getElementById("logo-or-greeting-desktop")) {
        const logoGreetingDesktop = document.getElementById(
          "logo-or-greeting-desktop"
        );
        if (logoGreetingDesktop.hasChildNodes()) {
          logoGreetingDesktop.removeChild(logoGreetingDesktop.childNodes[0]);
        }
        logoGreetingDesktop.appendChild(container.cloneNode(true));
      }
      if (document.getElementById("logo-or-greeting-mobile")) {
        const logoGreetingMobile = document.getElementById(
          "logo-or-greeting-mobile"
        );
        if (logoGreetingMobile.hasChildNodes()) {
          logoGreetingMobile.removeChild(logoGreetingMobile.childNodes[0]);
        }
        logoGreetingMobile.appendChild(container);
      }
    }
  }

  $(function () {
    addBlacklistClass();

    var settings = {
      anchors: "a",
      prefetch: true,
      scroll: true,
      cacheLength: 2,
      blacklist: ".wp-link",
      onStart: {
        duration: 280, // ms
        render: function ($container) {
          $container.addClass("slide-out");
        },
      },
      onProgress: {
        render: function ($container) {
          loaderTimer = setTimeout(function () {
            $("#content").fadeOut(100);
            $("#inner-loader").fadeIn(100);
          }, loaderTimeout);
        },
      },
      onAfter: function ($container, $newContent) {
        addBlacklistClass();
        if (Boolean(loaderTimer)) {
          clearTimeout(loaderTimer);
        }
        $("#content").fadeIn(100);
        $("#inner-loader").fadeOut(100);
        displayGreeting();
        $container.removeClass("slide-out");
        // handle hashes
        var $hash = $(window.location.hash);
        if ($hash.length !== 0) {
          var offsetTop = $hash.offset().top;
          $("body, html").animate(
            {
              scrollTop: offsetTop - 60,
            },
            {
              duration: 280,
            }
          );
        }
      },
    };

    $("#page").smoothState(settings);
  });
});
