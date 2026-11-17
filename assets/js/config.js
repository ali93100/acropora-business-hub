/* =========================================================
   ACROPORA DATA — Digital Business Hub
   Configuration centrale : coordonnées, liens, langues.
   Modifier ici sans toucher au reste du code.
   ========================================================= */
window.HUB_CONFIG = {
  person: {
    firstName: "Shaheen",
    lastName: "Alladin",
    title: "Founder & Data Management Expert",
    // Déposer la photo dans assets/img/ sous ce nom (JPG/PNG/WebP, format portrait ~ 900×1100).
    // Tant que le fichier est absent, un monogramme « SA » s'affiche à la place.
    photo: "assets/img/shaheen-alladin.jpg"
  },
  company: {
    name: "ACROPORA DATA",
    website: "https://www.acropora-data.com/",
    websiteLabel: "acropora-data.com"
  },
  contact: {
    email: "shaheen.alladin@acropora-data.com",
    phone: "+33620941141",
    phoneDisplay: "+33 6 20 94 11 41",
    whatsapp: "33620941141",
    linkedin: "https://www.linkedin.com/in/shaheen-alladin-itchir-a12a0833/",
    // Agenda Microsoft Bookings (page publique « Book with me ») : réunions Teams
    booking: "https://bookings.cloud.microsoft/bookwithme/user/13c07441948048dba12ea99aaa1fb0cb%40acropora-data.com/meetingtype/NppAEOIdTUespkKDrzCoPQ2?anonymous&ismsaljsauthenabled"
  },
  files: {
    vcard: "assets/shaheen-alladin.vcf",
    // Présentation commerciale publique, une par langue.
    presentation: {
      fr: "assets/docs/Acropora-Data_Presentation_FR.pdf",
      en: "assets/docs/Acropora-Data_Presentation_EN.pdf"
    }
  },
  // Bandeau événement : affiché jusqu'à la date "hideAfter" incluse, puis masqué automatiquement.
  event: {
    enabled: true,
    hideAfter: "2026-11-18"
  },
  // Langues disponibles (ordre du sélecteur). Pour ajouter une langue :
  // 1) ajouter son code ici, 2) ajouter son bloc dans content.js.
  languages: ["fr", "en"],
  defaultLanguage: "fr"
};
