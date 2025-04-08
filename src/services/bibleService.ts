// services/bibleService.ts
export async function getBibleVerse(): Promise<string> {
  try {
    const res = await fetch("https://beta.ourmanna.com/api/v1/get/?format=text&order=daily");
    const text = await res.text();

    // Tradução usando API gratuita do LibreTranslate
    const translationRes = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text, source: "en", target: "pt", format: "text" })
    });

    const data = await translationRes.json();
    return data.translatedText || text;
  } catch (error) {
    console.error("Erro ao obter versículo bíblico:", error);
    return "Confia no Senhor de todo o teu coração (Pv 3:5)";
  }
}
