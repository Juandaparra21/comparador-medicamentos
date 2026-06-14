"""
Scraper para Cafam.
cafam.com.co usa proteccion Radware anti-bot que bloquea acceso programatico.
"""

from .base import BaseScraper, ScrapedProduct


class CafamScraper(BaseScraper):
    PHARMACY_ID = "cafam"

    async def search(self, query: str) -> list[ScrapedProduct]:
        print(f"[cafam] '{query}' -> 0 productos (bloqueado por anti-bot Radware)")
        return []
