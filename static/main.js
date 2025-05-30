const app = new Vue({
  el: '#app',
  delimiters: ['[[', ']]'],
  data: {
    text: '',
    sourceLang: 'pl',
    targetLang: 'en',
    translation: '',
    copySuccess: false
  },
  methods: {
    async translateText() {
      try {
        const response = await fetch('/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: this.text,
            source_lang: this.sourceLang,
            target_lang: this.targetLang
          })
        });

        const data = await response.json();
        this.translation = data.translation;
        this.copySuccess = false; // resetuj komunikat po nowym tłumaczeniu
      } catch (error) {
        console.error("Błąd podczas tłumaczenia:", error);
        this.translation = "Wystąpił błąd podczas tłumaczenia.";
      }
    },
    copyTranslation() {
      navigator.clipboard.writeText(this.translation)
        .then(() => {
          this.copySuccess = true;
          setTimeout(() => this.copySuccess = false, 3000); // schowaj po 3s
        })
        .catch(err => {
          console.error("Nie udało się skopiować:", err);
        });
    }
  }
});