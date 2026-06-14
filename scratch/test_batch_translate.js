const strings = ["Bun venit", "Deconectare", "Caută șofer"];
const combinedText = strings.join("\n");
const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ro&tl=en&dt=t&q=${encodeURIComponent(combinedText)}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log("Raw response:", JSON.stringify(data));
    const translatedText = data[0].map(item => item[0]).join("");
    const translatedArray = translatedText.split("\n").map(s => s.trim());
    console.log("Input:", strings);
    console.log("Output:", translatedArray);
  })
  .catch(err => console.error("Error:", err));
