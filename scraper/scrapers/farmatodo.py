"""
Scraper para Farmatodo (farmatodo.com.co).
Estrategia: llama directamente al API de Algolia que usa el sitio internamente.
No requiere Playwright.
"""

import re
import httpx
from .base import BaseScraper, ScrapedProduct

ALGOLIA_URL = "https://api-search.farmatodo.com/1/indexes/products/query"
ALGOLIA_HEADERS = {
    "x-algolia-api-key": "eb9544fe7bfe7ec4c1aa5e5bf7740feb",
    "x-algolia-application-id": "VCOJEYD2PO",
    "content-type": "application/json",
}
HITS_PER_PAGE = 60


def _extract_active_ingredient(large_desc: str, description: str, sup_desc: str) -> str:
    if large_desc:
        m = re.search(r"Principio\s+Activo:\s*(.+?)(?:\s*\d|\s*$)", large_desc, re.IGNORECASE)
        if m:
            return m.group(1).strip()
    if sup_desc:
        parts = sup_desc.split()
        if parts:
            return parts[0].strip()
    # Fallback: primera palabra del nombre
    return description.split()[0] if description else ""


def _extract_concentration(description: str) -> str:
    m = re.search(r"(\d+(?:[.,]\d+)?\s*(?:mg|g|ml|mcg|ui|%|ug))", description, re.IGNORECASE)
    return m.group(1).strip() if m else ""


def _extract_presentation(description: str) -> str:
    forms = ["tabletas", "capsulas", "capsula", "tableta", "jarabe", "suspension",
             "solucion", "gotas", "ampolla", "supositorio", "crema", "gel",
             "pomada", "spray", "parche", "polvo", "inyectable"]
    desc_lower = description.lower()
    for form in forms:
        if form in desc_lower:
            return form.capitalize()
    return ""


def _classify(is_generic: bool, name: str) -> str:
    if is_generic:
        return "generic"
    name_lower = name.lower()
    generic_hints = ["genfar", " mk", "laproff", "procaps", "chalver",
                     "bussie", "coaspharma", "tecnoquimicas", "laboquimia",
                     "afidro", "audifarma"]
    for hint in generic_hints:
        if hint in name_lower:
            return "generic"
    return "brand"


def _parse_availability(without_stock: bool, stock: int) -> str:
    if without_stock:
        return "unavailable"
    if stock < 5:
        return "limited"
    return "available"


def _parse_discount(offer_text: str) -> int | None:
    if not offer_text:
        return None
    m = re.search(r"(\d+)", offer_text)
    return int(m.group(1)) if m else None


class FarmatodoScraper(BaseScraper):
    PHARMACY_ID = "farmatodo"

    async def search(self, query: str) -> list[ScrapedProduct]:
        results: list[ScrapedProduct] = []

        try:
            resp = httpx.post(
                ALGOLIA_URL,
                headers=ALGOLIA_HEADERS,
                json={
                    "query": query,
                    "hitsPerPage": HITS_PER_PAGE,
                    "filters": "categorie:'Salud y medicamentos' OR subCategory:'Drogueria'",
                },
                timeout=15,
            )
            data = resp.json()
        except Exception as e:
            print(f"[farmatodo] Error en API: {e}")
            return []

        hits = data.get("hits", [])
        for hit in hits:
            try:
                product = _map_hit(hit)
                if product:
                    results.append(product)
            except Exception:
                continue

        print(f"[farmatodo] '{query}' -> {len(results)} productos (API Algolia)")
        return results


def _map_hit(hit: dict) -> ScrapedProduct | None:
    name = hit.get("description") or hit.get("mediaDescription") or ""
    name = name.strip()
    if not name:
        return None

    full_price = hit.get("fullPrice") or 0
    offer_price = hit.get("offerPrice")

    # Precio final: offerPrice si existe y es valido, sino fullPrice
    if offer_price and offer_price > 0:
        price = int(offer_price)
    elif full_price and full_price > 0:
        price = int(full_price)
    else:
        return None

    # Precio mayor a 5M COP es un error de datos
    if price > 5_000_000:
        return None

    ref_price = int(full_price) if full_price and int(full_price) > price else None

    discount = _parse_discount(hit.get("offerText", ""))
    if ref_price and not discount:
        discount = round((1 - price / ref_price) * 100)

    large_desc = hit.get("large_description", "") or ""
    sup_desc = hit.get("sup_description", "") or ""
    ingredient = _extract_active_ingredient(large_desc, name, sup_desc)
    concentration = _extract_concentration(name)
    presentation = _extract_presentation(name)

    quantity_raw = hit.get("measurePum") or 1
    try:
        quantity = int(quantity_raw)
    except (ValueError, TypeError):
        quantity = 1

    price_per_unit = price // max(quantity, 1)

    without_stock = bool(hit.get("without_stock", True))
    stock = int(hit.get("stock") or 0)
    availability = _parse_availability(without_stock, stock)

    product_id = hit.get("id", "")
    url = f"https://www.farmatodo.com.co/product/{product_id}" if product_id else ""

    is_generic = bool(hit.get("isGeneric") or hit.get("generic"))

    return ScrapedProduct(
        pharmacy_id="farmatodo",
        product_name=name,
        type=_classify(is_generic, name),
        active_ingredient=ingredient,
        concentration=concentration,
        presentation=presentation,
        quantity=quantity,
        price=price,
        price_per_unit=price_per_unit,
        reference_price=ref_price,
        discount_pct=discount,
        availability=availability,
        url=url,
    )
