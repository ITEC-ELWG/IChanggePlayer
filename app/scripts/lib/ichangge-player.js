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
        $mainContainer = $('#' + containerId);

        if(!$mainContainer.length) {
            $mainContainer = $('<div>').attr('id', containerId);
            $('body').append($mainContainer);
        }
    }

    window.IChanggePlayer = {
        init: init
    };
})(jQuery, jPlayerPlaylist);