document.addEventListener("DOMContentLoaded", () => {
    verovio.module.onRuntimeInitialized = process;
});

function process() {
    const tk = new verovio.toolkit();
    tk.setOptions({
        svgAdditionalAttribute: ["note@pname", "note@oct"],
        breaks: "none"
    });

    let notes; let i;

    function readData(data) {
        tk.loadZipDataBuffer(data);
        document.getElementById("notation").innerHTML = tk.renderToSVG(1); 
        notes = document.getElementById("notation").querySelectorAll("g.note");
        i = -1;
    }

    input.addEventListener("change", () => {
        for (const file of input.files) {
            const reader = new FileReader();
            reader.addEventListener("load", (e) => {readData(e.target.result)});
            reader.readAsArrayBuffer(file);
        }
    });

    fetch("Beethoven__Symphony_No._9__Op._125-Clarinetto_1_in_C_(Clarinet) - Copy - Copy (2).mxl")
    .then( response => response.arrayBuffer() )
    .then( data => {readData(data);} )
    .catch( e => {console.log( e );} );

    function hightlightNextNote() {     
        // Remove the attribute 'playing' of all notes previously playing
        let playingNotes = document.querySelectorAll('g.note.playing');
        for (let playingNote of playingNotes) {
            playingNote.classList.remove("playing");
        }
        i++;
        if (i < notes.length) {
            notes[i].classList.add("playing");
        }
    }

    document.addEventListener("keydown", hightlightNextNote);
}