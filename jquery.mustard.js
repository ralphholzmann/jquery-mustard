(function($, window, pluginName, undefined) {
  var collection = [],
    activeElement,
    support = {
      canvas : !! document.createElement( 'canvas' ).getContext,
      rgba : (function(){
        try {
          $('<div />').css('background-color', 'rgba(1,2,3,.4)');
          return true;
        } catch ( e ) {
          return false;
        }
      })()
    },
    id = 0,
    opposites = {
      'left' : 'right',
      'right' : 'left',
      'top' : 'bottom',
      'bottom' : 'top'
    },
    themes = {
      'success': {
        'outer' : {
          'background-color' : support.rgba ? 'rgba(198, 216, 128, .8)' : '#C6D880'
        },
        'inner' : {
          'background-color' : '#E6EFC2',
          'color' : '#264409'
        }
      },
      'notice': {
        'outer' : {
          'background-color' : support.rgba ? 'rgba(255, 211, 36, .8)' : '#FFD324'
        },
        'inner' : {
          'background-color' : '#FFF6BF',
          'color' : '#514721'
        }
      },
      'error': {
        'outer' : {
          'background-color' : support.rgba ? 'rgba(251, 194, 196, .8)' : '#FBC2C4'
        },
        'inner' : {
          'background-color' : '#FBE3E4',
          'color' : '#8a1f11'
        }
      },
      'info': {
        'outer' : {
          'background-color' : support.rgba ? 'rgba(0, 82, 155, .8)' : '#00529B'
        },
        'inner' : {
          'background-color' : '#BDE5F8',
          'color' : '#00529B'
        }
      }
    },
    tooltipTemplate = $('<div style="z-index: 1000; background: transparent; width: auto; height: auto; position: absolute; top: -10000px; left: -10000px" class="' + pluginName + '-tooltip"><div style="left: auto; top: auto; bottom: auto; right: auto; position: absolute; background-color: transparent; z-index: 1001" class="' + pluginName + '-arrow"></div><div style="height: auto; left: auto; top: auto; bottom: auto; right: auto; position: relative; background-color: transparent;" class="' + pluginName + '-content"><div class="' + pluginName + '-wrap" style="height: auto"></div></div></div>'),
    defaults = {
      'css' : {
        'outer' : {
          'padding' : '4px',
          '-moz-border-radius' : '6px',
          '-webkit-border-radius' : '6px',
          '-webkit-background-clip' : 'padding',
          'border-radius' : '6px',
          '-webkit-box-shadow' : '0 0 6px #aaa',
          '-moz-box-shadow' : '0 0 6px #aaa'
        },
        'inner' : {
          'font' : '12px/15px "Helvetica Neue", sans-serif',
          'padding' : '4px',
          '-moz-border-radius' : '3px',
          '-webkit-border-radius' : '3px',
          '-webkit-background-clip' : 'padding',
          'border-radius' : '3px',
          'max-width' : '250px'
        }
      },
      'arrow' : {
        'width' : '9px',
        'height' : '9px'
      },
      'angle' : .5,
      'show' : {
        'event' : 'mouseenter',
        'method' : 'show',
        'speed' : 0,
        'timeout' : 50
      },
      'hide' : {
        'event' : 'mouseleave',
        'method' : 'fadeOut',
        'speed' : 200,
        'timeout' : 1000
      },
      'position' : 'top'
    },
    
    methods = {

      init : function( options ) {

        var settings = options ? $.extend(true, {}, defaults, options ) : defaults,
          $this = $(this),
          data = $this.data( pluginName ),
          windowTimeout, tooltip, elements, hideTimeout, outerCss, innerCss, wasHidden, display;
          
        
        if ( options && options.css && options.css.theme ) {
          outerCss = $.extend({}, defaults.css.outer, themes[options.css.theme].outer );
          innerCss = $.extend({}, defaults.css.inner, themes[options.css.theme].inner );
        } else {
          outerCss = $.extend({}, defaults.css.outer, themes['notice'].outer );
          innerCss = $.extend({}, defaults.css.inner, themes['notice'].inner );           
        }

        if ( options && options.css && options.css.outer ) {
          $.extend(outerCss, options.css.outer )
        }

        if ( options && options.css && options.css.inner ) {
          $.extend(innerCss, options.css.inner )
        }

        
        // Get tooltip
        if ( data ) {
          
          
          // Update content
          if ( settings.content ) {
            data.elements.wrap.html( settings.content );
          }
        

          methods.updatePosition.call( data.elements.target );
          
          // Grab tooltip
          methods.show.call($this);
          return;
        }

        // This tooltip is new so increment the id
        id++;
        
        // Create tooltip
        tooltip = tooltipTemplate.clone();


        // Collect references to each element of the tooltip
        elements = {
          tooltip : tooltip,
          content : tooltip.find('.' + pluginName + '-content').css($.extend(outerCss, { 'width' : 'auto'})),
          wrap : tooltip.find('.' + pluginName + '-wrap').css($.extend(innerCss, { 'width' : 'auto'})).html( settings.content || $this.attr('title') ),
          arrow : tooltip.find('.' + pluginName + '-arrow'),
          target : $this
        }
        
        // Create data object
        data = {
          elements : elements,
          settings : $.extend(true, {}, settings, outerCss, innerCss),
          id: id
        }

        // Remove title attribute
        $this.removeAttr('title');
        
        // Add tooltip to body 
        elements.tooltip.appendTo('body');
        
        // Create arrow
        var w = parseInt(settings.arrow.width, 10),
          h = parseInt(settings.arrow.height, 10),
          a = parseFloat(settings.angle);

        switch ( opposites[settings.position] ) {
          case 'left':
            elements.arrow.html(methods.createArrow( w, h, [[0, h * a], [w, h], [w, 0]], outerCss['background-color']))
              .css({
                width : w,
                height: h
              });
            break;
          
          case 'right':

            elements.arrow.html( methods.createArrow( w, h, [[w, h * a], [0, h], [0, 0]], outerCss['background-color']))
              .css({
                width : w,
                height: h
              });
            break;

          case 'top':

            elements.arrow.html( methods.createArrow( h, w, [[h * a, 0], [0, w], [h, w]], outerCss['background-color']))
              .css({
                width : h,
                height: w
              });
            break;

          case 'bottom':

            elements.arrow
              .html( methods.createArrow( h, w, [[h * a, w], [0, 0], [h, 0]], outerCss['background-color']))
              .css({
                width : h,
                height: w
              });
            break;
        }

        // Pad tooltip so it doesn't overlap the arrow
        elements.tooltip.css('padding-' + opposites[ settings.position ], w);
        
        // Position the arrow
        methods.positionArrow( data );

        if ( settings.show.event ) {
          // Bind hide and show events
          $this.add(tooltip).bind(settings.show.event + '.' + pluginName, function() {

            
            methods.updatePosition.call( elements.target )
            // Stop from hiding tooltip
            clearTimeout(hideTimeout);
            setTimeout(function(){
           
              tooltip.stop(true, true)[settings.show.method](settings.show.speed);
            }, settings.show.timeout );
          
          });              
        } else {
          tooltip[settings.show.method](settings.show.speed);
        }
        
        $this.add(tooltip).bind(settings.hide.event + '.' + pluginName, function(){
          
          hideTimeout = setTimeout(function(){
            tooltip.stop(true, true)[settings.hide.method](settings.hide.speed);               
          }, settings.hide.timeout );
        
        }).bind('mouseenter', function(){
          var elem;
          if ( activeElement !== elements.target ) {
            activeElement = elements.target;
            for ( var i = 0, count = collection.length - 1; i < count; i++) {
                collection[i] == elements.tooltip && (elem = collection.splice(i,1)[0]);
              collection[i].css('z-index', 1000 + i);               
            }
            elem.css('z-index', 1000 + collection.length + 10)
            collection.push(elem);
          }
        });
        
        $(window).bind('resize.' + pluginName + ' scroll.' + pluginName, function(){
          clearTimeout(windowTimeout);
          windowTimeout = setTimeout(function(){
            methods.updatePosition.call( data.elements.target );
          }, 200);
        });

        // Position tooltip
        elements.tooltip.position({
          'my'        : opposites[settings.position],
          'at'        : settings.position,
          'of'        : $this,
          'offset'    : settings.offset || 0,
          'collision' : 'none'
        });

        methods.lock( elements.tooltip );

        if ( settings.show.event ) {
          elements.tooltip.hide();
        }


        // Save it to element
        $this.addClass('mustardized');
        $this.data( pluginName, data);
        
        // Add it to local collection of all tooltips for z-indexing
        collection.push(elements.tooltip);
      },
      
      updateArrowColor : function( color ) {
        console.log('here!');
        var data    = $(this).data( pluginName ),
            canvas  = data.elements.arrow.find('canvas'),
            ctx;
                
        if ( canvas.length ) {
          ctx   = canvas[0].getContext('2d');
          ctx.fillStyle = color;
          ctx.fill();
        } else {
          data.elements.arrow.children().attr('fillcolor', color);
        }
            
      },
      
      createArrow : function( width, height, points, color ) {
      
        var elem, ctx, path, t;

      
        // If canvas is supported, use it
        if ( support.canvas ) {
          
          // Create element
          elem = $('<canvas />', {
            css : {
              position : 'absolute'
            }
          }).attr({
            width : width,
            height  : height
          });
          
          // Create draw and fill shape
          ctx = elem[0].getContext('2d');
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(points[0][0], points[0][1]);
          ctx.lineTo(points[1][0], points[1][1]);
          ctx.lineTo(points[2][0], points[2][1]);
          ctx.fill();

        // Otherwise fallback to vml
        } else {
          points = $.map(points, function( i ){
            return $.map(i, function( r ){
              return parseInt( r, 10 );
            });
          });

          path = 'm' + points[0] + ',' + points[1];
          path += ' l' + points[2] + ',' + points[3];
          path += ' ' + points[4] + ',' + points[5];
          path += ' xe';

          elem = '<v:shape height="' + height + '" width="' + width + '" fillcolor="' + color + '" stroked="false" filled="true" path="' + path + '" coordsize="' + width + ',' + height + '" ' +
              'style="width:' + width + 'px; height:' + height + 'px;line-height:0.1px; display:inline-block; behavior:url(#default#VML);position: absolute; "></v:shape>';
        }
      
        return elem;
      
      },
      hide : function( callback ) {
        var data = $(this).data( pluginName );
        data && data.elements.tooltip[ data.settings.hide.method ]( data.settings.hide.speed , ( callback || data.settings.hide.callback || $.noop ));

      },
      show : function( callback ) {
        var data = $(this).data( pluginName );
        data && data.elements.tooltip[ data.settings.show.method ]( data.settings.show.speed , ( callback || data.settings.show.callback || $.noop ));
        
      },
      destroy : function() {
        
        if ( data ) {
          // Unbind window resize
          $(window).unbind('.' + pluginName + data.id);
          
          // Unbind element listeners
          $(this).unbind('.' + pluginName).removeClass('mustardized');
          
          // Destroy tooltip
          data.elements.tooltip.remove();
                      
          $(this).removeData( pluginName );
        
        }

      },
      positionArrow : function( data ) {
        var angle = data.settings.angle,
          css =  /^(?:left|right)/.test(data.settings.position) ? {
            top : (data.elements.tooltip.height() * angle ) - ( parseInt( data.settings.arrow.height, 10 ) * angle )
          } : {
            left : (data.elements.tooltip.width() * angle ) - ( parseInt(data.settings.arrow.height, 10 ) * angle )
          }
        
        if ( ! support.canvas ) {
        
          css[opposites[data.settings.position]] = '1px';
        
        }
        
        data.elements.arrow.css(opposites[data.settings.position], 0).css(css);
      },
      lock : function( elem ) {
        elem.width( elem.width() + 1);
      },
      updatePosition : function() {
        var data = $(this).data( pluginName );
        if ( data ) {
          if (data.elements.target.is(':hidden')) {
            methods.hide.call(data.elements.target);
            return;
          }
          if (data.elements.tooltip.is(':visible')) {
            if ( ! data.elements.tooltip.is(':animated')) {

                data.elements.tooltip.css('width', 'auto');
                methods.lock( data.elements.tooltip );
                data.elements.tooltip.position({
                  'my' : opposites[data.settings.position],
                  'at' : data.settings.position,
                  'of' : data.elements.target,
                  'offset'    : data.settings.offset || 0,
                  'collision' : 'none',
                  'using' : function( css ) {
                  methods.positionArrow( data );
                    data.elements.tooltip.animate(css);
                }
              });
            }
          } else {
            data.elements.tooltip
              .css('visibility', 'hidden')
              .show()
              .css('width', 'auto');

            methods.lock( data.elements.tooltip );

            data.elements.tooltip
              .position({
                'my' : opposites[data.settings.position],
                'at' : data.settings.position,
                'of' : data.elements.target,
                'offset'    : data.settings.offset || 0,
                'collision' : 'none',
                'using' : function( css ) {
                  methods.positionArrow( data );
                  data.elements.tooltip.css(css).hide().css({
                    'visibility' : 'visible'                    
                  });
                }
              });
          }       
        }
      },
      
      // For overriding default settings
      setDefaults : function( options ) {
        $.extend( defaults, options );
        return this;
      }
    };

  $.fn[pluginName] = function( method ) {
    var args = arguments;
    return this.each(function(){
      var value
      , $this = $(this);
      
      if ( methods[method] ) {
        value = methods[method].apply( this, Array.prototype.slice.call( args, 1 ));
      } else if ( typeof method === 'object' || ! method ) {
        value = methods.init.apply( this, args );
      } else {
        $.error( 'Method ' +  method + ' does not exist on jQuery.' + pluginName );
      }
      
      return value;
    });
  };

})(jQuery, window, 'mustard');