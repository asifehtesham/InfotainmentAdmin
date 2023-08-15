$(document).ready(function () {
  var trigger = $('.hamburger'),
      overlay = $('.overlay'),
     isClosed = false;

    trigger.click(function () {
      hamburger_cross();      
    });

    function hamburger_cross() {

      if (isClosed == true) {          
        overlay.hide();
        trigger.removeClass('is-open');
        trigger.addClass('is-closed');
        isClosed = false;
      } else {   
        overlay.show();
        trigger.removeClass('is-closed');
        trigger.addClass('is-open');
        isClosed = true;
      }
  }
  
  $('[data-toggle="offcanvas"]').click(function () {
        $('#sidebar-main').toggleClass('toggled');
  });  
});

$(document).ready(function () {
  $('body').css('overflow-x','hidden');
  
        /////////////////////////////////////// Icon
        var owl = $('.icon-section');
        owl.owlCarousel({
          rtl: true,
          // items: 4,
          loop: true,
          dots: false,
          margin: 20,
          autoplay: true,
          autoplayTimeout: 6000,
          autoplayHoverPause: true,
          responsiveClass: true,
  
          responsive: {
            0: {
              items: 1,
              nav: false,
              dots: true,
            },
            600: {
              items: 1,
              nav: false
            },
            1000: {
              items: 4,
              dots: false,
              nav: true,
              loop: true
            }
          }
        });
        $('.play').on('click', function () {
          owl.trigger('play.owl.autoplay', [1000])
        })
        $('.stop').on('click', function () {
          owl.trigger('stop.owl.autoplay')
        })
        /////////////////////////////////////// death & Empolyee
        var owl = $('.death-section');
        owl.owlCarousel({
          rtl: true,
          items: 1,
          loop: true,
          margin: 20,
          autoplay: true,
          autoplayTimeout: 4000,
          autoplayHoverPause: true,
          responsiveClass: true,
          responsive: {
            0: {
              items: 1,
              nav: false,
              dots: true,
            },
            600: {
              items: 1,
              nav: false
            },
            1000: {
              items: 1,
              nav: false,
              dots: true,
              loop: true
            }
          }
        });
        $('.play').on('click', function () {
          owl.trigger('play.owl.autoplay', [1000])
        })
        $('.stop').on('click', function () {
          owl.trigger('stop.owl.autoplay')
        })
  
        /////////////////////////////////////// News system
        var owl = $('.new-system');
        owl.owlCarousel({
          rtl: true,
          items: 5,
          loop: true,
          margin: 30,
          autoplay: true,
          autoplayTimeout: 3000,
          autoplayHoverPause: true,
          responsiveClass: true,
          responsive: {
            0: {
              items: 1,
              nav: false,
              dots: true,
            },
            600: {
              items: 1,
              nav: false
            },
            1000: {
              items: 5,
              nav: false,
              dots: true,
              loop: true
            }
          }
        });
        $('.play').on('click', function () {
          owl.trigger('play.owl.autoplay', [1000])
        })
        $('.stop').on('click', function () {
          owl.trigger('stop.owl.autoplay')
        })
        /////////////////////////////////////// News Carsoual
        var owl = $('.news-section');
        owl.owlCarousel({
          rtl: true,
          items: 3,
          loop: true,
          margin: 20,
          autoplay: true,
          autoplayTimeout: 5000,
          autoplayHoverPause: true,
          responsiveClass: true,
          responsive: {
            0: {
              items: 1,
              nav: false,
              dots: true,
            },
            600: {
              items: 1,
              nav: false
            },
            1000: {
              items: 3,
              nav: false,
              dots: true,
              loop: true
            }
          }
        });
        $('.play').on('click', function () {
          owl.trigger('play.owl.autoplay', [1000])
        })
        $('.stop').on('click', function () {
          owl.trigger('stop.owl.autoplay')
        })
  
        /////////////////////////////////////// external Carsoual
        var owl = $('.external-platform');
        owl.owlCarousel({
          rtl: true,
          items: 4,
          loop: true,
          margin: 20,
          autoplay: true,
          autoplayTimeout: 2000,
          autoplayHoverPause: true,
          responsiveClass: true,
          responsive: {
            0: {
              items: 1,
              nav: false,
              dots: true,
            },
            600: {
              items: 1,
              nav: false
            },
            1000: {
              items: 4,
              nav: false,
              dots: true,
              loop: true
            }
          }
        });
        $('.play').on('click', function () {
          owl.trigger('play.owl.autoplay', [1000])
        })
        $('.stop').on('click', function () {
          owl.trigger('stop.owl.autoplay')
        })
  
        /////////////////////////////////////// Power & Empolyee
        var owl = $('.power-employee');
        owl.owlCarousel({
          rtl: true,
          items: 4,
          loop: true,
          margin: 20,
          autoplay: true,
          autoplayTimeout: 6000,
          autoplayHoverPause: true,
          responsiveClass: true,
          responsive: {
            0: {
              items: 1,
              nav: false,
              dots: true,
            },
            600: {
              items: 1,
              nav: false
            },
            1000: {
              items: 4,
              nav: false,
              dots: true,
              loop: true
            }
          }
        });
        $('.play').on('click', function () {
          owl.trigger('play.owl.autoplay', [1000])
        })
        $('.stop').on('click', function () {
          owl.trigger('stop.owl.autoplay')
        })
  
  
        // First filterable section
        $('.filter-btn').on('click', function () {
          $('.filter-btn').removeClass('active');
          $(this).addClass('active');
          const filter = $(this).data('filter');
          if (filter === 'all') {
            $('.item').show();
          } else {
            $('.item').hide();
            $(`.${filter}`).show();
          }
        });
  
        // Second filterable section
        $('.filter-btn2').on('click', function () {
          $('.filter-btn2').removeClass('active');
          $(this).addClass('active');
          const filter = $(this).data('filter2');
          if (filter === 'all') {
            $('.item2').show();
          } else {
            $('.item2').hide();
            $(`.${filter}`).show();
          }
        });
      });
