/*
 * 爱唱歌播放器
 * https://github.com/ITEC-ELWG/IChanggePlayer
 *
 * Author: Ray Taylor Lin
 * Version: 1.0.0
 * Date: 2014-8-13
 *
 * Requires:
 *  - jQuery 1.7.0+
 *  - jPlayer 2.3.0+
 *  - jPlayer.playlist *
 */

(function($, jPlayerPlaylist, undefined) {
    var options = {
            containerId: 'ichangge-player',
            format: 'mp3, oga',
            solution: 'flash, html',
            swfPath: 'scripts/lib/',
            playList: [],
            defaultCoverUrl: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D',
            dataAdapter: {
                artist: 'artist',
                title: 'title',
                mp3: 'mp3',
                oga: 'oga',
                cover: 'cover'
            },
            startIndex: 0,
            draggable: true,
            fadeVolumn: true,
            startImmediately: false,
            hasCloseControl: true,
            hasExtraControls: true,
            debug: false
        },
        currentSong, loadingTimer,
        $mainContainer, $mockPlayer, mainPlayer;

    var init = function(opts) {
        $.extend(options, opts);

        createDOM(options.containerId);
        initPlayer(options.playList);
        initCirclePlayer();
        bindEvents();
    };

    function createDOM(containerId) {
        var PLAYER_TEMPLATE =
            '<div id="ichangge-player-mock"></div>' +
            '<div id="ichangge-player-container" class="jp-audio">' +
            '<div class="container jp-gui jp-image-circular">' +
            '<div class="song-cover-container player-default-cover jp-image-wrapper jp-image-circular">' +
            '<img src="' + options.defaultCoverUrl + '" alt="" class="jp-cover jp-image-present jp-image-circular">' +
            '<div class="song-cover-shade player-cover-shade"></div>' +
            '</div>' +
            '<div class="player-song-interactions">' +
            '<a href="javascript:void(0);" class="jp-like mr-10"><i class="jp-icon player-icon-like"></i></a>' +
            '<a href="javascript:void(0);" class="jp-share mr-10"><i class="jp-icon player-icon-share"></i></a>' +
            '</div>' +
            '<div class="jp-details">' +
            '<div class="player-song-info">' +
            '<div class="scroll-text">' +
            '<span class="jp-title mb-5"></span></div>' +
            '<div class="scroll-text">' +
            '<span class="jp-artist mb-5"></span></div>' +
            '<p class="jp-duration mb-5"></p>' +
            '</div>' +
            '</div>' +
            '<div class="jp-controller player-song-actions">' +
            '<div class="jp-controls">' +
            '<a class="jp-control-btn jp-previous" href="javascript:void(0);" title="上一首">' +
            '<i class="jp-icon player-icon-prev"></i>' +
            '</a>' +
            '<a class="jp-control-btn jp-play" href="javascript:void(0);" title="播放">' +
            '<i class="jp-icon player-icon-play"></i>' +
            '<i class="jp-icon player-icon-loading"></i>' +
            '</a>' +
            '<a class="jp-control-btn jp-pause" href="javascript:void(0);" title="暂停">' +
            '<i class="jp-icon player-icon-pause"></i>' +
            '</a>' +
            '<a class="jp-control-btn jp-next" href="javascript:void(0);" title="下一首">' +
            '<i class="jp-icon player-icon-next"></i>' +
            '</a>' +
            '<a class="jp-control-btn jp-close" href="javascript:void(0);" title="关闭播放器">' +
            '<i class="jp-icon player-icon-close"></i>' +
            '</a>' +
            '</div>' +
            '</div>' +
            '<div class="js-progress">' +
            '</div>' +
            '</div>' +
            '</div>';

        $mainContainer = $('#' + containerId);

        if (!$mainContainer.length) {
            $mainContainer = $('<div>').attr('id', containerId);
            $('body').append($mainContainer);
        } else {
            $mainContainer.empty();
        }

        $mainContainer.append($(PLAYER_TEMPLATE));
        // 原先的$mainContainer是总容器，后面需要修正为包含DOM的容器
        $mainContainer = $('#ichangge-player-container');
        $mockPlayer = $('#ichangge-player-mock');

        if (!options.hasCloseControl) {
            $mainContainer.find('.jp-close').remove();
        }
        if (!options.hasExtraControls) {
            $mainContainer.find('.player-song-interactions').remove();
        }
    }

    function initPlayer(playList) {
        playList = convertDataInterface(playList);
        if (playList.length === 0) {
            console.error('The playlist has no audios.');
            return;
        }

        mainPlayer = new jPlayerPlaylist({
            jPlayer: '#ichangge-player-mock',
            cssSelectorAncestor: '#ichangge-player-container'
        }, playList, {
            swfPath: options.swfPath,
            solution: options.solution,
            supplied: options.format,
            volume: 0.8,
            wmode: "window",
            cssSelectorAncestor: "#ichangge-player-container",
            loop: true,
            fullScreen: true,
            smoothPlayBar: true,
            keyEnabled: true,
            remainingDuration: true,
            toggleDuration: true,
            ready: function(e) {
                selectSong(options.startIndex, options.startImmediately);
                if (options.fadeVolumn) {
                    mixinAudioPause();
                }
            },
            loadstart: function(e) {
                log('Start loading...');
                fixIPhonePlayButton();
                resetErrorHint();
                setLoadingTimeout();
            },
            error: function(e) {
                log(e.jPlayer.error);
                handlePlayerError('error');
            },
            loadeddata: function(event) {
                log('loadeddata');
            },
            loadedmetadata: function(e) {
                log('loadedmetadata');
            },
            canplaythrough: function(e) {
                log('canplaythrough');
            },
            canplay: function(e) {
                log('canplay');
                fixLoadingButton(false);
                clearTimeout(loadingTimer);
            },
            play: function(e) {
                log('play');
                if (options.fadeVolumn) {
                    $mockPlayer.jPlayerFade().fadeIn(1000);
                }
            },
            pause: function(e) {
                log('pause');
            },
            durationchange: function(e) {
                log('duration change');
            }
        });
    }

    var selectSong = function(index, immediately) {
        if (index === 'next') {
            mainPlayer.next();
        } else if (index === 'previous') {
            mainPlayer.previous();
        } else {
            if (immediately) {
                mainPlayer.play(index);
            } else {
                mainPlayer.select(index);
            }
        }
    };

    function initCirclePlayer() {
        var CIRCLE_TEMPLATE = '<div id="cp_container_1" class="cp-container">' +
            '<div class="cp-buffer-holder">' +
            '<div class="cp-buffer-1 player-player-cache"></div>' +
            '<div class="cp-buffer-2 player-player-cache"></div>' +
            '</div>' +
            '<div class="cp-progress-holder">' +
            '<div class="cp-progress-1 player-player-progress"></div>' +
            '<div class="cp-progress-2 player-player-progress"></div>' +
            '</div>' +
            '<div class="cp-circle-control"></div>' +
            '</div>';

        $('#ichangge-player-container').append($(CIRCLE_TEMPLATE));

        var circlePlayer = new CirclePlayer('#ichangge-player-mock', {
            cssSelectorAncestor: '#cp_container_1'
        });
    }

    function bindEvents() {
        var $btnClose = $mainContainer.find('.jp-close');

        $mockPlayer.on($.jPlayer.event.setmedia, function(e) {
            updateCurrentSong();
        });

        $btnClose.click(function() {
            hide(true);
        });

        $mainContainer.hover(function() {
            $btnClose.stop(true).fadeIn('fast');
        }, function() {
            $btnClose.stop(true).fadeOut('fast');
        });

        if (options.draggable) {
            enableDrag();
        }
    }

    /**
     * 打开播放器拖拽移动功能
     */
    function enableDrag() {
        var $draggingObj = null, rel;

        $(document.body).on('mousedown', '#ichangge-player-container', function(e) {
            $draggingObj = $(this);
            rel = {
                left: e.pageX - $draggingObj.offset().left,
                top: e.pageY - $draggingObj.offset().top
            };
        }).on('mousemove', function(e) {
            if ($draggingObj) {
                $draggingObj.offset({
                    left: e.pageX - rel.left,
                    top: e.pageY - rel.top
                });
            }
        }).on('mouseup', function(e) {
            $draggingObj = null;
        });
    }

    /**
     * 通过混入重写原生Audio元素的pause方法，引入声音渐隐效果
     */
    function mixinAudioPause() {    
        (function() {
            var audio, originalPause;

            if(audio = $('audio#jp_audio_0')[0]) {
                originalPause = audio.pause;
                audio.pause = mixin;
            } else if (audio = $('#jp_flash_0')[0]) {
                originalPause = audio.fl_pause;
                // WARNING: 此处暂时无法覆写FLASH的方法
                audio.fl_pause = mixin;
            }

            // 引入参数fadeIn，只有显示指定为true时才产生声音渐隐效果，否则直接调用原生方法
            function mixin(fadeIn) {
                if (fadeIn) {
                    $mockPlayer.jPlayerFade().fadeOut(800, null, null, function() {
                        originalPause.call(audio);
                    });
                } else {
                    originalPause.call(audio);
                }
            }
        })();
    }

    function fixIPhonePlayButton() {
        if (navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i)) {
            log('detected iphone');
            fixLoadingButton(false);
        } else {
            fixLoadingButton(true);
        }
    }

    function fixLoadingButton(isLoading) {
        if (isLoading) {
            $mainContainer.find('.player-icon-play').addClass('fa-spin');
        } else {
            $mainContainer.find('.player-icon-play').removeClass('fa-spin');
        }
    }

    function updateCurrentSong() {
        var $cover = $mainContainer.find('.jp-cover');

        currentSong = mainPlayer.playlist[mainPlayer.current];
        if (currentSong.cover) {
            $cover.attr('src', currentSong.cover).show();
        } else {
            $cover.hide();
        }

        initScrollText();
        log(currentSong);
    }

    function initScrollText() {
        $mainContainer.find('.scroll-text').each(function(i, el) {
            var $container = $(el),
                $text = $container.children().first(),
                cw = $container.width(),
                tw = $text.width();

            $text.stop(true).css('marginLeft', 0);
            if(tw > cw) {
                endless($text, cw - tw);
            }
        });

        function endless($el, length) {
            $el.delay(3000)
                .animate({marginLeft: '' + length}, Math.abs(length) * 40, 'linear')
                .delay(3000)
                .animate({marginLeft: 0}, Math.abs(length) * 40, 'linear')
                .queue(function(next) {
                    endless($el, length);
                    next();
                });
        }
    }

    function convertDataInterface(playList) {
        var adapter = options.dataAdapter,
            cleanPlayList = [],
            item, src, dst, i;

        for (i = 0; i < playList.length; i++) {
            item = {};
            for (src in options.dataAdapter) {
                item[src] = playList[i][adapter[src]];
            }
            cleanPlayList.push(item);
        }
        return cleanPlayList;
    }

    /**
     * 处理播放器出错
     */
    function handlePlayerError(type) {
        if (type === 'error') {
            $mainContainer.find('.jp-title').html('出错啦 ←_←');
            $mainContainer.find('.jp-artist').html(
                mainPlayer.original.length > 1 ? '即将播放下一首歌' : '请换个地方听歌吧');
            // 3秒后自动切歌
            setTimeout(function() {
                if (mainPlayer.original.length > 1) {
                    mainPlayer.next();
                }
            }, 5000);
        } else if (type === 'loading') {
            $mainContainer.find('.jp-title').html('歌曲加载有点小问题');
            $mainContainer.find('.jp-artist').html('请刷新重试 (╯‵□′)╯︵┻━┻');
        }
        $mainContainer.find('.jp-duration').addClass('jp-hidden');
        $mainContainer.find('.song-cover-shade').addClass('error-cover');
    }

    /**
     * 重置播放器错误提示
     */
    function resetErrorHint() {
        $mainContainer.find('.jp-duration').removeClass('jp-hidden');
        $mainContainer.find('.song-cover-shade').removeClass('error-cover');
    }

    /**
     * 设置加载超时
     */
    function setLoadingTimeout() {
        clearTimeout(loadingTimer);
        loadingTimer = setTimeout(function() {
            handlePlayerError('loading');
        }, 10000);
    }

    function log(msg) {
        if (options.debug) {
            console.log(msg);
        }
    }

    /**
     * 显示播放器
     */
    var show = function() {
        $mainContainer.fadeIn('fast');
    };

    /**
     * 隐藏播放器
     * @param  {Boolean} pauseWhenClose 是否在隐藏播放器时暂停播放歌曲
     */
    var hide = function(pauseWhenClose) {
        if (pauseWhenClose) {
            $mockPlayer.jPlayer('pause');
        }
        $mainContainer.fadeOut('fast');
    };

    /**
     * 添加播放曲目
     * @param {Array} playList 要添加的播放曲目数组
     */
    var add = function(playList) {
        var i, length;

        if ($.isArray(playList)) {
            playList = convertDataInterface(playList);
            for (i = 0, length = playList.length; i < length; i += 1) {
                mainPlayer.add(playList[i]);
            }
        }
    };

    window.IChanggePlayer = {
        init: init,
        select: selectSong,
        getPlayer: function() {
            return mainPlayer;
        },
        getPlayerDOM: function() {
            return $mainContainer;
        },
        getMockPlayerDOM: function() {
            return $mockPlayer;
        },
        show: show,
        hide: hide,
        add: add
    };

})(jQuery, jPlayerPlaylist);
