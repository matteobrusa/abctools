"use strict"; 

const sharpNotes= ["c", "^c", "d", "^d", "e", "f", "^f", "g", "^g", "a", "^a", "b" ]
const flatNotes= ["c", "_d", "d", "_e", "e", "f", "_g", "g", "_a", "a", "_b", "b" ]

const sharpMajSigs= ["G", "D", "A", "E", "B", "F#"]
const sharpMinSigs= ["Emin", "Bmin", "F#min", "C#min", "G#min", "D#min"]
const sharps= [6,1,8,3,10,5]
const flatMajSigs= ["F", "Bb", "Eb", "Ab", "Db", "Gb"]
const flatMinSigs= ["Dmin", "Gmin", "Cmin", "Fmin", "Bbmin", "Ebmin"]
const flats= [10,3,8,1,6,11]

////////////////////////////////////////////////////////////
//
// get the signature from the textarea
//
////////////////////////////////////////////////////////////
function getHeaderValue(key) {
    var regex=  new RegExp("^" + key + ":(.*)", "m");
    var matches= gTheABC.value.match(regex)
    if ( matches.length>1 ){
        var result= matches[1].trim() // skip key and colon
        //console.log("Header "+ key+ " has value: "+ result)
        return result
    }
    return null
} 
function getSignature() {
    var sig= getHeaderValue("K")
    if ( sig === null )
        return "C" // assume Cmaj by default
     
    console.log("Declared signature: "+ sig)
    return sig 
} 

////////////////////////////////////////////////////////////
//
// translate from MIDI index to ABC note
//
////////////////////////////////////////////////////////////
function lookupAbcNote(index, useFlat) {

    var pos= index % 12 // numerical note in the octave
    var octave= Math.floor(index/12) // C0 = 0
 
    var note= useFlat ? flatNotes[pos] : sharpNotes[pos]

    if (octave < 5) {
        note= note.toUpperCase()
        var commas= 4-octave
        note= note + ",".repeat(commas)
    }
    else {
        var apos= octave - 5
        note= note + "'".repeat(apos)
    }

    return note
}

////////////////////////////////////////////////////////////
//
// this function OVERRIDES and extends the one defined in app.js
//
////////////////////////////////////////////////////////////
function getMIDI_note_name(note) {
    console.log("Note index: " + note)

    var sig= getSignature()
    var index= (parseInt(note) -12) // start from C0
    var pos= index % 12 // numerical note in the octave

    var modifier= 0
    var prefix= ""

    // walk the circle of fifths to find if the note is in the sig, 
    // and modify it accordingly 
    // from https://en.wikipedia.org/wiki/Key_signature#/media/File:Circle_of_fifths_deluxe_4.svg
    // TODO: add minor signatures 

    var i= sharpMajSigs.indexOf(sig) // is it a major sharp sig?
    if (i<0) i= sharpMinSigs.indexOf(sig) // or the equivalent minor?
    if (i>=0) {
        var shs= sharps.slice(0,i+1) // get the sharps for this sig

        if (shs.includes(pos)) 
            modifier-- // remove sharp since it's already in the sig
        else if (shs.includes(pos+1)) // naturals precede sharps
            prefix="=" // add natural to override the sig
  
    }

    i= flatMajSigs.indexOf(sig) // flat sig?
    if (i<0) i= flatMinSigs.indexOf(sig) // or the equivalent minor?
    var isFlat= i>=0
    if (isFlat) {
        var fls= flats.slice(0,i+1) // get the flats for this sig

        if (fls.indexOf(pos)!=-1)
            modifier++ // remove flat since it's already in the sig
        else if (fls.includes(pos-1)) // naturals follow flats
            prefix="=" // add natural to override the sig
  
    }

    var result= prefix+ lookupAbcNote (index + modifier, isFlat)
    
    console.log("MIDI index: " + index + 
                "   Original note: " + lookupAbcNote (index, isFlat) + 
                "   in signature: " + result)
                        
    return result
}





/*const MIDI_note_map_full = {
    "36":"C,,",
    "37":"^C,,",
    "38":"D,,",
    "39":"^D,,",
    "40":"E,,",
    "41":"F,,",
    "42":"^F,,",
    "43":"G,,",
    "44":"^G,,",
    "45":"A,,",
    "46":"^A,,",
    "47":"B,,",        
    "48":"C,",
    "49":"^C,",
    "50":"D,",
    "51":"^D,",
    "52":"E,",
    "53":"F,",
    "54":"^F,",
    "55":"G,",
    "56":"^G,",
    "57":"A,",
    "58":"^A,",
    "59":"B,",
    "60": "C",
    "61":"^C",
    "62":"D",
    "63":"^D",
    "64":"E",
    "65":"F",
    "66":"^F",
    "67":"G",
    "68":"^G",
    "69":"A",
    "70":"^A",
    "71":"B",
    "72":"c",
    "73":"^c",
    "74":"d",
    "75":"^d",
    "76":"e",
    "77":"f",
    "78":"^f",
    "79":"g",
    "80":"^g",
    "81":"a",
    "82":"^a",
    "83":"b",
    "84":"c'",
    "85":"^c'",
    "86":"d'",
    "87":"^d'",
    "88":"e'",
    "89":"f'",
    "90":"^f'",
    "91":"g'",
    "92":"^g'",
    "93":"a'",
    "94":"^a'",
    "95":"b'",
    "96":"c''"
};
function testTran() {
    for (var i=84; i<=96; i++) {
        
        var ref= MIDI_note_map_full[i]
        var calc= MIDI_toAbc(i, false)

        if (ref!=calc)
            console.err("note: "+i + "  ref: "+ ref + "  calc: "+ calc)
    }
}
*/