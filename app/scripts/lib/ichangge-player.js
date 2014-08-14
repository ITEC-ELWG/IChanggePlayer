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
        playList: []
    }, $mainContainer;

    var init = function(opts) {
        $.extend(options, opts);

        createDOM(options.containerId);
    };

    function createDOM(containerId) {
        var PLAYER_TEMPLATE = 
        '<div id="ichangge-player-mock"></div>' + 
        '<div id="ichangge-player-container" class="jp-audio">' +
        '<div class="container jp-gui jp-image-circular">' +
        '<div class="song-cover-container jp-image-wrapper jp-image-circular">' +
        '<img src="images/player-cover-default.png" class="image-present-180">' +
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
        '<p class="jp-rest-duration mb-5">-1:30</p>' +
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
        '</a>' +
        '<a class="jp-control-btn jp-pause" href="javascript:void(0);" title="暂停">' +
        '<i class="jp-icon player-icon-pause"></i>' +
        '</a>' +
        '<a class="fa-stack fa-lg jp-control-btn jp-next" href="javascript:void(0);" title="下一首">' +
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
    }

    window.IChanggePlayer = {
        init: init
    };
})(jQuery, jPlayerPlaylist);