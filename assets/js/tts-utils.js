/**
 * Utility to announce numbers.
 * RECOMMENDED APPROACH FOR PRODUCTION: 
 * Pre-record MP3s for digits and play them in sequence. 
 * Browser TTS Arabic support is highly unreliable.
 */

export function announceNumber(number) {
    // APPROACH 1: Using Browser Web Speech API (Live TTS)
    const synth = window.speechSynthesis;
    if (!synth) return;

    // We spell the number out digit by digit for clarity in queue systems (e.g. "Numéro Cinq Cinq")
    const numStr = number.toString();
    const splitNum = numStr.split('').join(' '); // "5 5"

    const utteranceAr = new SpeechSynthesisUtterance(`رقم ${splitNum}`);
    utteranceAr.lang = 'ar-SA';
    utteranceAr.rate = 0.8;

    const utteranceFr = new SpeechSynthesisUtterance(`Numéro ${splitNum}`);
    utteranceFr.lang = 'fr-FR';
    utteranceFr.rate = 0.8;

    // Check if Arabic voice is available
    const voices = synth.getVoices();
    const hasArabic = voices.some(v => v.lang.startsWith('ar'));

    if (hasArabic) {
        synth.speak(utteranceAr);
        utteranceAr.onend = () => synth.speak(utteranceFr);
    } else {
        // Fallback directly to French if Arabic is unsupported on this display hardware
        synth.speak(utteranceFr);
    }

    /* // APPROACH 2: Pre-Recorded Fallback (Uncomment to use)
    // Needs audio files in assets/audio/fr/5.mp3, etc.
    async function playPreRecorded(numStr) {
       for(let digit of numStr.split('')) {
           const audio = new Audio(`assets/audio/ar/${digit}.mp3`);
           await new Promise(r => { audio.onended = r; audio.play(); });
       }
    }
    */
}

// Warm up the voices
window.speechSynthesis.getVoices();
