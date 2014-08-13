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

var IChanggePlayer = (function($, jPlayerPlaylist) {
    var options = {
        containerId: '#ichangge-player',
        playList: []
    }, $mainContainer;

    var init = function(options) {
        $.extend(this.options, options);

        createDOM(options.containerId);
    };

    function createDOM(containerId) {
        $mainContainer = $(containerId);
    }

    return {
        init: init
    };
})(jQuery, jPlayerPlaylist);