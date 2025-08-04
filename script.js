const btn = document.querySelector('.btn');
const lens = document.querySelector('.lens');
const whiteFlash = document.getElementById('white-flash');
const blueFlash = document.getElementById('blue-flash');
const sensor = document.querySelector('.sensor1');
const sensorlight = document.getElementById('red1');
const play = document.querySelector('.play');
const audio = document.querySelector('.music');
const next = document.querySelector('.next');
const back = document.querySelector('.back');
const loopBtn = document.querySelector('.loop');
const progressBar = document.getElementById('progressBar');
const timeDisplay = document.getElementById("timeDisplay");
const songListContainer = document.querySelector('.songList');

// To change the theme of the panel bar on top of the screen
btn.addEventListener('click', function(){
    btn.classList.toggle('active')
})

// To create a moving reflection in the lens of the camera
lens.addEventListener('mouseenter', () => {
    whiteFlash.style.transform = 'translateX(6px)';
    blueFlash.style.transform = 'translateX(-1px)';
    
})
lens.addEventListener('mouseleave', () => {
    whiteFlash.style.transform = 'translateX(0px)';
    blueFlash.style.transform = 'translateX(0px)';
})

// To turn on the sensor light on the panel bar
sensor.addEventListener('mouseenter', () => {
    sensorlight.style.opacity = 1;
})
sensor.addEventListener('mouseleave', () => {
    sensorlight.style.opacity = 0;
})

// List of songs
const songs = [
    {name : "Fall on Grass 2", file : "songs/Fall on Grass remake.mp3", image : "covers/Fall on Grass 2.jpg"},
    {name : "Fall on Grass", file : "songs/Fall on Grass.mp3", image : "covers/Fall on Grass new.JPG"},
    {name : "Airtel (Orchestral Version)", file : "songs/airtel.mp3", image : "covers/Airtel.png"},
    {name : "Vaz Deir", file : "songs/phonk.mp3", image : "covers/Vaz Deir.jpg"},
    {name : "Existence", file : "songs/something.wav", image : "covers/Existence.jpg"},
]

let currentIndex = 0;   //Index of Song
let isPlaying = false;  //Check weather anything is playing or not
let loopIndex = 0;      //Index of the loop i.e., either off, single or all loop
let songButtons = [];

// To switch between 'off', 'on' or 'all' loop
loopBtn.addEventListener('click', () => {
    loopIndex = (loopIndex + 1) % 3

    // If loop is off
    if(loopIndex === 0){
        loopBtn.innerText = 'Loop : Off '
        audio.loop = false;
    }
    // If loop is on
    else if (loopIndex === 1){
        loopBtn.innerText = 'Loop : On '
        audio.loop = true;
    }
    // Iff loop is all
    else{
        loopBtn.innerText = 'Loop : All '
        audio.loop = false;
    }
})

// Function to load song in audio src
function loadSong(index){
    audio.src = songs[index].file;
    currentIndex = index;
    updateActiveSong();
}

// Function for all the elements when a song is playing
function playSong(){
    audio.play();
    isPlaying = true;
    play.innerText = 'Pause';
}

// Function for all the elements when a song is paused
function pauseSong(){
    audio.pause();
    isPlaying = false;
    play.innerText = 'Play';
}

loadSong(currentIndex);

function updateActiveSong(){
    songButtons.forEach((button, idx) => {
        button.classList.toggle("active", idx === currentIndex);
    })
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
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadSong(currentIndex)
    playSong();
    // updateActiveSong();
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
  timeDisplay.textContent = `${current} / ${duration}`;
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

