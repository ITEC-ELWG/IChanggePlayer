$(document).ready(function() {
    var IS_DEBUG = true;

    var $ghostPlayer = $("#ichangge-player"),
        $mainPlayer = $("#ichangge-player-container");

    // $mainPlayer.find('.jp-play').hide();
    changePlayButtonStyle(true);
    $mainPlayer.find('.jp-pause').hide();

    $ghostPlayer.jPlayer({
        ready: function(event) {
            $(this).jPlayer("setMedia", {
                title: "庞麦郎-我的滑板鞋",
                mp3: "http://ichangge-player-music.qiniudn.com/mp3/%E5%BA%9E%E9%BA%A6%E9%83%8E-%E6%88%91%E7%9A%84%E6%BB%91%E6%9D%BF%E9%9E%8B.mp3",
                oga: "http://ichangge-player-music.qiniudn.com/ogg/%E5%BA%9E%E9%BA%A6%E9%83%8E-%E6%88%91%E7%9A%84%E6%BB%91%E6%9D%BF%E9%9E%8B.ogg"
            });
        },
        swfPath: "scripts/lib/",
        solution: "html, flash",
        // solution: "flash",
        supplied: "mp3, oga",
        volume: 0.8,
        wmode: "window",
        cssSelectorAncestor: "#ichangge-player-container",
        smoothPlayBar: true,
        keyEnabled: true,
        remainingDuration: true,
        toggleDuration: true,
        loadstart: function(e) {
            log('Start loading...');
            if(navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
                console.log('detected iphone');
                changePlayButtonStyle(true);
            } else {
                changePlayButtonStyle(false);
            }
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
            changePlayButtonStyle(true);
        },
        play: function(e) {
            log('play');
            changePlayButtonStyle(false);
        },
        pause: function(e) {
            log('pause');
            changePlayButtonStyle(true);
        },
        durationchange: function(e) {
            log('duration change');
        }
    });

    function changePlayButtonStyle(canPlay) {
        if (canPlay) {
            $mainPlayer.find('.jp-play').find('i.fa-spin')
                .removeClass('fa-spinner fa-spin').addClass('fa-play');
        } else {
            $mainPlayer.find('.jp-play').find('i.fa-play')
                .removeClass('fa-play').addClass('fa-spinner fa-spin');
        }
    }

    function log(msg) {
        if (IS_DEBUG) {
            $('#logger').append('<p>' + msg + '</p>');
            console.debug(msg);
        } else {
            console.debug(msg);
        }
    }

});
