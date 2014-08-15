$(document).ready(function() {
    var $ghostPlayer = $("#ichangge-player"),
        $mainPlayer = $("#ichangge-player-container"),
        myPlayList;


    $.getJSON('/playlist.json', function(data) {
        IChanggePlayer.init({
            playList: data
        });
    });
    
    window.test = function() {
        $.getJSON('/test.json', function(data) {
            IChanggePlayer.init({
                playList: data
            });
        });
    };
});
