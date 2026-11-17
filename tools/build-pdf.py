# Regénère les PDF de présentation (FR/EN) à partir du site.
# Prérequis : pip install playwright && playwright install chromium
# Lancer depuis la racine du projet, avec un serveur local actif : python3 -m http.server 8000

import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for lang in ["fr","en"]:
            pg = await b.new_page(viewport={"width":1200,"height":900})
            await pg.goto("http://localhost:8000/?lang="+lang); await pg.wait_for_timeout(800)
            await pg.emulate_media(media="print")
            await pg.pdf(path=f"assets/docs/Acropora-Data_Presentation_{lang.upper()}.pdf", format="A4", print_background=True, scale=0.7, margin={"top":"0","bottom":"0","left":"0","right":"0"})
        await b.close()
asyncio.run(main())
