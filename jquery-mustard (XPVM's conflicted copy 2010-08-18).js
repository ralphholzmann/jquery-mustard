(function($, window, undefined) {

    var pluginName = 'mustard',
        opposites = {
            'left' : 'right',
            'right' : 'left',
            'top' : 'bottom',
            'bottom' : 'top'
        },
        themes = {
            'success': {
                'outer' : {
                    'background-color' : '#C6D880',
                },
                'inner' : {
                    'background-color' : '#E6EFC2',
                    'color' : '#264409'
                }
            },
            'notice': {
                'outer' : {
                    'background-color' : '#FFD324',
                },
                'inner' : {
                    'background-color' : '#FFF6BF',
                    'color' : '#514721'
                }
            },
            'error': {
                'outer' : {
                    'background-color' : '#FBC2C4',
                },
                'inner' : {
                    'background-color' : '#FBE3E4',
                    'color' : '#8a1f11'
                }
            }
        },
        tooltipTemplate = $('<div style="z-index: 1000; background: transparent; height: auto; position: absolute; top: -10000px; left: -10000px" class="' + pluginName + '-tooltip"><div style="left: auto; top: auto; bottom: auto; right: auto; position: absolute; background-color: transparent;" class="' + pluginName + '-arrow"><canvas style="position: absolute;"></canvas></div><div style="height: auto; left: auto; top: auto; bottom: auto; right: auto; position: relative; background-color: transparent;" class="' + pluginName + '-content"><div class="' + pluginName + '-wrap" style="height: auto"></div></div></div>'),
        defaults = {
            'css' : {
                'outer' : {
                    'font' : '12px/15px Helvetica, Arial, sans-serif',
                    'padding' : '4px',
                    'width' : '200px',
                    '-moz-border-radius' : '6px',
                    '-webkit-border-radius' : '6px',
                    '-webkit-background-clip' : 'padding',
                    'border-radius' : '6px'
                },
                'inner' : {
                    'font' : '12px/15px Helvetica, Arial, sans-serif',
                    'padding' : '4px',
                    '-moz-border-radius' : '3px',
                    '-webkit-border-radius' : '3px',
                    '-webkit-background-clip' : 'padding',
                    'border-radius' : '3px',
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
                'speed' : 0
            },
            'hide' : {
                'event' : 'mouseleave',
                'method' : 'fadeOut',
                'speed' : 200,
                'timeout' : 1000
            },
            'position' : {
                'my' : 'bottom',
                'at' : 'top'
            }
        },
        
        private = {

        },
        
        methods = {

            init : function( options ) {
                
                var settings = options ? $.extend(true, {}, defaults, options ) : defaults;
                return this.each(function(){

                    var $this = $(this),
                        tooltip,
                        elements,
                        hideTimeout,
                        outerCss,
                        innerCss;
                        
                        if ( options.css && options.css.theme ) {
                            outerCss = $.extend({}, defaults.css.outer, themes[(options.css.theme || 'notice')].outer )
                            innerCss = $.extend({}, defaults.css.inner, themes[(options.css.theme || 'notice')].inner )
                        } else {
                            outerCss = $.extend({}, defaults.css.outer, themes['notice'].outer )
                            innerCss = $.extend({}, defaults.css.inner, themes['notice'].inner )                        
                        }
                   
                        
                    // Get tooltip
                    if ( $this.data(pluginName) ) {
                        
                        // Grab tooltip
                        elements = $this.data(pluginName).elements;
                    }
                        
                        
                        
                        // Create tooltip
                        tooltip = tooltipTemplate.clone();
                        elements = {
                            tooltip : tooltip,
                            content : tooltip.find('.' + pluginName + '-content').css($.extend(outerCss, { 'width' : 'auto'})),
                            wrap : tooltip.find('.' + pluginName + '-wrap').css($.extend(innerCss, { 'width' : 'auto'})).html( settings.content || $this.attr('title') ),
                            arrow : tooltip.find('.' + pluginName + '-arrow').css(settings.arrow),
                            canvas : tooltip.find('canvas'),
                            target : $this
                        }
                        
                        // Remove title attribute
                        $this.removeAttr('title');
                        
                        // Add tooltip to body 
                        elements.tooltip.appendTo('body');
                    
                        
                        // Apply styles and draw arrow
                        // Draw arrow
                        var w = parseInt(settings.arrow.width),
                            h = parseInt(settings.arrow.height),
                            a = parseFloat(settings.angle),
                            t,
                            q = 0,
                            r = 0,
                            ctx = elements.canvas.attr('width', w).attr('height', h)[0].getContext("2d");
                        ctx.fillStyle = outerCss['background-color'];
                        
                        switch ( opposites[settings.position] ) {
                        
                            case 'left':
                                ctx.beginPath();
                                ctx.moveTo(0, h * a);
                                ctx.lineTo(w, h);
                                ctx.lineTo(w, 0);
                                ctx.fill();
                                t = (elements.tooltip.height() * a) - ( h * a )
                                
                                elements.tooltip.css('padding-left', w);
                                elements.arrow.css({
                                    left : 0,
                                    top : (elements.tooltip.height() * a) - ( h * a )
                                })
                                r = (elements.tooltip.height() * .5) - ( w * .5 ) - t;
                                break;
                            
                            case 'right':
                                ctx.beginPath();
                                ctx.moveTo(w, h * a);
                                ctx.lineTo(0, h);
                                ctx.lineTo(0, 0);
                                ctx.fill();
                                t = (elements.tooltip.height() * a) - ( h * a )
                                elements.tooltip.css('padding-right', w);
                                elements.arrow.css({
                                    right : 0,
                                    top : t
                                })
                                r = (elements.tooltip.height() * .5) - ( w * .5 ) - t;
                                break;

                            case 'top':
                                ctx.beginPath();
                                ctx.moveTo(w * a, 0);
                                ctx.lineTo(0, h);
                                ctx.lineTo(w, h);
                                ctx.fill();
                                t = (elements.tooltip.width() * a) - ( w * a );
                                elements.tooltip.css('padding-top', h);
                                elements.arrow.css({
                                    top: 0,
                                    left : t
                                })
                                 q = (elements.tooltip.width() * .5) - ( w * .5 ) - t;
                                break;

                            case 'bottom':
                                ctx.beginPath();
                                ctx.moveTo(w * a, h);
                                ctx.lineTo(0, 0);
                                ctx.lineTo(w, 0);
                                ctx.fill();
                                t = (elements.tooltip.width() * a) - ( w * a );
                                elements.tooltip.css('padding-bottom', h);
                                elements.arrow.css({
                                    bottom: 0,
                                    left : (elements.tooltip.width() * a) - ( w * a )
                                })
                                 q = ((elements.tooltip.width() * .5) - ( w * .5 )) - t
                                break;

                        }

                        if ( settings.show.event ) {

                            // Bind hide and show events
                            $this.add(tooltip).bind(settings.show.event + '.' + pluginName, function() {
        
                                // Stop from hiding tooltip
                                clearTimeout(hideTimeout);
        
                                setTimeout(function(){
                                    tooltip[settings.show.method](settings.show.speed);                        
                                }, settings.show.timeout );
                            
                            });                        
                        } else {
                            tooltip[settings.show.method](settings.show.speed);
                        }
                        
                        $this.add(tooltip).bind(settings.hide.event + '.' + pluginName, function(){
    
                            hideTimeout = setTimeout(function(){
                                tooltip[settings.hide.method](settings.hide.speed);                        
                            }, settings.hide.timeout );
                        
                        });
                        
                        var windowTimeout;
                        $(window).bind('resize', function(){
                            clearTimeout(windowTimeout);
                            setTimeout(function(){
                               // methods.updatePosition.call(tooltip);                            
                            }, 100);
                        });


                    

                    // Position tooltip
                    elements.tooltip.position({
                        'my' : opposites[settings.position],
                        'at' : settings.position,
                        'of' : $this,
                        'collision' : 'fit'
                    });


                    if ( settings.show.event ) {
                        elements.tooltip.hide();
                    }

                    // Test
                    var newLeft = parseInt(elements.tooltip.css('left')) + q;
                    var newTop = parseInt(elements.tooltip.css('top')) + r;
                    elements.tooltip.css({
                        left : newLeft,
                        top : newTop
                    });

                    // Save it to element
                    $this.data(pluginName, {
                        elements : elements,
                        settings : $.extend({}, settings)
                    });
                    
                    
                });
            },
            
            updatePosition : function() {
            
                return this.each(function(){
                    // Position tooltip
                    var data = $(this).data(pluginName);
                    data.elements.tooltip.position( $.extend( data.settings.position, {
                        of : data.elements.target
                    }));                
                });
            },
            
            // For overriding default settings
            setDefaults : function( options ) {
                $.extend( defaults, options );
                return this;
            }
        };

    $.fn[pluginName] = function( method ) {

        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.' + pluginName );
        }

    };

})(jQuery, window);