IChanggePlayer
==============

IChangge Audio Player is based on [jPlayer](http://jplayer.org/) and [jPlayerPlaylist](http://jplayer.org/latest/demo-02-jPlayerPlaylist/) plugin, a cross platform jQuery plugin for playing audio.

# Get Started

    $ git clone https://github.com/ITEC-ELWG/IChanggePlayer.git
    $ cd IChanggePlayer
    $ npm install
    $ grunt

Then open your browser and visit `http://localhost:3000`

# Usage

Download the `dist` folder and include `css/ichangge-player.css`, `images/*`, `js/ichangge-player.js`, `js/Jplayer.swf` in your project. Remember including necessary javascript lib in your html(jQuery required):

    <script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
    <script src="/scripts/lib/ichangge-player.js"></script>

And then init the IChanggePlayer with the playlist JSON data:

    $.getJSON('/playlist.json', function(data) {
        IChanggePlayer.init({
            playList: data
        });
    });

# About playlist JSON

The playlist JSON(must be an array) requires the data format below:

    [
        {
            "artist": "Maroon 5",
            "title": "Maps",
            "mp3": "http://ichangge-player-music.qiniudn.com/mp3/Maroon5-Maps.mp3",
            "oga": "http://ichangge-player-music.qiniudn.com/ogg/Maroon5-Maps.ogg",
            "cover": "http://y3.ifengimg.com/00cd7cb92522610e/2012/0706/rdn_4ff6be881af21.jpg"
        }
    ]

The `oga` and `cover` fields are optional.

# Platforms and Browsers Support

* Windows: Chrome, Firefox, Internet Explorer, Safari, Opera
* Windows (legacy): IE6, IE7, IE8, IE9, IE10, IE11
* OSX: Safari, Firefox, Chrome, Opera
* iOS: Mobile Safari: iPad, iPhone, iPod Touch
* Android: Android 2.3 Browser
* Blackberry: OS 7 Phone Browser, PlayBook Browser

Only **Chrome, Firefox, IE, Safara, iPad/iPhone Safari/Chrome, Android Chrome** are tested in this project.
