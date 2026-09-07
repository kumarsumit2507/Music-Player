let timeline = document.getElementById("music-timeline");
let song = document.getElementById("song");
let ctrlBtn = document.getElementById("play-pause");
let musicImg = document.querySelector(".music-img");
let waveBox = document.querySelector(".box");

// Set the timeline maximum duration once audio metadata loads
song.onloadedmetadata = function () {
    timeline.max = song.duration;
    timeline.value = song.currentTime;
};

// Automatically update the timeline position as the audio plays
song.ontimeupdate = function () {
    timeline.value = song.currentTime;
};

// Seek audio position when dragging/clicking the timeline
timeline.oninput = function () {
    song.currentTime = timeline.value;
};

// Toggle audio play/pause state and icon text
function playPause() {
    let iconSpan = ctrlBtn.querySelector("span");

    if (iconSpan.textContent.trim() === "pause") {
        song.pause();
        iconSpan.textContent = "play_arrow";

        musicImg.classList, remove("is-playing");
        waveBox.classList, remove("is-playing");
    } else {
        song.play();
        iconSpan.textContent = "pause";

        musicImg.classList.add("is-playing");
        waveBox.classList.add("is-playing");
    }
}





// Reset icon back to play when the song finishes naturally
song.onended = function () {
    let iconSpan = ctrlBtn.querySelector("span");
    iconSpan.textContent = "play_arrow";
    timeline.value = 0;
};