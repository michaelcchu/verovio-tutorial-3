function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:audio/midi;base64,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }

function start() {
    const tk = new verovio.toolkit();
    console.log("Verovio has loaded!");
    tk.setOptions({
        svgAdditionalAttribute: ["note@pname", "note@oct"],
        breaks: "none"
    });
    console.log("Verovio options:", tk.getOptions());
    console.log("Verovio default options:", tk.getDefaultOptions());
    fetch("https://www.verovio.org/examples/downloads/Schubert_Lindenbaum.mei")
    .then( (response) => response.text() )
    .then( (meiXML) => {
        tk.loadData(meiXML);
        document.getElementById("notation").innerHTML += tk.renderToSVG(1); 
        
        const notes = document.getElementById("notation").querySelectorAll("g.note");
        let i = -1;

        function hightlightNextNote() {        
            // Remove the attribute 'playing' of all notes previously playing
            let playingNotes = document.querySelectorAll('g.note.playing');
            for (let playingNote of playingNotes) playingNote.classList.remove("playing");
            i++;
            notes[i].classList.add("playing");
        }
    
        document.addEventListener("keydown", hightlightNextNote);    
    });



    let currentPage = 1;

    const midiHightlightingHandler = function (event) {
        // Remove the attribute 'playing' of all notes previously playing
        let playingNotes = document.querySelectorAll('g.note.playing');
        for (let playingNote of playingNotes) playingNote.classList.remove("playing");
        // Get elements at a time in milliseconds (time from the player is in seconds)
        let currentElements = tk.getElementsAtTime(event.time * 1000);
        if (currentElements.page == 0) return;
        if (currentElements.page != currentPage) {
            currentPage = currentElements.page;
            document.getElementById("notation").innerHTML = tk.renderToSVG(currentPage);
        }
        // Get all notes playing and set the class
        for (note of currentElements.notes) {
            let noteElement = document.getElementById(note);
            if (noteElement) noteElement.classList.add("playing");
        }
    }

    MIDIjs.player_callback = midiHightlightingHandler;
    
    function saveMIDIHandler() {
        let base64midi = tk.renderToMIDI();
        download("output.mid",base64midi);
    }
    function playMIDIHandler() {
        let base64midi = tk.renderToMIDI();
        let midiString = 'data:audio/midi;base64,' + base64midi;
        MIDIjs.play(midiString);
    }

    function stopMIDIHandler() {
        MIDIjs.stop();
    }

    document.getElementById("saveMIDI").addEventListener("click", saveMIDIHandler);
    document.getElementById("playMIDI").addEventListener("click", playMIDIHandler);
    document.getElementById("stopMIDI").addEventListener("click", stopMIDIHandler);
}

document.addEventListener("DOMContentLoaded", () => {
    verovio.module.onRuntimeInitialized = start;
})