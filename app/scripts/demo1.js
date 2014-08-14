$(document).ready(function() {
    var IS_DEBUG = true;

    var $ghostPlayer = $("#ichangge-player"),
        $mainPlayer = $("#ichangge-player-container"),
        myPlayList;

    changePlayButtonStyle(true);


    $.getJSON('/playlist.json', function(data) {
        console.log(data);
        initPlayListView(data);

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

    function selectSong(index, canPlay) {
        var currentSong;
        if (index === 'next') {
            myPlayList.next();
        } else if (index === 'previous') {
            myPlayList.previous();
        } else {
            if (canPlay) {
                myPlayList.play(index);
            } else {
                myPlayList.select(index);
            }
        }
        currentSong = myPlayList.playlist[myPlayList.current];
        console.log(currentSong);
    }

    function initPlayListView(playList) {
        var playListHeight = 400,
            $playList = $mainPlayer.find('.jp-playlist'),
            itemTemplate = '<li><div><a href="javascript:void(0);" class="jp-playlist-item">' + 
                '<p>{{artist}}-{{title}}' + 
                '<span class="jp-playlist-duration pull-right">{{duration}}</span>' + 
                '</p></a></div></li>',
            item, i;

        // 点击打开播放列表按钮事件
        $mainPlayer.on('click', '.jp-eject', function() {
            if ($(this).attr('data-toggle') === 'false') {
                $('.jp-playlist').animate({
                    opacity: 1,
                    top: -$playList.outerHeight()
                }, 500);
                $(this).attr('data-toggle', 'true');
            } else {
                $('.jp-playlist').animate({
                    opacity: 0,
                    top: 0
                }, 500);
                $(this).attr('data-toggle', 'false');
            }
        });

        // 点击播放列表选项事件
        $mainPlayer.find('.jp-playlist').on('click', '.jp-playlist-item', function() {
            selectSong(parseInt($(this).attr('index')), true);
        });

        for (i = 0; i < playList.length; i++) {
            item = itemTemplate.replace(/{{(\w*)}}/g, function(m, key) {
                return playList[i][key] || '';
            });
            // $playList.append($(item).attr('index', i));
        }
    }

    function log(msg) {
        if (IS_DEBUG) {
            $('#logger').prepend('<p>' + msg + '</p>');
            console.debug(msg);
        } else {
            console.debug(msg);
        }
    }

});
