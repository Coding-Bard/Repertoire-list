
class Song {
    constructor(songName, author, minutes, seconds, duration) {
        this.songName = songName;
        this.author = author;
        this.minutes = minutes;
        this.seconds = seconds;
        this.duration = duration;
    }
}


class UI {
    addSongToList(song) {
        //Creating tr element
        let tr = document.createElement('tr');
        //Adding parameters to tr
        tr.innerHTML = `
            <th>${song.songName}</th>
            <th>${song.author}</th>
            <th>${song.minutes}:${song.seconds}</th>
            <th><a class="delete primary" href="#">X</a>
        `;
        //Taking parent element to insert song
        let songList = document.querySelector('.song-list');
        songList.appendChild(tr);
    }

    durationOutput(minutes, seconds) {
        const durationOutput = document.querySelector('.durationOutput');

        durationOutput.textContent = `Total Duration ${minutes}:${seconds}`;
    }

    removeSong(song) {
        song.remove();
    }

    showAlert(message, className) {
        //Creating div for alert
        let div = document.createElement('div');
        //Inserting message
        div.appendChild(document.createTextNode(message));
        //Adding class to div
        div.className = `alert ${className}`;

        let form = document.querySelector('#song-form');
        document.querySelector('.container').insertBefore(div, form);

        setTimeout(() => {
            div.remove();
        },3000);
    }
}



//Local Storage

class Store {

    static getSongs() {
        let songs;
        if(localStorage.getItem('songs') === null) {
            songs = [];
        } else {
            songs = JSON.parse(localStorage.getItem('songs'));
        }
        return songs;
    }

    static addSong(song) {
        let songs = Store.getSongs();
        songs.push(song);
        localStorage.setItem('songs', JSON.stringify(songs));
    }

    static displaySongs() {
        
        let songs = Store.getSongs();
        songs.forEach((song) => {
            const ui = new UI;
            ui.addSongToList(song)
        });

    }

    static displayDuration() {
        let songs = Store.getSongs();
        let seconds = 0;
        let minutes = 0;
        songs.forEach(song => {
            seconds += song.duration;
        });

        while(seconds - 60 > 0) {
            minutes++;
            seconds -= 60;
            
        }

        let ui = new UI;

        ui.durationOutput(minutes, seconds);
    }

    static removeSong(index) {
        let songs = Store.getSongs();
        songs.splice(index, 1);
        localStorage.setItem('songs', JSON.stringify(songs));
    }

}


document.addEventListener('DOMContentLoaded', Store.displaySongs);

//localStorage.clear();

document.querySelector('#song-form').addEventListener('submit', (e) => {
     //Taking all parameters
    const songName = document.querySelector('.song').value;
    const author = document.querySelector('.author').value;
    let minutes = document.querySelector('.minutes').value;
    let seconds = document.querySelector('.seconds').value;
    let durationInSeconds = (Number(minutes) * 60) + Number(seconds);

    let ui = new UI;

    //Checking input
    //If any field is empty throw an error
    if(songName === '' || author === '' || minutes === '' || seconds === ''){
        ui.showAlert('All fields must be filled', 'error');
    } else if (minutes.length > 2 || seconds.length > 2) {
        ui.showAlert('Max two character length', 'error');
    }else if(Number(minutes) > 59 || Number(seconds) > 59 || isNaN(Number(minutes)) || isNaN(Number(seconds))) {
        ui.showAlert('For duration choose number between 0 and 59', 'error');
    } else {
        //Formating duration
        if(minutes.length === 1) {
            minutes = '0' + minutes;
        } 
        if(seconds.length === 1) {
            seconds = '0' + seconds;
        }
        //Creating song
        let song = new Song(songName, author, minutes, seconds, durationInSeconds);
        //Adding Song to UI
        ui.addSongToList(song);
        Store.addSong(song);
        ui.showAlert('Song added!', 'success');
        document.querySelector('.song').value = '';
        document.querySelector('.author').value = '';
        document.querySelector('.minutes').value = '';
        document.querySelector('.seconds').value = '';
    }
    e.preventDefault();
});

//Remove Song

document.querySelector('.song-list').addEventListener('click', (e) => {
    let ui = new UI;
    if(e.target.classList.contains('delete')) {
        let songName = e.target.parentElement.parentElement.children[0].innerText;
        let songs = Store.getSongs();
      
        songs.forEach((song, index) => {
            if(song.songName === songName) {
                Store.removeSong(index);
                ui.showAlert('Song deleted!', 'danger');
            }
        });
        ui.removeSong(e.target.parentElement.parentElement);
    } 
    e.preventDefault();
});


//Get duration
document.querySelector('.btnDuration').addEventListener('click', (e) => {
Store.displayDuration();
});



