# Acropora Data — Digital Business Hub (FR / EN)

Site statique bilingue de Shaheen Alladin pour Acropora Data. Il n'y a pas d'étape de build, pas de dépendance et aucun appel réseau externe : les polices Poppins sont hébergées sur le site, donc il reste fiable même avec le Wi-Fi d'un salon.

## Arborescence

```
index.html                  Structure de la page (8 sections)
assets/css/style.css        Charte, mise en page, responsive, styles d'impression (PDF)
assets/js/config.js         Coordonnées, liens, fichiers, bandeau événement, langues
assets/js/content.js        Tous les textes FR / EN
assets/js/app.js            Moteur i18n, rendu, menu, formulaire
assets/img/                 Logos, vagues, carte de Maurice, favicon, image de partage
assets/fonts/               Poppins (woff2)
assets/docs/                Présentations PDF publiques FR / EN
assets/shaheen-alladin.vcf  Fiche contact (vCard)
tools/build-pdf.py          Regénère les PDF à partir du site
```

## À faire avant la mise en ligne

1. **Photo** : déposer `assets/img/shaheen-alladin.jpg` (format portrait, environ 900×1100). Tant que le fichier est absent, un monogramme « SA » s'affiche.
2. **PDF** : lancer `python3 tools/build-pdf.py` une fois la photo ajoutée (avec `python3 -m http.server 8000` lancé à la racine). Les PDF peuvent aussi être remplacés par une plaquette maison portant le même nom.
3. **Chiffres** : vérifier la section « Nos indicateurs » dans `content.js` (`figures`) par rapport au site officiel.

## Langues

* Le français est la langue par défaut. Le choix de l'utilisateur est mémorisé.
* Un lien direct vers la version anglaise : `?lang=en`
* **Ajouter une langue** : copier le bloc `en` de `content.js` (par exemple en `es`), le traduire, puis ajouter `"es"` à `languages` dans `config.js`. Le sélecteur se met à jour automatiquement.

## Formulaire

Le site n'a pas de serveur. Le formulaire prépare donc un e-mail (ouverture de la messagerie du visiteur) ou un message WhatsApp, prérempli avec son nom, son entreprise, le sujet et son message. Pour recevoir les demandes sans action du visiteur, on pourra brancher plus tard un service comme Formspree ou une Vercel Function.

## Bandeau Tech Show Paris

Il est piloté par `event` dans `config.js` et se masque automatiquement après `hideAfter` (le 18/11/2026). Pour un futur salon, il suffit de changer les textes `event` dans `content.js` et la date.

## Déploiement (Vercel)

Importer le dossier comme projet avec le preset « Other » : pas de commande de build, et le répertoire de sortie est la racine. On peut aussi faire un glisser-déposer du dossier sur vercel.com/new.
