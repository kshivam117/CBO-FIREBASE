document.addEventListener('DOMContentLoaded', () => {

    var isFirstVideo = true;

    // This is the bare minimum JavaScript. You can opt to pass no arguments to setup.
    const player = new Plyr('#player');

    // Expose
    window.player = player;

    // Bind event listener
    function on(selector, type, callback) {
        document.querySelector(selector).addEventListener(type, callback, false);
    }

    // Play
    on('.js-play', 'click', () => {
        player.play();
    });

    // Pause
    on('.js-pause', 'click', () => {
        player.pause();
    });

    // Stop
    on('.js-stop', 'click', () => {
        player.stop();
    });

    // Rewind
    on('.js-rewind', 'click', () => {
        player.rewind();
    });

    // Forward
    on('.js-forward', 'click', () => {
        player.forward();
    });


    // switch
    on('.js-switch', 'click', () => {

        player.source = getSource(isFirstVideo);
        player.play();
        isFirstVideo = !isFirstVideo;

    });


    on('.js-show-control', 'click', () => {
        showControls(true)

    });


    on('.js-hide-control', 'click', () => {

        showControls(false)
    });


});

function showControls(shouldShowControls) {
    if (shouldShowControls) {
        $(".plyr__controls").show()
    } else {
        $(".plyr__controls").hide()
    }
}

function timeoutJump(durationInSecond) {
    setTimeout(function() {
        player.currentTime = durationInSecond;

    }, 5000);
}


function getSource(isFirstVideo) {
    return {
        type: 'video',
        title: 'Example title',
        sources: [{
            src: isFirstVideo ? 'https://vjs.zencdn.net/v/oceans.mp4' : 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4',
            type: 'video/webm',
            size: 720,
        }],
        poster: '/path/to/poster.jpg'
    };
}