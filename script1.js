let currentSong = new Audio();
let songs;
let currfolder

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = [];
    gana = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1].replaceAll("%20", " "));
            gana.push(element.href.split(`/${folder}/`)[1].replaceAll("%20", " ")); 
        }
    }
    let songul = document.querySelector(".songlist ul"); // Fixed query selector
    songul.innerHTML = ""; // Clear previous entries to avoid duplication

    for (const song of songs) {
        songul.innerHTML += `
            <li>
                <img class="invert" width="34" src="/images/music.svg">
                <div class="info">
                    <div>${song}</div>
                    <div></div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert playButton" src="/images/play.svg" width="30px">
                </div>
            </li>
        `;
    }
 // Move event listeners outside the loop to avoid multiple bindings
    document.querySelectorAll(".songlist li").forEach(e => {
        e.addEventListener("click", () => {
            let trackName = e.querySelector(".info div:first-child").innerText.trim();
            playMusic(trackName);

        });
    });

}
const playMusic = (track, pause = false) => {
    currentSong.src = `/${currfolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "/images/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
    currentSong.play();
};

async function main() {
    await getSongs("songs/karan");
    console.log(songs);
    playMusic(songs[0], true);
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "/images/pause.svg"
        }
        else {
            currentSong.pause();
            play.src = "/images/play.svg"
        }
    })
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = (currentSong.duration * percent) / 100
    })
    previous.addEventListener("click", () => {
        let j = currentSong.src.split("/").slice(-1)[0]
        console.log(currentSong.src)
        let k = j.replaceAll("%20", " ")
        let index = gana.indexOf(k);
        if ((index - 1) >= 0) {
            playMusic(gana[index - 1])
        }
        else {
            playMusic(gana[0])
        }
    })
    next.addEventListener("click", () => {
        let j = currentSong.src.split("/").slice(-1)[0]
        let k = j.replaceAll("%20", " ")
        let index = gana.indexOf(k);
        if ((index + 1) < gana.length) {
            playMusic(gana[index + 1])
        }
        else {
            playMusic(gana[0])
        }
    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
    })
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })
    document.getElementById("vol").addEventListener("click", () => {
        if (currentSong.volume > 0) {
            currentSong.volume = 0;
            vol.src = "/images/mute.svg"
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            currentSong.volume = 0.5;
            vol.src = "/images/volume.svg"
            document.querySelector(".range").getElementsByTagName("input")[0].value = 50;
        }
    })
    currentSong.addEventListener("timeupdate",()=>{
    if(currentSong.currentTime== currentSong.duration){
        let j = currentSong.src.split("/").slice(-1)[0]
        let k = j.replaceAll("%20", " ")
        let index = gana.indexOf(k);
        if ((index + 1) < gana.length) {
            playMusic(gana[index + 1])
        }
    }
    })
}
main();