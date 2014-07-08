$(document).ready(function() {
    var IS_DEBUG = true;

    var $ghostPlayer = $("#ichangge-player"),
        $mainPlayer = $("#ichangge-player-container"),
        myPlayList;

    changePlayButtonStyle(true);
    $mainPlayer.find('.jp-pause').hide();

    $.getJSON('/playlist.json', function(data) {
        console.log(data);
        myPlayList = new jPlayerPlaylist({
            jPlayer: '#ichangge-player',
            cssSelectorAncestor: '#ichangge-player-container'
        }, data, {
            swfPath: "scripts/lib/",
            solution: "html, flash",
            // solution: "flash",
            supplied: "mp3, oga",
            volume: 0.8,
            wmode: "window",
            cssSelectorAncestor: "#ichangge-player-container",
            fullScreen: true,
            smoothPlayBar: true,
            keyEnabled: true,
            remainingDuration: true,
            toggleDuration: true,
            ready: function(e) {
                selectSong(0);
            },
            loadstart: function(e) {
                log('Start loading...');
                if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
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

    function selectSong(index) {
        var currentSong;
        if (index === 'next') {
            myPlayList.next();
        } else if (index === 'previous') {
            myPlayList.previous();
        } else {
            myPlayList.select(index);
        }
        currentSong = myPlayList.playlist[myPlayList.current];
        console.log(currentSong);
    }

    function resetDetail(song) {
        $mainPlayer
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
