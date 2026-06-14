"""
Scraper para La Rebaja Virtual (larebajavirtual.com).
Estrategia: VTEX catalog REST API directa.
No requiere Playwright.
"""

import httpx
from .base import BaseScraper, ScrapedProduct
from .farmatodo import _classify, _extract_concentration, _extract_presentation
from .utils import normalize

SEARCH_URL = "https://www.larebajavirtual.com/api/catalog_system/pub/products/search/"

BASE_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
    "Accept": "application/json",
    "Origin": "https://www.larebajavirtual.com",
    "Referer": "https://www.larebajavirtual.com/",
}


def _spec(product: dict, key: str) -> str:
    """Extrae el primer valor de una especificacion VTEX."""
    values = product.get(key, [])
    return values[0].strip() if values else ""


def _map_product(p: dict) -> ScrapedProduct | None:
    name = p.get("productName", "").strip()
    if not name:
        return None

    items = p.get("items", [])
    if not items:
        return None
    sellers = items[0].get("sellers", [])
    if not sellers:
        return None
    offer = sellers[0].get("commertialOffer", {})

    list_price = offer.get("ListPrice") or 0
    sale_price = offer.get("Price") or 0
    if sale_price <= 0 or sale_price > 5_000_000:
        return None

    price = int(sale_price)
    if list_price and list_price > sale_price:
        ref_price = int(list_price)
        discount = round((1 - price / ref_price) * 100)
    else:
        ref_price = None
        discount = None

    avail_qty = offer.get("AvailableQuantity", 0) or 0
    availability = "available" if avail_qty > 0 else "unavailable"

    ingredient = _spec(p, "Principio activo") or _spec(p, "Principio Activo") or name.split()[0]
    presentation = _spec(p, "Presentacion") or _extract_presentation(name)
    concentration = _extract_concentration(name)

    qty_str = _spec(p, "Cantidadunidadesmedida")
    try:
        quantity = int(float(qty_str)) if qty_str else 1
    except ValueError:
        quantity = 1
    quantity = max(quantity, 1)

    price_per_unit = price // quantity

    is_rx = _spec(p, "Producto RX").upper() == "SI"
    product_type = _classify(not is_rx, name)

    url = p.get("link", "") or f"https://www.larebajavirtual.com/{p.get('linkText', '')}/p"

    return ScrapedProduct(
        pharmacy_id="la-rebaja",
        product_name=name,
        type=product_type,
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


class LaRebajaScraper(BaseScraper):
    PHARMACY_ID = "la-rebaja"

    def __init__(self):
        self._client = httpx.Client(follow_redirects=True, headers=BASE_HEADERS, timeout=20)

    async def search(self, query: str) -> list[ScrapedProduct]:
        results: list[ScrapedProduct] = []
        try:
            # VTEX devuelve maximo 50 por llamada; dos paginas cubren 100 productos
            for offset in range(0, 100, 50):
                r = self._client.get(
                    SEARCH_URL,
                    params={"ft": query, "_from": offset, "_to": offset + 49},
                )
                if r.status_code not in (200, 206):
                    break
                products = r.json()
                if not products:
                    break
                for p in products:
                    try:
                        product = _map_product(p)
                        if product:
                            results.append(product)
                    except Exception:
                        continue
                if len(products) < 50:
                    break
        except Exception as e:
            print(f"[la-rebaja] Error en API: {e}")

        # Filtrar: el query debe aparecer en nombre o ingrediente activo (normalizado sin acentos)
        q = normalize(query)
        results = [r for r in results if q in normalize(r.product_name) or q in normalize(r.active_ingredient)]

        print(f"[la-rebaja] '{query}' -> {len(results)} productos (VTEX API)")
        return results
