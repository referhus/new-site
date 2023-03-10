(function (app) {
  "use strict";

  var Carousel = function () {};
  Carousel.isInitialLoad = true;
  Carousel.isAnimating = false;
  Carousel.gtl = new TimelineMax({ paused: true });
  Carousel.ftl = new TimelineMax({ paused: true });
  Carousel.mobileIndex = 0;
  Carousel.minHeight = 568;
  Carousel.maxHeight = 1000;
  var isScrollEnd = false;

  var sampleData = [
    {
      title: "Heading 1",
    },
    {
      title: "Heading 2",
    },
    {
      title: "Heading 3",
    },
    {
      title: "Heading 4",
    },
    {
      title: "Heading 5",
    },
    {
      title: "Heading 6",
    },
  ];

  var ratio = $(window).height() > 730 ? 0.4 : 0.26;
  var heightPercentage = $(window).height() * ratio;
  var isMob =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  if (isMob && $(window).width() <= 1366) {
    heightPercentage = 50;
  }
  if (/iPad/i.test(navigator.userAgent)) {
    var multiplier = 0.74;

    if ($(window).width() < 767) {
      multiplier = 0.8;
    }

    if ($(window).height() < 654) {
      multiplier = 0.85;
    }

    heightPercentage =
      $(window).innerHeight() - $(window).innerHeight() * multiplier;
  }

  var reducedScale = 0.35;
  var margin = {
    initial: 35,
    reduced: 0,
  };
  var spd = 0.5;
  var tDly = 0.02;

  var xPos = 100;

  Carousel.prototype.init = function (props) {
    var _self = this;
    var _utils = this.utils;

    _self.create(null, { data: rankings["2021"], isAnimated: true });
    _self.rankingSlideInit();
    _self.sliderPagination(rankings["2021"]);
    _self.touchBehaviour(rankings["2021"]);

    var isPlay =
      window.location.pathname.search("rankings.html") > 0 ? "play" : null;

    _self.thumbnailAnimation(isPlay);

    $(".switch").on("click", function () {
      var _this = $(this);

      if (!$("#toggle-thumbnail").prop("checked")) {
        Carousel.prototype.toggleView("thumbnail");

        Carousel.prototype.shouldRemoveSmoothScroll();

        $("#toggle-thumbnail").prop("checked", true);
        $(".cloned-item").css("width", "auto");
      } else {
        Carousel.prototype.toggleView("graph");

        $("#toggle-graph").prop("checked", true);
        $(".cloned-item").css("width", 0);

        if (_utils.isInMinHeight()) {
          $(".ranking-carousel").smoothTouchScroll("enable");
        }
      }

      // var _data = config.tracking["toggle"];
      // $.ecojs.tracking.send(
      //   _data.event,
      //   _data.category,
      //   _data.label,
      //   _data.value
      // );
    });

    $(".toggle-container .btn-year").on("click", function (e) {
      e.preventDefault();
      var _index = $(this).index();
      TweenMax.to(".toggle-container .year-switch", 0.5, {
        x: $(this).width() * _index,
        ease: Power3.easeOut,
      });
      $(this).addClass("active").siblings().removeClass("active");

      var year = ["2021", "2019", "2017", "2015"];

      _self.create(
        null,
        { data: rankings[year[_index]], isAnimated: true },
        true
      );
      _self.sliderPagination(rankings[year[_index]]);
      _self.touchBehaviour(rankings[year[_index]]);

      if ($("#toggle-graph").prop("checked")) {
        TweenMax.set($(".scrollableArea"), {
          width: _self.rankingSlideInit("update", "graph"),
        });
        // TweenMax.to($('.ranking-slide .item'), 0.5, { scale: 1, ease: Back.easeOut });
        _self.graphAnimationSwitch("test");
        // // Carousel.prototype.toggleView('graph')
        // $('.cloned-item').css('width', 0)
        // if (_utils.isInMinHeight()) {
        //     $('.ranking-carousel').smoothTouchScroll('enable')
        // }
      } else {
        app.Carousel.prototype.thumbnailAnimation("play-thumb");
      }
      // $('.ranking-slide').html('')
    });

    Carousel.prototype.shouldRemoveSmoothScroll();

    if (_utils.isInMinHeight()) {
      var _tooltip = $("#carousel-tooltip");
      var scaleVal =
        ($(window).height() - _tooltip.height()) / _tooltip.height() - 0.7;
      TweenMax.set(_tooltip, { x: 0, y: 0, scale: scaleVal });
    }

    var _gl = $(".graph-lines");

    var bottomGap =
      $(window).width() < 768 ? 55 : $(window).height() * 0.05 + 70;
    var _glHeight =
      $(window).height() -
      $(".ranking-wrap .section-top-heading").outerHeight() -
      (bottomGap + 20);
    TweenMax.set(_gl, { height: _glHeight });
  };

  Carousel.prototype.utils = {
    isMobile: function () {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    },
    isInMinHeight: function () {
      return $(window).height() <= Carousel.minHeight;
    },
    calculateCarouselWidth: function (toggle) {
      var item = $(".ranking-slide").find(".item");

      if (toggle === "graph") {
        return item.width() / 2;
      }
      console.log("here");
      return item.width() * item.length + $(window).width();
    },
  };

  Carousel.prototype.create = function (element, options, update) {
    var _self = this;
    var _utils = _self.utils;
    console.log(options);

    var el = element || "ranking-slide";
    var html = "";
    html += '<div class="' + el + '">';
    html += _self.item(options.data);
    html += "</div>";

    if (update) {
      $(".ranking-carousel .ranking-slide").replaceWith(html);
    } else {
      $(".ranking-carousel .carousel").replaceWith(html);
    }

    heightPercentage = Carousel.prototype.calculateHeightPercentage();

    if (!_self.utils.isInMinHeight()) {
      // $(".ranking-carousel .item").on("mouseover", function (e) {
      //   Carousel.prototype.tooltip($(this), options.data);
      //   var _data = config.tracking["flagshover"];
      //   $.ecojs.tracking.send(
      //     _data.event,
      //     _data.category,
      //     _data.label,
      //     _data.value
      //   );
      // });

      $(".ranking-carousel .item").on("mouseout", function (e) {
        Carousel.prototype.tooltipHide();
      });
    }

    $(".ranking-carousel .item").on("touchstart", function (evt) {
      if (_utils.isInMinHeight() && _utils.isMobile()) {
        var $target = $(evt.currentTarget);

        var index = $target.index();

        if (!$target.hasClass("item")) {
          index = $target.closest("item").index();
        }

        Carousel.mobileIndex = index;

        Carousel.prototype.mobileSlideItems(index);

        return;
      }

      Carousel.prototype.tooltip($(this), options.data);
      // var _data = config.tracking["flagshover"];
      // $.ecojs.tracking.send(
      //   _data.event,
      //   _data.category,
      //   _data.label,
      //   _data.value
      // );

      $(".touch-cover").css("display", "block");

      app.Navigation.isDisableSwipe = true;
    });

    $(".touch-cover").on("click", function () {
      Carousel.prototype.tooltipHide();

      $(".touch-cover").css("display", "none");

      app.Navigation.isDisableSwipe = false;
    });

    $(".touch-cover").on("touchstart", function () {
      Carousel.prototype.tooltipHide();

      $(".touch-cover").css("display", "none");

      app.Navigation.isDisableSwipe = false;
    });

    $(".ranking-carousel .item").on("click", function (evt) {
      if (_utils.isInMinHeight() && _utils.isMobile()) {
        var $target = $(evt.currentTarget);

        var index = $target.index();

        if (!$target.hasClass("item")) {
          index = $target.closest("item").index();
        }

        Carousel.mobileIndex = index;

        Carousel.prototype.mobileSlideItems(index, options.data);

        return;
      }

      Carousel.prototype.tooltip($(this), options.data);
      // var _data = config.tracking["flagshover"];
      // $.ecojs.tracking.send(
      //   _data.event,
      //   _data.category,
      //   _data.label,
      //   _data.value
      // );
    });
  };

  Carousel.prototype.calculateHeightPercentage = function () {
    var itemHeight = $(".item").height();

    if ($(window).height() <= Carousel.minHeight) {
      return itemHeight * 1.1;
    }

    return $(window).height() * 0.5 - itemHeight;
  };

  Carousel.prototype.item = function (data, options) {
    var html = "";
    const isJpVersion = $(".ranking-carousel--jp").length > 0;

    var graphHeight = $(".graph-lines").height();
    // if ($(window).width() <= 767) {
    var bottomGap =
      $(window).width() < 768 ? 55 : $(window).height() * 0.05 + 70;

    graphHeight =
      $(window).height() -
      $(".ranking-wrap .section-top-heading").outerHeight() -
      (bottomGap + 20);
    // }

    $.each(data, function (index, value) {
      var barHeight = graphHeight * (parseFloat(value.average) / 100);
      var country = value.country.replace(" ", "");
      html +=
        '<div id="city-' +
        index +
        '" class="item" data-position="' +
        index +
        '">';
      html += '	<div class="graph-content" style="height:' + barHeight + 'px;">';
      html += "		<h1>" + `${isJpVersion ? value.cityJp : value.city}` + "</h1>";
      html +=
        '		<div class="bar" average="' +
        value.average.toFixed(1) +
        '" value="' +
        barHeight +
        '" style="height:' +
        barHeight +
        'px;">';
      html += "			<span>" + value.average.toFixed(1) + "</span>";
      html += "		</div>";
      html += "	</div>";
      html += '	<div class="item-content">';
      html += '		<div class="img-wrap">';
      // if (country) {
      //   html += '			<img src="' + flags[country] + '" alt="' + country + '" />';
      // }
      html += "		</div>";
      html += '		<div class="item-desc">';
      html +=
        '<h1 class="">' +
        `${isJpVersion ? value.cityJp : value.city}` +
        "</h1>";
      html += '			<div class="item-count"><p>' + (index + 1) + "</p></div>";
      html +=
        '			<div class="item-average"><p>' +
        value.average.toFixed(1) +
        "</p></div>";
      html += "		</div>";
      html += "	</div>";
      html += "</div>";
    });
    return html;
  };

  Carousel.prototype.tooltip = function (element, data) {
    var offsetDistance = 20;

    var tt = $("#carousel-tooltip");
    var elem = element;

    var left =
      elem.offset().left + elem.innerWidth() / 2 - tt.width() / 2 + 3 + "px";
    var topPos = elem.offset().top - tt.innerHeight() + "px";

    Carousel.prototype.toolTipContent(
      data ? data[elem.index()] : rankings["2021"][elem.index()]
    );
    tt.css({
      top: topPos,
      left: left,
    });
    tt.show().addClass("is-active");
    TweenMax.to(tt, 0.3, { opacity: 1, y: 0, ease: Power1.easeOut });

    function px2em(size, value) {
      var x = value;
      var y = size;
      if (x) {
        return (x / y).toFixed(2) + "em";
      }
    }
  };

  Carousel.prototype.tooltipHide = function (el) {
    TweenMax.to($("#carousel-tooltip"), 0.3, {
      opacity: 0,
      y: -20,
      ease: Power1.easeOut,
      onComplete: function () {
        $("#carousel-tooltip").hide().removeClass("is-active");
      },
    });
  };

  Carousel.prototype.toolTipContent = function (data) {
    console.log(data);
    const isJpVersion = $(".tooltip-content--jp").length > 0;
    var ttCity = $(".tt-city"),
      ttAverage = $(".tt-average"),
      rateInfrastructure = $(".rate-infrastructure"),
      rateDigitalsecurity = $(".rate-digitalsecurity"),
      ratePersonal = $(".rate-personal"),
      rateHealth = $(".rate-health"),
      rateEnvironment = $(".rate-environment");

    isJpVersion ? ttCity.html(data.cityJp) : ttCity.html(data.city);
    ttAverage.html(data.average);

    rateInfrastructure.find("p span").html(data.infrastructure);
    rateDigitalsecurity.find("p span").html(data.digital);
    ratePersonal.find("p span").html(data.personal);
    rateHealth.find("p span").html(data.health);

    rateInfrastructure
      .find(".rate-bar")
      .css({ width: data.infrastructure + "%" });
    rateDigitalsecurity.find(".rate-bar").css({ width: data.digital + "%" });
    ratePersonal.find(".rate-bar").css({ width: data.personal + "%" });
    rateHealth.find(".rate-bar").css({ width: data.health + "%" });

    if ("environmental" in data) {
      rateEnvironment.show();
      rateEnvironment.find("p span").html(data.environmental);
      rateEnvironment
        .find(".rate-bar")
        .css({ width: data.environmental + "%" });
    } else {
      rateEnvironment.hide();
    }

    // TweenMax.to(rateInfrastructure.find('.rate-bar'), 1, { width: data.infrastructure + '%', ease: Power0.easeNone })
    // TweenMax.to(rateDigitalsecurity.find('.rate-bar'), 1, { width: data.digital + '%', ease: Power0.easeNone })
    // TweenMax.to(ratePersonal.find('.rate-bar'), 1, { width: data.personal + '%', ease: Power0.easeNone })
    // TweenMax.to(rateHealth.find('.rate-bar'), 1, { width: data.health + '%', ease:Power0.easeNone})
  };

  Carousel.prototype.rankingSlideInit = function (status, toggle) {
    var _self = this,
      container = $(".ranking-slide"),
      item = container.find(".item"),
      itemWidth =
        toggle === "graph" ? item.width() / 2 : item.width() * item.length;

    if (_self.utils.isInMinHeight() && toggle !== "graph") {
      itemWidth = (itemWidth + $(window).width()) * 2;
    }

    if (status === "update") {
      return itemWidth;
    }

    $(".ranking-carousel").smoothTouchScroll({
      continuousScrolling: false,
    });

    $(".ranking-carousel").find(".scrollableArea").width(itemWidth);
  };

  Carousel.prototype.touchBehaviour = function (data) {
    var el = document.getElementsByClassName("scrollWrapper")[0];

    swipedetect(el, function (swipedir) {});

    function swipedetect(el, callback) {
      var touchsurface = el,
        swipedir,
        startX,
        startY,
        dist,
        distX,
        distY,
        threshold = 30, // required min distance traveled to be considered swipe
        restraint = 50, // maximum distance allowed at the same time in perpendicular direction
        allowedTime = 300, // maximum time allowed to travel that distance
        elapsedTime,
        startTime;

      touchsurface.addEventListener(
        "touchstart",
        function (e) {
          var touchobj = e.changedTouches[0];
          swipedir = "none";
          dist = 0;
          startX = touchobj.pageX;
          startY = touchobj.pageY;
          startTime = new Date().getTime(); // record time when finger first makes contact with surface
          // ?? ?? ?? ?? ?? ?? ?? ?? e.preventDefault()
        },
        false
      );

      touchsurface.addEventListener(
        "touchmove",
        function (e) {
          // e.preventDefault() // prevent scrolling when inside DIV
        },
        false
      );

      touchsurface.addEventListener(
        "touchend",
        function (e) {
          var touchobj = e.changedTouches[0];
          distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
          distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
          elapsedTime = new Date().getTime() - startTime; // get time elapsed
          if (elapsedTime <= allowedTime) {
            // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
              // 2nd condition for horizontal swipe met
              swipedir = distX < 0 ? "left" : "right"; // if dist traveled is negative, it indicates left swipe
            } else if (
              Math.abs(distY) >= threshold &&
              Math.abs(distX) <= restraint
            ) {
              // 2nd condition for vertical swipe met
              swipedir = distY < 0 ? "up" : "down"; // if dist traveled is negative, it indicates up swipe
            }
          }

          Carousel.prototype.onScrollDirection(swipedir, data);
        },
        false
      );
    }
  };

  Carousel.prototype.onScrollDirection = function (direction, data) {
    var $items = $(".ranking-slide .item");

    var getIndex = function (dir) {
      var index = Carousel.mobileIndex;

      if (dir === "left" && index < $items.length - 1) {
        index += 1;
      }
      if (dir === "right" && index > 0) {
        index -= 1;
      }

      Carousel.mobileIndex = index;

      return index;
    };

    if (direction !== "none") {
      Carousel.prototype.mobileSlideItems(getIndex(direction), data);
    }
  };

  Carousel.prototype.isMobile = function () {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  Carousel.prototype.isIpad = function () {
    return /iPad/i.test(navigator.userAgent);
  };

  Carousel.prototype.mobileSlideItems = function (index, data) {
    var $items = $(".ranking-slide .item");
    console.log(index);
    TweenMax.to($(".scrollWrapper"), 0.3, {
      scrollTo: { x: $items.outerWidth() * index },
      onComplete: function () {
        Carousel.prototype.tooltip($($items.eq(index)), data);
        // var _data = config.tracking["flagsclick"];
        // $.ecojs.tracking.send(
        //   _data.event,
        //   _data.category,
        //   _data.label,
        //   _data.value
        // );
      },
    });
  };

  Carousel.prototype.sliderPagination = function (data) {
    var container = $(".scrollWrapper"),
      item = $(".ranking-slide .item"),
      pageIndex = 0,
      currentPage = 1,
      isScrolling = false,
      _utils = Carousel.prototype.utils;

    $(".scrollWrapper").scroll(function () {
      var $scrollLeft = $(".scrollWrapper").scrollLeft();
      var $width = $(".scrollWrapper").outerWidth();
      var $scrollWidth = $(".scrollWrapper").get(0).scrollWidth;

      if (parseInt($scrollWidth - $width) === parseInt($scrollLeft)) {
        isScrollEnd = true;
      } else {
        isScrollEnd = false;
      }
    });

    $(".slider-btn.btn-prev").on("click", function (e) {
      if (_utils.isInMinHeight()) {
        Carousel.prototype.onScrollDirection("right", data);
      } else {
        if (!isScrolling && pageIndex > 0) {
          isScrolling = true;
          pageIndex--;
          Carousel.prototype.paginateScroll(pageIndex, scrollTransition);
          // var _data = config.tracking["leftarrow"];
          // $.ecojs.tracking.send(
          //   _data.event,
          //   _data.category,
          //   _data.label,
          //   _data.value
          // );
          isScrollEnd = false;
        }
      }
    });

    $(".slider-btn.btn-next").on("click", function (e) {
      if (_utils.isInMinHeight()) {
        Carousel.prototype.onScrollDirection("left", data);
      } else {
        if (!isScrolling && !isScrollEnd) {
          isScrolling = true;
          pageIndex++;
          Carousel.prototype.paginateScroll(pageIndex, scrollTransition);
          // var _data = config.tracking["rightarrow"];
          // $.ecojs.tracking.send(
          //   _data.event,
          //   _data.category,
          //   _data.label,
          //   _data.value
          // );
        }
      }
    });

    function scrollTransition() {
      isScrolling = false;
    }

    container.on("scroll", function (evt) {
      var x = $(this).scrollLeft();

      Carousel.prototype.tooltipHide();
      $(".touch-cover").css("display", "none");

      if (
        $(this).hasClass("kinetic-moving-right") &&
        x >= Carousel.prototype.computePaginate(pageIndex)
      ) {
        pageIndex++;
      }

      if (
        $(this).hasClass("kinetic-moving-left") &&
        pageIndex > 1 &&
        x <= Carousel.prototype.computePaginate(pageIndex - 1)
      ) {
        pageIndex--;
      }
    });
  };

  Carousel.prototype.computePaginate = function (index) {
    var VW = $(window).width(),
      item = $(".ranking-slide .item"),
      IW = item.width(),
      VWI = VW / IW;

    return VWI * index * IW;
  };

  Carousel.prototype.paginateScroll = function (index, callback) {
    Carousel.prototype.tooltipHide();

    var pageSroll = Carousel.prototype.computePaginate(index);
    TweenMax.to($(".scrollWrapper"), 1, {
      scrollTo: { x: pageSroll },
      onComplete: function () {
        callback();
      },
    });
  };

  Carousel.prototype.thumbnailAnimation = function (status) {
    var container = $(".ranking-slide"),
      item = container.find(".item"),
      _utils = Carousel.prototype.utils;

    if (status === "show") {
      TweenMax.to(item, 0.5, {
        scale: 1,
        ease: Back.easeOut,
        onComplete: function () {
          Carousel.isInitialLoad = false;
          Carousel.prototype.toggleView("graph");
        },
      });
    } else {
      TweenMax.set(item, {
        opacity: 1,
        scale: 0,
        y: -heightPercentage,
        transformOrigin: "center",
      });
      if (status !== "play-thumb") {
        TweenMax.set($(".section-ranking .model-layer"), { scale: 0 });
      }

      if (_utils.isInMinHeight()) {
        var _tooltip = $(".tooltip-wrapper");
        TweenMax.set(_tooltip, { y: -15, opacity: 0 });
      }

      Carousel.prototype.thumbnailReset();
    }
    if (status === "play" || status === "play-thumb") {
      if (_utils.isInMinHeight()) {
        var _tooltip = $(".tooltip-wrapper");
        // TweenMax.to(_tooltip, 0.5, { delay:0.3, opacity: 1, y: 0, ease: Back.easeOut});

        TweenMax.set($(".ranking-wrap .animated-child"), { opacity: 1, y: 0 });
        TweenMax.set(_tooltip, { opacity: 1, y: 0 });
        TweenMax.set(item, { scale: 1, y: -heightPercentage });
      } else {
        TweenMax.staggerTo(
          item,
          0.5,
          { scale: 1, ease: Back.easeOut },
          0.05,
          function () {
            // TweenMax.to($('.switch'), 0.5, { opacity: 1 })
            // $('.switch')
            //     .css('pointerEvents', 'all')
          }
        );
      }

      if (status === "play") {
        TweenMax.to($(".section-ranking .model-layer"), 0.5, {
          scale: 1,
          ease: Expo.easeOut,
        });
      }
    }
  };
  Carousel.prototype.thumbnailReset = function () {
    var _utils = Carousel.prototype.utils;

    $(
      "ranking-slide, .ranking-slide .item,  .ranking-slide .item .img-wrap, .ranking-slide .item .item-desc, .ranking-slide .item .bar span, .graph-content, .graph-content h1"
    ).removeAttr("style");
    TweenMax.set($(".ranking-slide .item .bar"), { scaleY: 0 });
    TweenMax.set($(".graph-lines"), { scaleY: 0 });

    if (_utils.isInMinHeight()) {
      xPos = $(window).width() / 2 - $(".ranking-slide .item").outerWidth() / 2;
    } else {
      xPos = 0;
    }

    TweenMax.set($(".ranking-slide"), { x: xPos });

    TweenMax.set($(".earth-wrapper"), { y: 0 });
    TweenMax.set($(".ranking-desc-wrap"), { opacity: 1 });

    $(".ranking-wrap").removeClass("carew-graph");

    $("#toggle-thumbnail").prop("checked", true);
    $("#toggle-graph").prop("checked", false);
  };

  Carousel.prototype.graphAnimationSwitch = function (status) {
    var container = $(".ranking-slide"),
      item = container.find(".item"),
      itemContent = item.find(".item-content"),
      itemDesc = itemContent.find(".item-desc"),
      itemImg = item.find(".img-wrap"),
      itemGraph = item.find(".graph-content h1"),
      itemBar = item.find(".bar"),
      _utils = Carousel.prototype.utils;

    TweenMax.set(itemDesc, {
      opacity: 0,
    });

    TweenMax.set($(".ranking-desc-wrap"), { opacity: 0 });

    TweenMax.set(container, { x: 0 });
    TweenMax.set(item, {
      y: 0,
      paddingLeft: margin.reduced,
      paddingRight: margin.reduced,
    });

    TweenMax.staggerTo(
      item,
      spd,
      { delay: spd, scale: 1, ease: Expo.easeInOut },
      tDly
    );
    TweenMax.staggerTo(
      itemImg,
      spd,
      {
        delay: spd,
        scale: reducedScale,
        transformOrigin: "center",
        ease: Expo.easeInOut,
      },
      tDly
    );

    TweenMax.staggerTo(
      itemGraph,
      spd,
      { delay: 1.2, opacity: 1, ease: Expo.easeInOut },
      tDly
    );

    TweenMax.to(".graph-lines", spd, {
      delay: 1.2,
      scaleY: 1,
      ease: Expo.easeInOut,
    });

    TweenMax.staggerTo(
      itemBar,
      spd,
      {
        delay: 1.2,
        scaleY: 1,
        transformOrigin: "bottom center",
        ease: Expo.easeInOut,
      },
      tDly
    );

    // TweenMax.to($(".content__footer"), 1, { y: 200, ease: Expo.easeInOut });
    // $(".content__footer").data("hidden", true);

    TweenMax.staggerTo(
      itemBar.find("span"),
      spd,
      { delay: 1.2, opacity: 1, ease: Expo.easeInOut },
      tDly
    );

    if (_utils.isInMinHeight()) {
      xPos = $(window).width() / 2 - $(".ranking-slide .item").outerWidth() / 2;
    } else {
      xPos = 0;
    }

    $(".ranking-wrap").addClass("view-graph");
  };

  Carousel.prototype.graphAnimation = function (status) {
    var container = $(".ranking-slide"),
      item = container.find(".item"),
      itemContent = item.find(".item-content"),
      itemDesc = itemContent.find(".item-desc"),
      itemImg = item.find(".img-wrap"),
      itemGraph = item.find(".graph-content h1"),
      itemBar = item.find(".bar"),
      _utils = Carousel.prototype.utils;

    TweenMax.staggerTo(
      itemDesc,
      0.3,
      {
        opacity: 0,
        onComplete: function () {},
      },
      tDly
    );

    TweenMax.to($(".earth-wrapper"), 0.5, {
      y: $(".model-layer").height() / 2,
      delay: 0.5,
      ease: Expo.easeIn,
    });
    TweenMax.to($(".ranking-desc-wrap"), 0.5, {
      opacity: 0,
      delay: 0.5,
      ease: Expo.easeIn,
    });

    TweenMax.staggerTo(
      item,
      spd,
      {
        delay: spd,
        y: 0,
        paddingLeft: margin.reduced,
        paddingRight: margin.reduced,
        ease: Expo.easeInOut,
      },
      tDly
    );
    TweenMax.to(container, 0.3, {
      delay: spd + 0.1,
      x: 0,
      ease: Expo.easeInOut,
    });
    TweenMax.staggerTo(
      itemImg,
      spd,
      {
        delay: spd,
        scale: reducedScale,
        transformOrigin: "center",
        ease: Expo.easeInOut,
      },
      tDly
    );

    TweenMax.staggerTo(
      itemGraph,
      spd,
      { delay: 1.2, opacity: 1, ease: Expo.easeInOut },
      tDly
    );

    TweenMax.to(".graph-lines", spd, {
      delay: 1.2,
      scaleY: 1,
      ease: Expo.easeInOut,
    });

    TweenMax.staggerTo(
      itemBar,
      spd,
      {
        delay: 1.2,
        scaleY: 1,
        transformOrigin: "bottom center",
        ease: Expo.easeInOut,
      },
      tDly
    );

    // TweenMax.to($(".content__footer"), 1, { y: 200, ease: Expo.easeInOut });
    // $(".content__footer").data("hidden", true);

    TweenMax.staggerTo(
      itemBar.find("span"),
      spd,
      { delay: 1.2, opacity: 1, ease: Expo.easeInOut },
      tDly
    );

    if (_utils.isInMinHeight()) {
      xPos = $(window).width() / 2 - $(".ranking-slide .item").outerWidth() / 2;
    } else {
      xPos = 0;
    }

    $(".ranking-wrap").addClass("view-graph");
  };

  Carousel.prototype.graphToThumbnailAnimation = function (status) {
    var container = $(".ranking-slide"),
      item = container.find(".item"),
      itemContent = item.find(".item-content"),
      itemDesc = itemContent.find(".item-desc"),
      itemImg = item.find(".img-wrap"),
      itemGraph = item.find(".graph-content h1"),
      itemBar = item.find(".bar"),
      padd = $(window).width() < 768 ? 15 : 35,
      _utils = Carousel.prototype.utils;

    TweenMax.to(".graph-lines", 0.1, { scaleY: 0 });

    TweenMax.staggerTo(itemBar, 0.1, { scaleY: 0 }, 0);

    TweenMax.staggerTo(itemBar.find("span"), 0.1, { opacity: 0 }, 0);

    TweenMax.staggerTo(itemGraph, 0.1, { opacity: 0, ease: Expo.easeInOut }, 0);

    TweenMax.staggerTo(
      itemImg,
      0.5,
      { scale: 1, opacity: 1, transformOrigin: "center", ease: Expo.easeInOut },
      0.005
    );

    TweenMax.to(container, 0.3, { x: xPos, ease: Expo.easeInOut });

    TweenMax.staggerTo(
      item,
      0.5,
      {
        y: -heightPercentage,
        scale: 1,
        opacity: 1,
        paddingLeft: padd,
        paddingRight: padd,
        ease: Expo.easeInOut,
      },
      0.005
    );

    // TweenMax.to($(".content__footer"), 1, { y: 0, ease: Expo.easeInOut });

    // $(".content__footer").data("hidden", false);

    TweenMax.staggerTo(
      itemDesc,
      spd,
      {
        delay: 0.2,
        opacity: 1,
        onComplete: function () {
          if (_utils.isInMinHeight()) {
            Carousel.prototype.mobileSlideItems(Carousel.mobileIndex);
          }
        },
      },
      tDly
    );

    TweenMax.to($(".earth-wrapper"), 0.5, {
      y: 0,
      delay: 0.2,
      ease: Expo.easeOut,
    });
    TweenMax.to($(".ranking-desc-wrap"), 0.5, {
      opacity: 1,
      ease: Expo.easeOut,
    });

    $(".ranking-wrap").removeClass("view-graph");
  };

  Carousel.prototype.toggleView = function (view) {
    var _self = this;
    TweenMax.killTweensOf(".ranking-slide *");

    if (view === "thumbnail") {
      TweenMax.set($(".scrollableArea"), {
        width: _self.rankingSlideInit("update", view) * 2,
      });
      TweenMax.to($(".ranking-slide .item"), 0.5, {
        scale: 1,
        ease: Back.easeOut,
      });
      _self.graphToThumbnailAnimation();

      return;
    }

    if (view === "graph") {
      TweenMax.set($(".scrollableArea"), {
        width: _self.rankingSlideInit("update", view),
      });
      TweenMax.to($(".ranking-slide .item"), 0.5, {
        scale: 1,
        ease: Back.easeOut,
      });
      _self.graphAnimation();

      return;
    }
  };

  Carousel.prototype.shouldRemoveSmoothScroll = function () {
    var utils = Carousel.prototype.utils;

    if (utils.isInMinHeight()) {
      $(".ranking-carousel").smoothTouchScroll("disable");
      return;
    }

    $(".ranking-carousel").smoothTouchScroll("enable");
  };

  app.Carousel = Carousel;

  app.ready(function () {});

  app.onLoad(function () {
    // Carousel.prototype.init()
  });
})(window.app);
