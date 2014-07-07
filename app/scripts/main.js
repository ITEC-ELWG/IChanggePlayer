$(document).ready(function(){
    var $ghostPlayer = $("#ichangge-player"),
        $mainPlayer = $("#ichangge-player-container");

    $mainPlayer.find('.jp-play').hide();
    $mainPlayer.find('.jp-pause').hide();

    $ghostPlayer.jPlayer({
        ready: function (event) {
            $(this).jPlayer("setMedia", {
                title: "庞麦郎-我的滑板鞋",
                // mp3: "http://115.156.216.106:3000/music/庞麦郎-我的滑板鞋.mp3"
                mp3: "http://ichangge-player-music.qiniudn.com/music/%E5%BA%9E%E9%BA%A6%E9%83%8E-%E6%88%91%E7%9A%84%E6%BB%91%E6%9D%BF%E9%9E%8B.mp3",
                // mp3: "http://ichangge-player-music.qiniudn.com/music/beyond-%E6%88%91%E6%98%AF%E6%84%A4%E6%80%92.mp3"
                // oga: "http://jplayer.org/audio/ogg/Miaow-07-Bubble.ogg"
            });
        },
        swfPath: "../js",
        supplied: "mp3, m4a, oga",
        volume: 0.8,
        wmode: "window",
        cssSelectorAncestor: "#ichangge-player-container",
        smoothPlayBar: true,
        keyEnabled: true,
        remainingDuration: true,
        toggleDuration: true,
        // progress: function(event) {
        //     log('progress');
        //     console.debug(event);
        //     // showPlay();
        // },
        loadstart: function(e) {
            log('Start loading...');
        },
        error: function(e) {
            log('error');
            log(e.toString());
        },
        loadeddata: function(event) {
            log('loadeddata');
        },
        canplaythrough: function(e) {
            log('canplaythrough');
            // $('loader').show();
        },
        canplay: function(e) {
            log('canplay');
            $mainPlayer.find('.jp-play').find('i.fa-spin')
                .removeClass('fa-spinner fa-spin').addClass('fa-play');
        },
        play: function(e) {
            // showPlay();
            log('play');
        },
        durationchange: function(e) {
            log('duration change');
            // log(e);
            // showPlay();
        }
    });

    function log(msg) {
            $('#logger').append('<p>'+ msg + '</p>');
        }
    // $("#jplayer_inspector").jPlayerInspector({jPlayer: $mainPlayer});
});