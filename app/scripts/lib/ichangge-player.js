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
            solution: 'html, flash',
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
            startImmediately: false,
            hasCloseControl: true,
            hasExtraControls: true,
            debug: false
        },
        currentSong,
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
            '<img src="' + options.defaultCoverUrl + '" alt="" class="jp-cover jp-image-present">' +
            '<div class="song-cover-shade player-cover-shade"></div>' +
            '</div>' +
            '<div class="player-song-interactions">' +
            '<i class="jp-icon player-icon-share mr-5"></i>' +
            '<i class="jp-icon player-icon-like mr-5"></i>' +
            '<i class="jp-icon player-icon-locate"></i>' +
            '</div>' +
            '<div class="jp-details">' +
            '<div class="player-song-info">' +
            '<p class="jp-title mb-5"></p>' +
            '<p class="jp-artist mb-5"></p>' +
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
            },
            loadstart: function(e) {
                log('Start loading...');
                fixIPhonePlayButton();
            },
            error: function(e) {
                log(e.jPlayer.error);
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
            },
            play: function(e) {
                log('play');
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
        log(currentSong);
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

    function log(msg) {
        if (options.debug) {
            console.debug(msg);
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
        hide: hide
    };

})(jQuery, jPlayerPlaylist);
