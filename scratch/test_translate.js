const text = "Conectează-te";
const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ro&tl=en&dt=t&q=${encodeURIComponent(text)}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log("Translation response:", JSON.stringify(data));
    console.log("Translated text:", data[0][0][0]);
  })
  .catch(err => console.error("Error:", err));
