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
        playList: [],
        defaultCoverUrl: 'images/player-cover-default.png',
        debug: true
    },
    currentSong,
    $mainContainer, mainPlayer;

    var init = function(opts) {
        $.extend(options, opts);

        createDOM(options.containerId);
        initPlayer(options.playList);
        bindEvents();
    };

    function createDOM(containerId) {
        var PLAYER_TEMPLATE = 
        '<div id="ichangge-player-mock"></div>' + 
        '<div id="ichangge-player-container" class="jp-audio">' +
        '<div class="container jp-gui jp-image-circular">' +
        '<div class="song-cover-container jp-image-wrapper jp-image-circular">' +
        '<img src="images/player-cover-default.png" class="jp-cover jp-image-present">' +
        '<div class="song-cover-shade player-cover-shade"></div>' +
        '</div>' +
        '<div class="player-song-interactions">' +
        '<i class="jp-icon player-icon-share mr-5"></i>' +
        '<i class="jp-icon player-icon-like mr-5"></i>' +
        '<i class="jp-icon player-icon-locate"></i>' +
        '</div>' +
        '<div class="jp-details">' +
        '<div class="player-song-info">' +
        '<p class="jp-title mb-5">雨还是不停的落下</p>' +
        '<p class="jp-artist mb-5">孙燕姿</p>' +
        '<p class="jp-duration mb-5">-1:30</p>' +
        '</div>' +
        '<!--             <div class="jp-progress">' +
        '<div class="jp-seek-bar" style="width: 100%;">' +
        '<div class="jp-play-bar" style="overflow: hidden; width: 0%;"></div>' +
        '<div class="jp-play-bar-cursor"></div>' +
        '</div>' +
        '</div> -->' +
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
        '</div>' +
        '</div>' +
        '<div class="js-progress">' +
        '</div>' +
        '</div>' +
        '</div>';

        $mainContainer = $('#' + containerId);

        if(!$mainContainer.length) {
            $mainContainer = $('<div>').attr('id', containerId);
            $('body').append($mainContainer);
        }

        $mainContainer.append($(PLAYER_TEMPLATE));
        // 原先的$mainContainer是总容器，后面需要修正为包含DOM的容器
        $mainContainer = $('#ichangge-player-container');
    }

    function initPlayer(playList) {
        mainPlayer = new jPlayerPlaylist({
            jPlayer: '#ichangge-player-mock',
            cssSelectorAncestor: '#ichangge-player-container'
        }, playList, {
            swfPath: "scripts/lib/",
            solution: "html, flash",
            supplied: "mp3, oga",
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
                selectSong(0, false);
            },
            loadstart: function(e) {
                log('Start loading...');
                fixIPhonePlayButton();
            },
            error: function(e) {
                log('error');
                log(e.toString());
                console.debug(e);
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
                fixLoadingButton(true);
            },
            play: function(e) {
                log('play');
                fixLoadingButton(false);
            },
            pause: function(e) {
                log('pause');
                fixLoadingButton(true);
            },
            durationchange: function(e) {
                log('duration change');
            }
        });
    }

    function selectSong(index, canPlay) {
        if (index === 'next') {
            mainPlayer.next();
        } else if (index === 'previous') {
            mainPlayer.previous();
        } else {
            if (canPlay) {
                mainPlayer.play(index);
            } else {
                mainPlayer.select(index);
            }
        }
        updateCurrentSong();
    }

    function bindEvents() {
        $mainContainer.find('.jp-next, .jp-previous').on('click', function() {
            updateCurrentSong();
        });
    }

    function fixIPhonePlayButton() {
        if (navigator.userAgent.match(/iPhone/i) || 
            navigator.userAgent.match(/iPad/i)) {
            console.log('detected iphone');
            fixLoadingButton(true);
        } else {
            fixLoadingButton(false);
        }
    }

    function fixLoadingButton(canPlay) {
        if (canPlay) {
            $mainContainer.find('.player-icon-play').removeClass('fa-spin');
            $mainContainer.find('.player-icon-pause').removeClass('player-icon-play fa-spin');
        } else {
            $mainContainer.find('.player-icon-play').addClass('fa-spin');
            $mainContainer.find('.jp-pause').hide();
            $mainContainer.find('.jp-play').show();
        }
    }

    function updateCurrentSong() {
        currentSong = mainPlayer.playlist[mainPlayer.current];
        $mainContainer.find('.jp-cover').attr('src', 
            currentSong.cover || options.defaultCoverUrl);
        console.log(currentSong);
    }

    function log(msg) {
        if (options.debug) {
            $('#logger').prepend('<p>' + msg + '</p>');
            console.debug(msg);
        } else {
            console.debug(msg);
        }
    }

    window.IChanggePlayer = {
        init: init
    };
})(jQuery, jPlayerPlaylist);