const play = document.querySelector('.play');
const audio = document.querySelector('.music');
const next = document.querySelector('.next');
const back = document.querySelector('.back');
const loopBtn = document.querySelector('.loop');
const progressBar = document.getElementById('progressBar');
const currentTimeDisplay = document.getElementById("currentTimeDisplay");
const durationTimeDisplay = document.getElementById("durationTimeDisplay");
const songListContainer = document.querySelector('.songList');
const volumeButton = document.getElementById('volumeButton');
const volumeSlider = document.getElementById('volumeSlider');
const cover = document.getElementById("cover");
const coverName = document.getElementById("coverName")
const menu = document.querySelector('.menu')
const main = document.querySelector('.main')
const songListDiv = document.querySelector('.songListDiv')

// List of songs
const songs = [
    {
        name : "Fall on Grass 2",
        file : "songs/Fall on Grass remake.mp3",
        image : "covers/Fall on Grass 2.jpg"
    },
    {
        name : "Fall on Grass",
        file : "songs/Fall on Grass.mp3",
        image : "covers/Fall on Grass new.JPG"
    },
    {
        name : "Airtel (Orchestral Version)",
        file : "songs/airtel.mp3",
        image : "covers/Airtel.png"
    },
    {
        name : "Vaz Deir",
        file : "songs/phonk.mp3",
        image : "covers/Vaz Deir.jpg"
    },
    {
        name : "Existence",
        file : "songs/something.wav",
        image : "covers/Existence.jpg"
    },
    {
        name : "Rise of Dawn",
        file : "songs/Credits.mp3",
        image : "covers/rISE OF dAWN.jpg"
    },
    {
        name : "Hope",
        file : "songs/Hope.mp3",
        image : "covers/Hope.jpg"
    },
    {
        name : "Wind of Fire",
        file : "songs/intense.mp3",
        image : "covers/Wind of fire.jpg"
    },
    {
        name : "Underground Lad",
        file : "songs/hahahahahaha.mp3",
        image : "covers/Underground Lad.png"
    },
    {
        name : "Night Rose",
        file : "songs/Project_8.mp3",
        image : "covers/Night Rose.png"
    },
    {
        name : "Occult Evil",
        file : "songs/Rap.mp3",
        image : "covers/Occult Evil.jpg"
    },
    {
        name : "Toota jo Kabhi Taara (Acoustic)",
        file : "songs/Taara.mp3",
        image : "covers/Toota jo kabhi taara instrumental.png"
    },
    {
        name : "Koi Lamha",
        file : "songs/untitled.mp3",
        image : "covers/Koi Lamha.jpg"
    }
]

let currentIndex = 0;   //Index of Song
let isPlaying = false;  //Check weather anything is playing or not
let loopIndex = 0;      //Index of the loop i.e., either off, single or all loop
let songButtons = [];   //Array of all the songs
let isOpen = false;

// To switch between 'off', 'on' or 'all' loop
loopBtn.addEventListener('click', () => {
    loopIndex = (loopIndex + 1) % 3

    // If loop is off
    if(loopIndex === 0){
        loopBtn.innerText = '✖ '
        audio.loop = false;
    }
    // If loop is on
    else if (loopIndex === 1){
        loopBtn.innerText = '➰ '
        audio.loop = true;
    }
    // Iff loop is all
    else{
        loopBtn.innerText = '➿ '
        audio.loop = false;
    }
})

volumeButton.addEventListener('click', () => {
    volumeSlider.style.display = volumeSlider.style.display === "flex" ? "none" : "flex"
})

volumeSlider.addEventListener("input", function() {
    audio.volume = this.value;
    if(audio.volume === 0){
        volumeButton.innerText = "🔇"
    }
    else{
        volumeButton.innerText = "🔊"
    }
})

// Function to load song in audio src
function loadSong(index){
    audio.src = songs[index].file;
    cover.src = songs[index].image;
    coverName.textContent = songs[index].name;
    console.log(cover);
    currentIndex = index;
    updateActiveSong();
}

// Function for all the elements when a song is playing
function playSong(){
    audio.play();
    isPlaying = true;
    play.innerText = '⏸';
}

// Function for all the elements when a song is paused
function pauseSong(){
    audio.pause();
    isPlaying = false;
    play.innerText = '▶';
}

loadSong(currentIndex);

function updateActiveSong(){
    songButtons.forEach((button, idx) => {
        button.classList.toggle("active", idx === currentIndex);
    })
}

function restartAudio() {
  audio.currentTime = 0;
  audio.play();
  play.innerText = '⏸';
  isPlaying = true;
}

// To toggle between play and pause
play.addEventListener('click', () => {
    isPlaying ? pauseSong() : playSong();
    updateActiveSong();
});

// To skip next
next.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % songs.length;
    loadSong(currentIndex)
    playSong();
    // updateActiveSong();
})

// To skip back
back.addEventListener('click', () => {
    if(audio.currentTime < 7){
        currentIndex = (currentIndex - 1 + songs.length) % songs.length;
        loadSong(currentIndex)
        playSong();
        // updateActiveSong();
    }
    else{
        restartAudio();
    }
})

// To play every song and loop back or to pause if the loop is off after a song ends
audio.addEventListener('ended', () => {
    if(loopIndex === 2){
        currentIndex = (currentIndex + 1) % songs.length;
        loadSong(currentIndex);
        playSong();
    }
    else{
        pauseSong();
    }
})


audio.addEventListener('timeupdate', () => { // timeupdate - runs frequently while the audio plays
    const progress = (audio.currentTime / audio.duration) * 100; // Convert the values on progress bar per cent
    progressBar.value = progress || 0; // Value will be either progress or zero when nothing is playing
})

// Handles the input given by the user to jump anywhere on the progress bar on a specific time
progressBar.addEventListener('input', () => {
    const seekTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
})

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Update time display during playback
audio.addEventListener("timeupdate", () => {
  const current = formatTime(audio.currentTime);
  const duration = formatTime(audio.duration || 0);
  currentTimeDisplay.textContent = `${current}`;
  durationTimeDisplay.textContent = `${duration}`
});

// Generate buttons for each song
songs.forEach((song, index) => {
    const button = document.createElement("div");
    button.classList.add('song-item');

    button.innerHTML = `
        <img src = "${song.image}" alt = "cover"/>
        <span>${song.name}</span>
    `
    button.addEventListener("click", () => {
        loadSong(index);
        playSong();
    });

    songButtons.push(button)
    songListContainer.appendChild(button)

    updateActiveSong();
})

menu.addEventListener('click', () => {
    if(isOpen === false){
        songListDiv.style.transform = "translateX(0px)"
        // menu.style.transform = "translateX(400px)"
        isOpen = true
        main.style.transform = 'translateX(200px)'
    }
    else{
        songListDiv.style.transform = "translateX(-400px)"
        // menu.style.transform = "translateX(0px)"
        main.style.transform = 'translateX(0px)'
        isOpen = false
    }
})