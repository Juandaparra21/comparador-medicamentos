"""
Punto de entrada del scraper.

Uso:
    python run.py                          # Raspa todos los medicamentos de todas las farmacias
    python run.py --query acetaminofen     # Solo ese medicamento
    python run.py --pharmacy farmatodo     # Solo esa farmacia
    python run.py --dry-run               # Imprime sin escribir a Supabase
"""

import asyncio
import argparse
from scrapers.farmatodo import FarmatodoScraper
from scrapers.cruz_verde import CruzVerdeScraper
from scrapers.la_rebaja import LaRebajaScraper
from scrapers.colsubsidio import ColsubsidioScraper
from scrapers.cafam import CafamScraper
from scrapers.olimpica import OlimpicaScraper
from scrapers.base import ScrapedProduct
import db

QUERIES = [
    "acetaminofen",
    "ibuprofeno",
    "losartan",
    "metformina",
    "atorvastatina",
    "omeprazol",
    "amoxicilina",
    "naproxeno",
]

SCRAPERS = {
    "farmatodo":   FarmatodoScraper(),
    "cruz-verde":  CruzVerdeScraper(),
    "la-rebaja":   LaRebajaScraper(),
    "colsubsidio": ColsubsidioScraper(),
    "cafam":       CafamScraper(),
    "olimpica":    OlimpicaScraper(),
}


async def run_scraper(scraper_id: str, query: str, dry_run: bool) -> None:
    scraper = SCRAPERS[scraper_id]
    try:
        products = await scraper.search(query)
    except Exception as e:
        print(f"[{scraper_id}] Error en '{query}': {e}")
        return

    for p in products:
        if dry_run:
            print(f"  DRY  {p.pharmacy_id} | {p.product_name} | {p.price} COP | {p.availability}")
            continue
        try:
            product_id = db.upsert_product({
                "pharmacy_id":     p.pharmacy_id,
                "product_name":    p.product_name,
                "type":            p.type,
                "active_ingredient": p.active_ingredient,
                "concentration":   p.concentration,
                "presentation":    p.presentation,
                "quantity":        p.quantity,
                "price":           p.price,
                "price_per_unit":  p.price_per_unit,
                "reference_price": p.reference_price,
                "discount_pct":    p.discount_pct,
                "availability":    p.availability,
                "url":             p.url,
            })
            db.insert_price_history(product_id, p.price)
            print(f"  OK   {p.pharmacy_id} | {p.product_name} | {p.price} COP")
        except Exception as e:
            print(f"  ERR  {p.pharmacy_id} | {p.product_name} | {e}")


async def main(query_filter: str | None, pharmacy_filter: str | None, dry_run: bool) -> None:
    queries = [query_filter] if query_filter else QUERIES
    scrapers = [pharmacy_filter] if pharmacy_filter else list(SCRAPERS.keys())

    for query in queries:
        print(f"\n=== {query.upper()} ===")
        tasks = [run_scraper(sid, query, dry_run) for sid in scrapers if sid in SCRAPERS]
        await asyncio.gather(*tasks)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--query",    "-q", help="Medicamento a buscar")
    parser.add_argument("--pharmacy", "-p", help="ID de farmacia", choices=list(SCRAPERS.keys()))
    parser.add_argument("--dry-run",  "-d", action="store_true", help="No escribe a Supabase")
    args = parser.parse_args()

    asyncio.run(main(args.query, args.pharmacy, args.dry_run))
