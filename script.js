const form = document.querySelector('form');
const resultDiv = document.querySelector('.result');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const word = form.elements[0].value;
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await response.json();
    console.log(data);

    if (data.length === 0) {
      resultDiv.innerHTML = `<p>No results found for '${word}'</p>`;
      return;
    }

    const wordInfo = data[0];

    // Display word information in the resultDiv
    let definitions = wordInfo.meanings[0].definitions[0];
    resultDiv.innerHTML = `<h2><strong>Word: </strong>${wordInfo.word}</h2>
      <p class="partOfSpeech"><strong>Part of Speech: </strong>${wordInfo.meanings[0].partOfSpeech}</p>
      <p><strong>Meaning: </strong>${definitions.definition || "Not Found"}</p>
      <p><strong>Example: </strong>${definitions.example || "Not Found"}</p>
      <p><strong>Synonyms: </strong>${definitions.synonyms && definitions.synonyms.length > 0 ? definitions.synonyms.join(', ') : "Not Found"}</p>`;

    // Phonetics information
    if (wordInfo.phonetics && wordInfo.phonetics.length > 0) {
      const phonetics = wordInfo.phonetics[0].text;
      resultDiv.innerHTML += `<p><strong>Phonetics: </strong>${phonetics}</p>`;
      
    } else {
      resultDiv.innerHTML += `<p>Phonetics not available for this word.</p>`;
    }

    // Button to speak the word
    resultDiv.innerHTML += `<div><button id="speakWordButton">Speak Word</button></div>`;

    // Add event listener to speak the word when the button is clicked
    document.getElementById('speakWordButton').addEventListener('click', () => {
      responsiveVoice.speak(word, 'UK English Female', { rate: 0.8 });
    });

  } catch (error) {
    resultDiv.innerHTML = `<p>Sorry, an error occurred while fetching the word information.</p>`;
  }
});
