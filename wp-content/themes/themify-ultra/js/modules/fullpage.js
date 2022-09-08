/* fullpage */
;
(function ( Themify, document, window, themifyScript) {
	'use strict';
	let scrolling = false,
		wrapper,
		duration = 0,
		pagesCount = 0,
		currentIndex = 0,
		initOnce = false,
		isHorizontal = false,
		has_footer=false,
		isDisabled=false;
	const _is_retina = window.devicePixelRatio > 1,
		snakeScroll = !Themify.body[0].classList.contains( 'full-section-scrolling-single' ),
		_CLICK_ = !Themify.isTouch ? 'click' : (window.PointerEvent ? 'pointerdown' : 'touchstart'),
			_ISPARALLAX_ = themifyScript['fullpage_parallax'] !== undefined,
			_MOBILE_BREAKPOINT_ = themifyScript['f_s_d'] ? parseInt(themifyScript['f_s_d']) : null,
			run = function () {
				window.scroll(0, 0);
				scrolling=false;
				currentIndex=0;
				if(!duration){
					duration = parseFloat(window.getComputedStyle(wrapper).transitionDuration);
					if (duration < 1) {
						duration *= 1000;
					}
				}
				_create();
				_verticalNavigation();
				if (initOnce === false) {
					main();
				}
				document.addEventListener('keydown', _keydown, {passive: true});
				document.addEventListener('wheel', _wheel, {passive: true});
				if (Themify.isTouch) {
					wrapper.addEventListener((window.PointerEvent ? 'pointerdown' : 'touchstart'), _touchstart, {passive: true});
				}
			},
			_disable=function(){
				isDisabled=true;
				document.removeEventListener('keydown', _keydown, {passive: true});
				document.removeEventListener('wheel', _wheel, {passive: true});
				wrapper.removeEventListener((window.PointerEvent ? 'pointerdown' : 'touchstart'), _touchstart, {passive: true});
				const mainNav=document.getElementById('fp-nav'),
					childs=wrapper.children;
				if(mainNav){
					mainNav.remove();
				}
				wrapper.style['transform']='';
				if(has_footer===true){
					const footer = document.getElementById('footerwrap');
					if(footer){
						const r_footer = footer.parentNode.parentNode;
						Themify.body[0].appendChild(footer);
						r_footer.remove();
					}
				}
				for(let i=childs.length-1;i>-1;--i){
					let item=childs[i];
					if(item.classList.contains('fp-section-container-horizontal')){
						let rows=item.getElementsByClassName('fp-section-container-inner')[0].children,
							fr=document.createDocumentFragment();
							for(let j=rows.length-1;j>-1;--j){
								let r=rows[j].getElementsByClassName('module_row')[0],
								inner=r.getElementsByClassName('row_inner')[0];
								if(_ISPARALLAX_){
									r.style['transform']=r.style['transition']='';
								}
								if(inner){
									inner.classList.remove('tf_scrollbar');
								}
								fr.appendChild(r);
							}
							item.after(fr);
							item.remove();
					}
					else{
						let r=item.getElementsByClassName('module_row')[0],
							inner=r.getElementsByClassName('row_inner')[0];
						
						if(_ISPARALLAX_){
							r.style['transform']=r.style['transition']='';
						}
						if(inner){
							inner.classList.remove('tf_scrollbar');
						}
						item.after(r);
						item.remove();
					}
				}
				Themify.lazyDisable = null;
				Themify.lazyLoading();
				if (typeof tbLocalScript !== 'undefined' && tbLocalScript['scrollHighlight']) {
					delete tbLocalScript['scrollHighlight']['scroll'];
					if (typeof ThemifyBuilderModuleJs !== 'undefined') {
						ThemifyBuilderModuleJs.InitScrollHighlight();
					}
				} else {
					Themify.trigger('tb_scroll_highlight_enable');
				}
				Themify.body[0].classList.remove('full-section-scrolling','fullpage-footer');
			},
			_create = function () {
				if(has_footer===true){
					const footer = document.getElementById('footerwrap');
					if(footer && !footer.parentNode.classList.contains('module_row')){
						footer.classList.add('module_row','fullheight');
						const r_footer = document.createElement('div');
						r_footer.className = 'module_row fullheight';
						r_footer.appendChild(footer);
						wrapper.appendChild(r_footer);
					}
				}
				const childs = wrapper.children,
						lazyItems = [];
				
				for (let i = childs.length - 1; i > -1; --i) {

					if (childs[i]) {
						let el = childs[i],
								cl = el.classList;
						if (!cl.contains('fp-section-container')) {

							if (cl.contains('module_row_slide')) {
								let container = document.createElement('div'),
										elWrap = document.createElement('div'),
										inner = document.createElement('div');
								while (true) {
									let prev = el.previousElementSibling;
									if (prev !== null) {
										let br = prev.classList.contains('module_row_section');
										if (prev.classList.contains('module_row_slide') || br) {
											let wrap = document.createElement('div');
											wrap.className = 'fp-section-container tf_w tf_overflow';
											if (_ISPARALLAX_ === true) {
												prev.style['transform'] = 'translateX(-62%)';
											}
											prev.getElementsByClassName('row_inner')[0].className += ' tf_scrollbar';
											prev.after(wrap);
											wrap.appendChild(prev);
											inner.prepend(wrap);
											if(br){
												break;
											}
										}
									} else {
										break;
									}
								}
								container.className = 'fp-section-container-horizontal tf_w tf_rel tf_overflow';
								inner.className = 'fp-section-container-inner tf_rel tf_w';
								elWrap.className = 'fp-section-container tf_w tf_overflow';
								el.getElementsByClassName('row_inner')[0].className += ' tf_scrollbar';
								container.appendChild(inner);
								el.after(container);
								inner.appendChild(el);
								el.after(elWrap);
								elWrap.appendChild(el);
								if (i !== 0 && _ISPARALLAX_ === true) {
									el.style['transform'] = 'translateX(-62%)';
									inner.getElementsByClassName('module_row')[0].style['transform'] = isHorizontal === false ? 'translateY(-62%)' : '';
								}
								horizontalNavigation(inner);
							} else if (!cl.contains('fp-section-container-horizontal')) {
								let wrap = document.createElement('div'),
										inner=el.getElementsByClassName('row_inner')[0];
								wrap.className = 'fp-section-container tf_w tf_overflow';
								if (i !== 0 && _ISPARALLAX_ === true) {
									el.style['transform'] = 'translateY(-62%)';
								}
								if(inner!==undefined){
									inner.className += ' tf_scrollbar';
								}
								el.after(wrap);
								wrap.appendChild(el);
							}
						}
					}
				}
				if(initOnce===false){
					for (let allLazy = document.querySelectorAll('[data-lazy]'), i = allLazy.length - 1; i > -1; --i) {
						if (!wrapper.contains(allLazy[i])) {
							lazyItems.push(allLazy[i]);
						}
					}
					Themify.lazyDisable = null;
					Themify.lazyLoading(lazyItems);
					Themify.lazyDisable = true;
					for (let wowItems = wrapper.getElementsByClassName('wow'), i = wowItems.length - 1; i > -1; --i) {
						if (!wowItems[i].hasAttribute('data-tf-animation_delay')) {
							wowItems[i].setAttribute('data-tf-animation_delay', '.3');
						}
					}
				}
				pagesCount = childs.length;
			},
			main = function () {
				let prevHash = '';
				const currentHash = location.hash.replace('#', '').replace('!/', ''),
						_scrollTo = function (anchor) {
							if (anchor.indexOf('/') !== -1) {
								anchor = anchor.substring(0, anchor.indexOf('/'));
							}
							if (anchor && '#' !== anchor) {
								anchor = anchor.replace('#', '');
								let sectionEl = wrapper.querySelector('[data-anchor="' + anchor + '"]');
								if (!sectionEl) {
									sectionEl = document.getElementById(anchor);
								}

								if (sectionEl !== null) {
									sectionEl = sectionEl.closest('.fp-section-container');
									if (sectionEl) {
										let verticalIndex = Themify.convert(sectionEl.parentNode.children).indexOf(sectionEl),
												horizontalIndex = undefined;
										const horizontal = sectionEl.closest('.fp-section-container-horizontal');
										if (horizontal) {
											horizontalIndex = verticalIndex;
											verticalIndex = Themify.convert(horizontal.parentNode.children).indexOf(horizontal);
										}
										scrollTo(verticalIndex, horizontalIndex, !initOnce);
										return true;
									}
								}
							}
							return false;
						},
						changeHash = function (hash, onlyMenu) {
							if (prevHash !== hash) {
								prevHash = hash;
								_setActiveMenu(hash);
								if (onlyMenu === undefined) {
									if (hash && hash !== '#' && _scrollTo(hash)) {
										if (Themify.body[0].classList.contains('mobile-menu-visible')) {
											/* in Overlay header style, when a menu item is clicked, close the overlay */
											const menu = document.getElementById('menu-icon');
											if (menu) {
												menu.click();
											}
										}
										return true;
									}
								}
								return false;
							}
							Themify.trigger('themify_onepage_scrolled');
						};
				if (!currentHash || !changeHash(currentHash)) {
					scrollTo(currentIndex, undefined, true);
					Themify.trigger('themify_onepage_afterload');
				}
				setTimeout(function () {
					window.addEventListener('hashchange', function (e) {
						if (initOnce === true && isDisabled===false) {
							changeHash(this.location.hash, true);
						}
					}, {passive: true});

					Themify.body[0].addEventListener(_CLICK_, function (e) {
						if (initOnce === true && isDisabled===false) {
							const el = e.target.closest('a');
							if (el) {
								const url = el.getAttribute('href');
								if (url && url !== '#' && url.indexOf('#') !== -1) {
									try {
										let path = new URL(location.protocol+'//'+location.host+location.pathname+url);
										if (path.hash && (url.indexOf('#') === 0 || (path.pathname === location.pathname && path.hostname === location.hostname))) {
											e.preventDefault();
											changeHash(path.hash);
										}
									} catch (_) {
									}
								}else if(el.classList.contains('scroll-next-row')){
									scrollTo('next');
								}
							}
						}
					});

					initOnce = true;
				}, 250);

			},
			horizontalNavigation = function (wrap) {
				const childs = wrap.children,
						fr = document.createDocumentFragment(),
						nav = document.createElement('ul'),
						prev = document.createElement('div'),
						next = document.createElement('div');

				for (let i = 0, len = childs.length; i < len; ++i) {
					let li = document.createElement('li'),
							a = document.createElement('a');
					a.href = '#';
					if (i === 0) {
						li.className = 'active';
					}
					li.appendChild(a);
					nav.appendChild(li);
				}

				nav.className = 'fp-slidesNav';
				next.className = 'fp-controlArrow fp-next';
				prev.className = 'fp-controlArrow fp-prev';
				nav.addEventListener(_CLICK_, function (e) {
					e.preventDefault();
					e.stopPropagation();
					const el = e.target.closest('li');
					if (el && !el.classList.contains('active')) {
						scrollTo(currentIndex, Themify.convert(el.parentNode.children).indexOf(el));
					}
				});

				next.addEventListener(_CLICK_, function (e) {
					e.stopPropagation();
					let el = nav.querySelector('.active');
					el = (el && el.nextElementSibling) ? el.nextElementSibling : nav.firstElementChild;
					Themify.triggerEvent(el, e.type);
				}, {passive: true});

				prev.addEventListener(_CLICK_, function (e) {
					e.stopPropagation();
					let el = nav.querySelector('.active');
					el = (el && el.previousElementSibling) ? el.previousElementSibling : nav.lastElementChild;
					Themify.triggerEvent(el, e.type);
				}, {passive: true});
				fr.appendChild(prev);
				fr.appendChild(next);
				fr.appendChild(nav);
				wrap.parentNode.appendChild(fr);
			},
			_verticalNavigation = function () {
				if (isHorizontal === false) {
					const nav = document.createElement('ul'),
							childs = wrapper.children;
					for (let i = 0; i < pagesCount; ++i) {
						let li = document.createElement('li'),
							a = document.createElement('a'),
							el = childs[i].getElementsByClassName('module_row')[0],
							id = el.getAttribute('data-row-title'),
							tooltip = document.createElement('div');

						a.href = '#';
						if (i === currentIndex) {
							li.className = 'active';
						}
						li.appendChild(a);
						if (id === 'footerwrap') {
							id = '';
						} else if (!id) {
							id = _getAnchor(el);
						}
						if (id) {
							tooltip.className = 'fp-tooltip';
							tooltip.innerText = id;
							li.appendChild(tooltip);
						}
						nav.appendChild(li);
					}

					nav.id = 'fp-nav';
					nav.className = 'fp-slidesNav';
					nav.addEventListener(_CLICK_, function (e) {
						e.preventDefault();
						e.stopPropagation();
						const el = e.target.closest('li');
						if (el && !el.classList.contains('active')) {
							scrollTo(Themify.convert(el.parentNode.children).indexOf(el));
						}
					});
					Themify.body[0].appendChild(nav);
				}
			},
			_touchstart = function (e) {
				if (scrolling === false) {
					let touchStartY = e.touches ? e.touches[0].clientY : e.clientY,
							touchStartX = e.touches ? e.touches[0].clientX : e.clientX,
							target = e.targetTouches ? e.targetTouches[0] : e.target,
							inHorizontal = isHorizontal;
					const _MOVE_ = e.type === 'touchstart' ? 'touchmove' : 'pointermove',
							_UP_ = e.type === 'touchstart' ? 'touchend' : 'pointerup',
							_CANCEL_ = e.type === 'touchstart' ? 'touchcancel' : 'pointercancel',
							_SENSITIVE_ = 5,
							_upCallback = function (e) {
								this.removeEventListener(_MOVE_, _moveCallback, {passive: true});
								this.removeEventListener(_UP_, _upCallback, {passive: true, once: true});
								this.removeEventListener(_CANCEL_, _upCallback, {passive: true, once: true});
								wrapper.removeEventListener(_UP_, _upCallback, {passive: true, once: true});
								touchStartY = touchStartX = null;
							},
							_moveCallback = function (e) {
								if (scrolling === false) {
									const touchEndY = e.touches ? e.touches[0].clientY : e.clientY,
											touchEndX = e.touches ? e.touches[0].clientX : e.clientX;
									if (touchEndY !== touchStartY || (inHorizontal === true && touchEndX !== touchStartX)) {
										let dir = '';
										if (inHorizontal === true) {
											if (touchEndX + _SENSITIVE_ < touchStartX) {/*left*/
												dir = Themify.isRTL === true ? 'prev' : 'next';
											} else if (touchEndX - _SENSITIVE_ > touchStartX) {/*right*/
												dir = Themify.isRTL === true ? 'next' : 'prev';
											}
										}
										if (dir === '') {
											if (touchEndY + _SENSITIVE_ < touchStartY) {/*up*/
												dir = 'next';
											} else if (touchEndY - _SENSITIVE_ > touchStartY) {/*down*/
												dir = 'prev';
											}
										}
										if (dir !== '') {
											touchStartY = touchEndY;
											touchStartX = touchEndX;
											scrollTo(dir);
										}
									}
								}
							};
							if(target.target){
								target=target.target;
							}
					if (wrapper === target || wrapper.contains(target)) {
						if (inHorizontal === false) {
							inHorizontal = target.closest('.fp-section-container-horizontal') !== null;
						}
						document.addEventListener(_MOVE_, _moveCallback, {passive: true});
						document.addEventListener(_UP_, _upCallback, {passive: true, once: true});
						document.addEventListener(_CANCEL_, _upCallback, {passive: true, once: true});
						wrapper.addEventListener(_UP_, _upCallback, {passive: true, once: true});
					}
				}
			},
			_wheel = function (e) {
				if (scrolling === false) {
					scrollTo((e.deltaY > 0 ? 'next' : 'prev'));
				}
			},
			_scrollVertical = function (horizontalIndex, silient) {
				silient = !!silient;
				const el = wrapper.children[currentIndex],
						row = (el && _ISPARALLAX_ === true) ? el.getElementsByClassName('module_row')[0] : null,
						nav = document.getElementById('fp-nav'),
						ev = currentIndex === 0 ? 'tf_fixed_header_disable' : 'tf_fixed_header_enable';
				if (row) {
					let next = el.nextElementSibling;
					if (next) {
						next = next.getElementsByClassName('module_row')[0];
						if (next) {
							if (silient !== true) {
								next.style['willChange'] = 'transform';
								next.addEventListener('transitionend', function () {
									this.style['transition'] = this.style['willChange'] = '';
								}, {passive: true, once: true});
								next.style['transition'] = 'transform ' + duration + 'ms ease';
								next.style['transform'] = 'translateY(-62%)';
							}
						}
					}
					if (silient !== true && row.style.transform) {
						row.style['willChange'] = 'transform';
						row.addEventListener('transitionend', function () {
							this.style['transition'] = this.style['willChange'] = '';
						}, {passive: true, once: true});
						row.style['transition'] = 'transform ' + duration + 'ms ease';
						row.style['transform'] = '';
					}
				}
				if(nav){
					const navItems = nav.children;
					for (let i = navItems.length - 1; i > -1; --i) {
						navItems[i].classList.toggle('active', i === currentIndex);
					}
				}
				if (silient === true) {
					wrapper.style['transition'] = 'none';
					setTimeout(function () {
						Themify.trigger(ev);
						wrapper.style['transition'] = '';
					}, 100);
					el.classList.add('complete');
					el.getElementsByClassName('module_row')[0].style['transform'] = '';
					scrolling = false;
					if (horizontalIndex !== undefined) {
						scrollTo(currentIndex, horizontalIndex, silient);
					}
				} else {
					wrapper.style['willChange'] = 'transform';
					wrapper.addEventListener('transitionend', function () {
						this.style['willChange'] = '';
						setTimeout(function () {
							Themify.trigger(ev);
							el.classList.add('complete');
							scrolling = false;
							if (horizontalIndex !== undefined) {
								scrollTo(currentIndex, horizontalIndex, silient);
							}
						}, 400);// set delay for mac double scroll
					}, {passive: true, once: true});
				}
				wrapper.style['transform'] = 'translateY(calc(var(--fp-vh, 1vh) * -'+100 * currentIndex+') )';
				Themify.trigger('themify_onepage_afterload', [el]);
			},
			_scrollHorizontally = function (container, silient) {
				silient = !!silient;
				const navItems = container.getElementsByClassName('fp-slidesNav')[0].children,
						index = parseInt(container.dataset['index']),
						inner = container.getElementsByClassName('fp-section-container-inner')[0],
						el = inner.children[index],
						row = (el && _ISPARALLAX_ === true) ? el.getElementsByClassName('module_row')[0] : null;
				if (row) {
					let next = el.nextElementSibling;
					if (next) {
						next = next.getElementsByClassName('module_row')[0];
						if (next) {
							if (silient !== true) {
								next.style['willChange'] = 'transform';
								next.addEventListener('transitionend', function () {
									this.style['transition'] = this.style['willChange'] = '';
								}, {passive: true, once: true});
								next.style['transition'] = 'transform ' + duration + 'ms ease';
								next.style['transform'] = 'translateX(-62%)';
							}
						}
					}

					if (silient !== true && row.style.transform) {
						row.style['willChange'] = 'transform';
						row.addEventListener('transitionend', function () {
							this.style['transition'] = this.style['willChange'] = '';
						}, {passive: true, once: true});
						row.style['transition'] = 'transform ' + duration + 'ms ease';
						row.style['transform'] = '';
					}
				}
				for (let i = navItems.length - 1; i > -1; --i) {
					navItems[i].classList.toggle('active', i === index);
				}
				if (silient === true) {
					inner.style['transition'] = 'none';
					setTimeout(function () {
						inner.style['transition'] = '';
					}, 100);
					el.classList.add('complete');
					el.getElementsByClassName('module_row')[0].style['transform'] = '';
					scrolling = false;
				} else {
					inner.style['willChange'] = 'transform';
					inner.addEventListener('transitionend', function () {
						this.style['willChange'] = '';
						setTimeout(function () {
							el.classList.add('complete');
							scrolling = false;
						}, 400);// set delay for mac double scroll
					}, {passive: true, once: true});
				}
				inner.style['transform'] = 'translateX(-' + (100 * index) + '%)';
				Themify.trigger('themify_onepage_afterload', [el]);
			},
			scrollTo = function (verticalIndex, horizontalIndex, silient) {
				if (scrolling === false) {
					// when lightbox is active, prevent scrolling the page
					if (Themify.body[0].classList.contains('themify_mp_opened')) {
						return;
					}
					const isNumber = verticalIndex !== 'next' && verticalIndex !== 'prev',
							oldIndex = currentIndex,
							verticalChilds = wrapper.children,
							item = verticalChilds[oldIndex];
					let changeHorizontal=false;
					if (isNumber) {
						currentIndex = verticalIndex;
					}
					if (item) {
						let index = parseInt(item.dataset['index']) || 0;
						const isHorizontalScroll = isHorizontal === true || (item.classList.contains('fp-section-container-horizontal') ? (isNumber || snakeScroll) : false),
								horizontalChilds = isHorizontalScroll ? item.getElementsByClassName('fp-section-container') : null,
								horizontalItem = isHorizontalScroll && horizontalChilds[index] ? horizontalChilds[index] : null;

						if (!isNumber) {
							const el = horizontalItem ? horizontalItem : item,
									inner = el.getElementsByClassName('tf_scrollbar')[0],
									max = inner.scrollHeight - inner.clientHeight;
							if (max > 0) {
								const top = inner.scrollTop;
								if ((verticalIndex === 'prev' && top > 0) || (verticalIndex === 'next' && top < max)) {
									if (!Themify.isTouch && !_is_retina) {
										inner.scrollTop += (verticalIndex === 'prev' ? -100 : 100);
									}
									return;
								}
							}
						}
						if (isHorizontalScroll) {
							const oldHorizontalIndex = index;
							lazyLoad(horizontalItem);
							if (isNumber) {
								if (horizontalIndex !== undefined) {
									index = horizontalIndex;
								}
							} else {
								if (verticalIndex === 'next') {
									if (index < (horizontalChilds.length - 1)) {
										++index;
									}else{
										changeHorizontal=true;
									}
								} else if (verticalIndex === 'prev' && index > 0) {
									--index;
								}else{
									changeHorizontal=true;
								}
							}
							if (horizontalChilds[index]) {
								_setActive(index);
							}
							if (oldHorizontalIndex !== index || silient === true) {
								scrolling = true;
								item.dataset['index'] = index;
								_scrollHorizontally(item, silient);
								const nextItem = oldHorizontalIndex > index ? (index - 1) : (index + 1);
								if (horizontalChilds[nextItem]) {
									lazyLoad(horizontalChilds[nextItem]);
								}
								if(!isNumber || verticalIndex === oldIndex){
									return;
								}
							} else if (horizontalChilds[index] && horizontalChilds[index].nextElementSibling) {
								lazyLoad(horizontalChilds[index].nextElementSibling);
							}
						}
					} else {
						return;
					}
					if (isHorizontal === false || changeHorizontal===true) {
						if (verticalIndex === 'next') {
							if (oldIndex < (pagesCount - 1)) {
								++currentIndex;
							}
						} else if (verticalIndex === 'prev' && oldIndex > 0) {
							--currentIndex;
						}
						if (verticalChilds[currentIndex]) {
							_setActive();
						}
						if (oldIndex !== currentIndex || silient === true) {
							if (!isNumber && verticalChilds[currentIndex] && verticalChilds[currentIndex].classList.contains('fp-section-container-horizontal')) {
								const index = verticalIndex === 'next' ? 0 : (snakeScroll?verticalChilds[currentIndex].getElementsByClassName('fp-section-container').length - 1:0);
								if (index !== parseInt(verticalChilds[currentIndex].dataset['index'])) {
									scrollTo(currentIndex, index, true);
								}
							}
							scrolling = true;
							_scrollVertical((isNumber ? horizontalIndex : undefined), silient);
							const nextItem = oldIndex > currentIndex ? (currentIndex - 1) : (currentIndex + 1);
							if (verticalChilds[nextItem]) {
								lazyLoad(verticalChilds[nextItem]);
							}
						} else if (verticalChilds[currentIndex] && verticalChilds[currentIndex].nextElementSibling) {
							lazyLoad(verticalChilds[currentIndex].nextElementSibling);
						}
					}
				}
			},
			_setActive = function (horizontalIndex) {
				const active = wrapper.querySelectorAll('.fp-section-container-horizontal.active,.fp-section-container.active'),
						verticalIndex = currentIndex,
						verticalItem = wrapper.children[verticalIndex],
						isHorizontalScroll = horizontalIndex === undefined,
						isHorizontalWrapper = verticalItem.classList.contains('fp-section-container-horizontal'),
						bodyCl = Themify.body[0].classList;

				let activeCl = (isHorizontal === true || isHorizontalWrapper) ? verticalIndex : _getAnchor(verticalItem.getElementsByClassName('module_row')[0], true),
						currentSection = verticalItem;

				if (activeCl === '' || activeCl === null) {
					activeCl = verticalIndex;
				}
				for (let i = active.length - 1; i > -1; --i) {
					active[i].classList.remove('complete', 'active');
				}
				if (isHorizontalWrapper) {

					if (isHorizontalScroll) {
						horizontalIndex = parseInt(verticalItem.getAttribute('data-index')) || 0;
					}
					currentSection = verticalItem.getElementsByClassName('fp-section-container')[horizontalIndex];
					let anchor = _getAnchor(currentSection.getElementsByClassName('module_row')[0], true);
					if (!anchor) {
						anchor = horizontalIndex;
					}
					activeCl += '-' + anchor;
					if (isHorizontalScroll) {
						currentSection.classList.add('active', 'complete');
					}
				} else {
					activeCl += '-0';
				}

				currentSection.classList.add('active');
				_setAnchor(currentSection);
				for (let i = bodyCl.length - 1; i > -1; --i) {
					if (bodyCl[i].indexOf('fp-viewing-') === 0) {
						bodyCl.remove(bodyCl[i]);
						break;
					}
				}
				bodyCl.add('fp-viewing-' + activeCl);
				lazyLoad(currentSection);
				_mediaAutoPlay(currentSection);
			},
			_keydown = function (e) {
				if (scrolling === false) {
					const code = e.key || e.keyCode;
					if (code) {
						switch (code) {
							case 33:
							case 37:
							case 38:
							case 'ArrowUp':
							case 'ArrowLeft':
							case 'PageUp':
								scrollTo('prev');
								break;

							case 34:
							case 39:
							case 40:
							case 'ArrowDown':
							case 'ArrowRight':
							case 'PageDown':
								scrollTo('next');
								break;
						}
					}
				}
			},
			_updateFullPage = function (w) {
				const bp = themifyScript.breakpoints;
				let view = 'desktop';
				for (let k in bp) {
					if (Array.isArray(bp[k])) {
						if (w >= bp[k][0] && w <= bp[k][1]) {
							view = k;
							break;
						}
					} else if (w <= bp[k]) {
						view = k;
						break;
					}
				}
				for (let  childs = wrapper.children, j = childs.length - 1; j > -1; --j) {
					if (childs[j].classList.contains('module_row') && (childs[j].classList.contains('hide-' + view) || (childs[j].offsetWidth === 0 && childs[j].offsetHeight === 0))) {
						childs[j].parentNode.removeChild(childs[j]);
					}
				}
			},
			lazyLoad = function (el) {
				if (el && !el.hasAttribute('data-done')) {
					el.setAttribute('data-done', true);
					Themify.lazyScroll(Themify.convert(Themify.selectWithParent('[data-lazy]', el)).reverse(), true);
				}
			},
			_mediaAutoPlay = function (el) {
				if (el) {
					const items = el.querySelectorAll('video,audio');
					for (let i = 0, len = items.length; i < len; ++i) {
						if (items[i]) {
							if (items[i].readyState === 4) {
								items[i].play();
							} else {
								Themify.requestIdleCallback(function () {
									items[i].addEventListener('loadedmetadata', function () {
										const _this = this;
										setTimeout(function () {
											_this.play();
										}, 100);
									}, {passive: true, once: true});
								}, 220);
							}
						}
					}
				}
			},
			_setActiveMenu = function (anchor) {
				const menu = document.getElementById('main-nav');
				if (menu !== null) {
					const items = menu.getElementsByTagName('li');
					let aSectionHref = anchor ? menu.querySelector('a[href="#' + anchor.replace('#', '') + '"]') : null;
					if (aSectionHref !== null) {
						aSectionHref = aSectionHref.parentNode;
					}
					for (let i = items.length - 1; i > -1; --i) {
						if (aSectionHref === items[i]) {
							items[i].classList.add('current-menu-item');
						} else {
							items[i].classList.remove('current_page_item', 'current-menu-item');
						}
					}
				}
			},
			_getAnchor = function (row, ignore) {// Get builder rows anchor class to ID //
				if (ignore === true || !row.hasAttribute('data-hide-anchor')) {
					let anchor = row.getAttribute('data-anchor');
					if (!anchor) {
						anchor = row.getAttribute('id');
						if (!anchor) {
							anchor = '';
						}
					}
					return anchor.replace('#', '');
				}
				return '';
			},
			_setAnchor = function (row) {
				if (row) {
					row = row.getElementsByClassName('module_row')[0];
					if (row) {
						const anchor = _getAnchor(row);
						if (anchor && anchor !== '#') {
							if (location.hash !== '#' + anchor) {
								const item=document.getElementById(anchor);
								if(item){//if there is an element,browser will move the scrollbar
									item.removeAttribute('id');
								}
								window.location.hash = anchor;
								if(item){
									item.id=anchor;
								}
							}
						} else {
							history.replaceState(null, null, location.pathname);
						}
					}
				}
			},
			_init = function (e) {
				if (!wrapper) {
					wrapper = document.getElementById('tbp_content') || document.getElementById('pagewrap');
					wrapper = wrapper !== null ? wrapper.getElementsByClassName('themify_builder')[0] : document.querySelector('.themify_builder:not(.not_editable_builder)');
				}
				if (wrapper) {
					const w = e ? e.w : Themify.w,
						callback = function () {
							const isMobile = _MOBILE_BREAKPOINT_ && w <= _MOBILE_BREAKPOINT_,
									bodyCl=Themify.body[0].classList;
							if (isMobile === true && bodyCl.contains('full-section-scrolling')) {
								_disable();
							}else if((isMobile !== true && isDisabled) || !initOnce){
								isDisabled=false;
								Themify.trigger('tb_scroll_highlight_disable');
								bodyCl.add('full-section-scrolling');
								if(has_footer===true){
									bodyCl.add('fullpage-footer');
								}
								Themify.lazyDisable = true;
								run();
							}
							document.documentElement.style.setProperty('--fp-vh', (window.innerHeight * 0.01)+'px');
							if(!Themify.body[0].classList.contains('transparent-header')){
								const hwrap=document.getElementById('headerwrap');
								if(hwrap){
									document.documentElement.style.setProperty('--fp-hd', hwrap.clientHeight+'px');
								}
							}
						};
					_updateFullPage(w);
					if (!Themify.is_builder_loaded && window['tbLocalScript'] !== undefined) {
						Themify.body.one('themify_builder_loaded', callback);
					} else {
						callback();
					}
				} else {
					Themify.trigger('themify_onepage_afterload');
				}

			};

	Themify.on('themify_theme_fullpage_init', function (options) {
		window.scroll(0, 0);
		isHorizontal = !!options['is_horizontal'];
		has_footer=!!options['has_footer'];
		Themify.loadWowJs(function () {
			_init();
			if (_MOBILE_BREAKPOINT_) {
				Themify.on('tfsmartresize', _init);
			}
		});
	}, true);

})(Themify, document, window, themifyScript);
