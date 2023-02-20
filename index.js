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
}

document.addEventListener("DOMContentLoaded", () => {
    verovio.module.onRuntimeInitialized = start;
})