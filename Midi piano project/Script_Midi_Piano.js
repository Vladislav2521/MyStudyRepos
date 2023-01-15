const audioContext = new AudioContext(); // Is this a constructor?

const NOTE_DETAILS = [
  { note: "C", key: "Z", frequency: 261.626, active: false },
  { note: "Db", key: "S", frequency: 277.183, active: false },
  { note: "D", key: "X", frequency: 293.665, active: false },
  { note: "Eb", key: "D", frequency: 311.127, active: false },
  { note: "E", key: "C", frequency: 329.628, active: false },
  { note: "F", key: "V", frequency: 349.228, active: false },
  { note: "Gb", key: "G", frequency: 369.994, active: false },
  { note: "G", key: "B", frequency: 391.995, active: false },
  { note: "Ab", key: "H", frequency: 415.305, active: false },
  { note: "A", key: "N", frequency: 440, active: false },
  { note: "Bb", key: "J", frequency: 466.164, active: false },
  { note: "B", key: "M", frequency: 493.883, active: false },
]; // It's important that we've used this global everywhere throughout our code. We're referencing this global object everywhere.

document.addEventListener("keydown", (e) => {
  if (e.repeat) return; // We check if event "keydown" executes repeatably, while key being holded down, if true, we ignore it.
  // return will immediately exit us from our function
  const keyboardKey = e.code; // Here we have the information about the key which is being pushed.
  const noteDetailConnected = getNoteDetail(keyboardKey); // Here we have our note and key being connected.
  if (noteDetailConnected == null) return; // When we press the key which is not in our array, we stop execution.
  noteDetailConnected.active = true; // If we press the key which in our array, we add the property "active" to our note from, the array.
  playNotes(); // This function is sets everything up and makes the noise based on all our active notes.
});

document.addEventListener("keyup", (e) => {
  const keyboardKey = e.code;
  const noteDetailConnected = getNoteDetail(keyboardKey);
  if (noteDetailConnected == null) return;
  noteDetailConnected.active = false; // We press down a key, we mark our note as (active) and we call the playNotes() function.
  playNotes();
});
// addEventListener("keyup") is served for stopping execution of addEventListener("keydown"), while we stop pushing the keyboardkey and release it.

// function getNoteDetail(keyboardKey) is used to connect keyboard buttons and objects in our NOTE_DETAILS array.
function getNoteDetail(keyboardKey) {
  return NOTE_DETAILS.find((n) => `Key${n.key}` === keyboardKey); // find() is going to allow us one individual note from our array of notes (NOTE_DETAILS)
} // <<<I DON'T CLEARLY UNDERSTAND `Key${n.key}`construction, WHY DO WE NEED this KEY string? Is it kinda connection with CSS?>>>
// NOTE_DETAILS = (n) and we wanna take `Key`which we have is that beginning of our note and we just append ${n.key} to it.
// So, ${n.key} is just the individual note we're checking for.
// The find() method will allow us to get one individual note from the array that is above.
// In conclusion, we creating a new string which has `Key` in the beginning and ${n.key} the actual note we're checking for.
// Then we add === keyboardKey, and if this is true then it's going to return that note that we're pressing, otherwise we're gonna get "undefined" being
// returned, saying we didn't actually press a note that we know what to deal with.

function playNotes() {
  NOTE_DETAILS.forEach((n) => {
    const keyElement = document.querySelector(`[data-note="${n.note}"`); // Here we connect our notes from (HTML class = "piano") with JS array NOTE_DETAILS and
    // we loop through our array (all our notes), apply the classes the active ones, to make them proper color.

    keyElement.classList.toggle("active", n.active); // toggle() allows us to turn smth on or off depending on our true, false variable.
    // We toggle the class "active" depending on if n.active is true or false.
    if (n.oscillator != null) {
      // <<I DON'T UNDERSTAND IT>>
      n.oscillator.stop(); // This is going to stop the noise.
      n.oscillator.disconnect(); // This is going to completely remove from our AudioContext.
      // If we have the current oscillator on our note, we stop playing it immediately. That we don't actually have multiple oscillators playing
      //the same note. So, we stop all the noises from our computer completely.
    }
  });
  // If (n.active) is undefined, whe're converting undefined to false.
  // WHY DO WE NEED THIS "active" string? I DON'T UNDERSTAND ("active, n.active || false")?
  // We want to toggle the class "active" depending on if (n.active) is true or false.
  const activeNotes = NOTE_DETAILS.filter((n) => n.active); //So if (active) is true there will be returned as one of these "activeNotes" here.
  // This is just getting us the list of notes that have (active) set to true. // We get to our activeNotes which are currently being pressed.
  const gain = 1 / activeNotes.length; // This is going to determine what percentage of volume we need to play at.
  // We divide 1 by the number of active notes that we have. If we have 1 note, this is gonna return 1(100% volume).
  // 1 divided by 2 is 0.5 (50%) and so on.
  activeNotes.forEach((n) => {
    // We loop through each of them, and then we actually start up the note.
    startNote(n, gain); // We're gonna pass it the actual note that we're trying to play here. Which is "n" in our case.
  });
}

function startNote(noteDetailConnected, gain) {
  const gainNode = audioContext.createGain(); // It determines the volume of the output.
  gainNode.gain.value = gain; // We're trying to reduce the volume based on how many notes we play.
  const oscillator = audioContext.createOscillator(); // This is going to give us the brand new oscillator. We need to hook it up with all the details
  // from our note.
  oscillator.frequency.value = noteDetailConnected.frequency; // For making the keys to play different frequency notes, we add "value" to "oscilator.frequency"
  oscillator.type = "square";
  oscillator.connect(gainNode).connect(audioContext.destination); // It tells the oscillator to play through our speakers.
  oscillator.start(); // This is going to start up our oscillator and make it to create noises.
  noteDetailConnected.oscillator = oscillator; // We're saving a reference to our note, so next time we call play notes we can stop it inside
  // playNotes() function using "if" statement.
  // We've taken the locally scoped variable inside the funciton "const oscillator", saved it to this
  // global variable "noteDetail", so we have access to it
}

// We hooked up this oscillator with all of the details of our note.
