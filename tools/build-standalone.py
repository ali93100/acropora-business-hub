# Génère un aperçu autonome en un seul fichier HTML (tout intégré), à ouvrir d'un double-clic.
# Usage, depuis la racine du projet : python3 tools/build-standalone.py [sortie.html]
import base64, re, mimetypes, sys
def b64(p, mime=None):
    mime = mime or mimetypes.guess_type(p)[0] or "application/octet-stream"
    return f"data:{mime};base64," + base64.b64encode(open(p, "rb").read()).decode()
out = sys.argv[1] if len(sys.argv) > 1 else "Acropora-Data_Hub_apercu.html"
html = open("index.html", encoding="utf-8").read()
css = open("assets/css/style.css", encoding="utf-8").read()
css = re.sub(r'url\("\.\./(fonts|img)/([^"]+)"\)', lambda m: f'url("{b64("assets/"+m.group(1)+"/"+m.group(2), "font/woff2" if m.group(1)=="fonts" else None)}")', css)
html = html.replace('<link rel="stylesheet" href="assets/css/style.css">', "<style>\n" + css + "\n</style>")
html = re.sub(r'\s*<link rel="preload"[^>]+>', "", html)
html = re.sub(r'(src|href)="(assets/img/[^"]+)"', lambda m: f'{m.group(1)}="{b64(m.group(2))}"', html)
cfg = open("assets/js/config.js", encoding="utf-8").read()
cfg = cfg.replace('"assets/img/shaheen-alladin.jpg"', '"' + b64("assets/img/shaheen-alladin.jpg") + '"')
cfg = cfg.replace('"assets/shaheen-alladin.vcf"', '"' + b64("assets/shaheen-alladin.vcf", "text/vcard") + '"')
for L in ["FR", "EN"]:
    p = f"assets/docs/Acropora-Data_Presentation_{L}.pdf"
    cfg = cfg.replace('"' + p + '"', '"' + b64(p) + '"')
for name, code in [("config", cfg), ("content", open("assets/js/content.js", encoding="utf-8").read()), ("app", open("assets/js/app.js", encoding="utf-8").read())]:
    html = html.replace(f'<script src="assets/js/{name}.js"></script>', "<script>\n" + code.replace("</script", "<\\/script") + "\n</script>")
html = html.replace('data-href="presentation" download>', 'data-href="presentation" download="Acropora-Data_Presentation.pdf">')
open(out, "w", encoding="utf-8").write(html)
print("OK ->", out)
