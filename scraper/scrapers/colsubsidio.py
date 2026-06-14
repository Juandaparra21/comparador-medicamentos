"""
Scraper para Colsubsidio.
Colsubsidio es una tienda para beneficiarios (requiere login en tienda.colsubsidio.com).
No hay API publica de catalogo disponible.
"""

from .base import BaseScraper, ScrapedProduct


class ColsubsidioScraper(BaseScraper):
    PHARMACY_ID = "colsubsidio"

    async def search(self, query: str) -> list[ScrapedProduct]:
        print(f"[colsubsidio] '{query}' -> 0 productos (requiere autenticacion de beneficiario)")
        return []
