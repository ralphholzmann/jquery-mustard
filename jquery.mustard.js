(function($, window, pluginName, undefined) {




	var collection = [],
		activeElement,
		data,
		rgba = (function(){
			try {
				$('<div />').css('background-color', 'rgba(1,2,3,.4)');
				return true;
			} catch ( e ) {
				return false;
			}
		})(),
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
					'background-color' : rgba ? 'rgba(198, 216, 128, .8)' : '#C6D880'
				},
				'inner' : {
					'background-color' : '#E6EFC2',
					'color' : '#264409'
				}
			},
			'notice': {
				'outer' : {
					'background-color' : rgba ? 'rgba(255, 211, 36, .8)' : '#FFD324'
				},
				'inner' : {
					'background-color' : '#FFF6BF',
					'color' : '#514721'
				}
			},
			'error': {
				'outer' : {
					'background-color' : rgba ? 'rgba(251, 194, 196, .8)' : '#FBC2C4'
				},
				'inner' : {
					'background-color' : '#FBE3E4',
					'color' : '#8a1f11'
				}
			},
			'info': {
				'outer' : {
					'background-color' : rgba ? 'rgba(0, 82, 155, .8)' : '#00529B'
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
					'font' : '12px/15px Helvetica, Arial, sans-serif',
					'padding' : '4px',
					'-moz-border-radius' : '6px',
					'-webkit-border-radius' : '6px',
					'-webkit-background-clip' : 'padding',
					'border-radius' : '6px',
					'-webkit-box-shadow' : '0 0 6px #aaa',
					'-moz-box-shadow' : '0 0 6px #aaa'
				},
				'inner' : {
					'font' : '12px/15px Helvetica, Arial, sans-serif',
					'padding' : '4px',
					'-moz-border-radius' : '3px',
					'-webkit-border-radius' : '3px',
					'-webkit-background-clip' : 'padding',
					'border-radius' : '3px',
					'max-width' : '200px'
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
					tooltip,
					elements,
					hideTimeout,
					outerCss,
					innerCss;
					
					if ( options && options.css && options.css.theme ) {
						outerCss = $.extend({}, defaults.css.outer, themes[options.css.theme].outer )
						innerCss = $.extend({}, defaults.css.inner, themes[options.css.theme].inner )
					} else {
						outerCss = $.extend({}, defaults.css.outer, themes['notice'].outer )
						innerCss = $.extend({}, defaults.css.inner, themes['notice'].inner )						
					}

					if ( options && options.css && options.css.outer ) {
						$.extend(outerCss, options.css.outer )
					}

					if ( options && options.css && options.css.inner ) {
						$.extend(innerCss, options.css.inner )
					}

					
					// Get tooltip
					if ( data ) {
						
						settings.content && data.elements.wrap.html( settings.content ) && methods.updatePosition.call( data.tooltip );
						
						// Grab tooltip
						methods.show.call($this);
						return;
					}

					id++;
					
					// Create tooltip
					tooltip = tooltipTemplate.clone();
					elements = {
						tooltip : tooltip,
						content : tooltip.find('.' + pluginName + '-content').css($.extend(outerCss, { 'width' : 'auto'})),
						wrap : tooltip.find('.' + pluginName + '-wrap').css($.extend(innerCss, { 'width' : 'auto'})).html( settings.content || $this.attr('title') ),
						arrow : tooltip.find('.' + pluginName + '-arrow').css(settings.arrow),
						target : $this
					}




					data = {
						elements : elements,
						settings : $.extend(true, {}, settings, outerCss, innerCss),
						id: id
					}

					// Remove title attribute
					$this.removeAttr('title');
					
					// Add tooltip to body 
					elements.tooltip.appendTo('body');
					// Apply styles and draw arrow
					// Draw arrow
					var w = parseInt(settings.arrow.width, 10),
						h = parseInt(settings.arrow.height, 10),
						a = parseFloat(settings.angle),
						t,
						q = 0,
						r = 0;




					
					if ( ! $.browser.msie ) {
						// Use canvas
						elements.arrow.html('<canvas style="position: absolute;"></canvas>');
						elements.canvas = elements.arrow.children();
						var ctx = elements.canvas.attr('width', w).attr('height', h)[0].getContext("2d");
						ctx.fillStyle = outerCss['background-color'];
					} else {
						var color = outerCss['background-color'],
							coordsize = w + ',' + h
							
					}
					
					
					
					switch ( opposites[settings.position] ) {
					
						case 'left':
							if ( $.browser.msie ) {
								var path = 'm' + 0 + ',' + Math.floor( h * a );
								path += ' l' + w + ',' + h;
								path += ' ' + w + ',' + 0;
								path += ' xe';
								
								var vml = '<v:shape fillcolor="'+color+'" stroked="false" filled="true" path="'+path+'" coordsize="'+coordsize+'" ' +
								'style="width:'+w+'px; height:'+h+'px; ' +
								'line-height:0.1px; display:inline-block; behavior:url(#default#VML); position: absolute; right: 0;' +
								'"></v:shape>'
								
								elements.arrow.html(vml)

							} else {
								ctx.beginPath();
								ctx.moveTo(0, h * a);
								ctx.lineTo(w, h);
								ctx.lineTo(w, 0);
								ctx.fill();
							}

							
							t = (elements.tooltip.height() * a) - ( h * a )
							
							elements.tooltip.css('padding-left', w);
							elements.arrow.css({
								left : 0,
								top : (elements.tooltip.height() * a) - ( h * a )
							})
							r = (elements.tooltip.height() * .5) - ( w * .5 ) - t;
							break;
						
						case 'right':
							if ( $.browser.msie ) {
								var path = 'm' + w + ',' + Math.floor( h * a );
								path += ' l' + 0 + ',' + h;
								path += ' ' + 0 + ',' + 0;
								path += ' xe';
								
								var vml = '<v:shape fillcolor="'+color+'" stroked="false" filled="true" path="'+path+'" coordsize="'+coordsize+'" ' +
								'style="width:'+w+'px; height:'+h+'px; ' +
								'line-height:0.1px; display:inline-block; behavior:url(#default#VML);position: absolute; left: -1px;' +
								'"></v:shape>'
								
								elements.arrow.html(vml)

							} else {
								ctx.beginPath();
								ctx.moveTo(w, h * a);
								ctx.lineTo(0, h);
								ctx.lineTo(0, 0);
								ctx.fill();
							}
							t = (elements.tooltip.height() * a) - ( h * a )
							elements.tooltip.css('padding-right', w);
							elements.arrow.css({
								right : 0,
								top : t
							})
							r = (elements.tooltip.height() * .5) - ( w * .5 ) - t;
							break;

						case 'top':
							if ( $.browser.msie ) {
								var path = 'm' + Math.floor( w * a ) + ',' + 0;
								path += ' l' + 0 + ',' + h;
								path += ' ' + w + ',' + h;
								path += ' xe';
								
								var vml = '<v:shape fillcolor="'+color+'" stroked="false" filled="true" path="'+path+'" coordsize="'+coordsize+'" ' +
								'style="width:'+w+'px; height:'+h+'px; ' +
								'line-height:0.1px; display:inline-block; behavior:url(#default#VML);position: absolute; bottom: 0' +
								'"></v:shape>'
								
								elements.arrow.html(vml)

							} else {
								ctx.beginPath();
								ctx.moveTo(w * a, 0);
								ctx.lineTo(0, h);
								ctx.lineTo(w, h);
								ctx.fill();
							}
							t = (elements.tooltip.width() * a) - ( w * a );
							elements.tooltip.css('padding-top', h);
							elements.arrow.css({
								top: 0,
								left : t
							})
							 q = (elements.tooltip.width() * .5) - ( w * .5 ) - t;
							break;

						case 'bottom':
							if ( $.browser.msie ) {
								var path = 'm' + Math.floor( w * a ) + ',' + h;
								path += ' l' + 0 + ',' + 0;
								path += ' ' + w + ',' + 0;
								path += ' xe';
								
								var vml = '<v:shape fillcolor="'+color+'" stroked="false" filled="true" path="'+path+'" coordsize="'+coordsize+'" ' +
								'style="width:'+w+'px; height:'+h+'px; ' +
								'line-height:0.1px; display:inline-block; behavior:url(#default#VML);position: absolute; top: -1px;' +
								'"></v:shape>'
								
								elements.arrow.html(vml)

							} else {
								ctx.beginPath();
								ctx.moveTo(w * a, h);
								ctx.lineTo(0, 0);
								ctx.lineTo(w, 0);
								ctx.fill();
							}
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
	
							
							methods.updatePosition.call( tooltip )
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
					
					var windowTimeout;
					$(window).bind('resize.' + pluginName + id + ' scroll.' + pluginName + id, function(){
						clearTimeout(windowTimeout);
						setTimeout(function(){
						   methods.updatePosition.call(elements.tooltip);							
						}, 500);
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
				var newLeft = parseInt(elements.tooltip.css('left'), 10) + q;
				var newTop = parseInt(elements.tooltip.css('top'), 10) + r;
				elements.tooltip.css({
					left : newLeft,
					top : newTop
				});




				// Save it to element
				$this.addClass('mustardized');
				
				collection.push(elements.tooltip);
			},
			hide : function( callback ) {
				
				data && data.elements.tooltip[ data.settings.hide.method ]( data.settings.hide.speed , ( callback || data.settings.hide.callback || $.noop ));





			},
			show : function( callback ) {
				
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
				var angle = data.settings.angle;
				switch ( data.settings.position ) {
				
					case 'left':
					case 'right':
						data.elements.arrow.css({
							top : (data.elements.tooltip.height() * angle ) - ( parseInt( data.settings.arrow.height, 10 ) * angle )
						});
						break;

					case 'top':
					case 'bottom':
						data.elements.arrow.css({
							left : (data.elements.tooltip.width() * angle ) - ( parseInt(data.settings.arrow.width, 10 ) * angle )
						});
						break;
				}
			
			},
			updatePosition : function() {
			
				if ( data ) {
					if (data.elements.target.is(':hidden')) {
						methods.hide.call(data.elements.target);
						return;
					}
					if (data.elements.tooltip.is(':visible')) {
						if ( ! data.elements.tooltip.is(':animated')) {
							  data.elements.tooltip.position({
								  'my' : opposites[data.settings.position],
								  'at' : data.settings.position,
								  'of' : data.elements.target,
								  'collision' : 'fit',
								  'using' : function( css ) {
								 	methods.positionArrow( data );
								  	data.elements.tooltip.animate(css);
							 	}
						 	});
						}
					} else {
						 data.elements.tooltip.css({
							'visibility' : 'hidden'
						}).show().position({
							 'my' : opposites[data.settings.position],
							 'at' : data.settings.position,
							 'of' : data.elements.target,
							 'collision' : 'fit',
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
			,	$this = $(this);
			
			data = $this.data( pluginName );

			if ( methods[method] ) {
				value = methods[method].apply( this, Array.prototype.slice.call( args, 1 ));
			} else if ( typeof method === 'object' || ! method ) {
				value = methods.init.apply( this, args );
			} else {
				$.error( 'Method ' +  method + ' does not exist on jQuery.' + pluginName );
			}
			
			$this.data( pluginName, data );

			return value;
		});
	};

})(jQuery, window, 'mustard');