"""
Scraper para Olimpica Drogueria (olimpica.com).
Estrategia: VTEX catalog REST API directa.
No requiere Playwright.
"""

import httpx
from .base import BaseScraper, ScrapedProduct
from .farmatodo import _classify, _extract_concentration, _extract_presentation
from .utils import normalize

SEARCH_URL = "https://www.olimpica.com/api/catalog_system/pub/products/search/"

BASE_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
    "Accept": "application/json",
    "Origin": "https://www.olimpica.com",
    "Referer": "https://www.olimpica.com/",
}


def _spec(product: dict, key: str) -> str:
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

    # Cantidad: unit_multiplier puede ser numero o string de unidad
    qty_raw = _spec(p, "unit_multiplier")
    try:
        quantity = int(float(qty_raw)) if qty_raw else 1
    except ValueError:
        quantity = 1
    quantity = max(quantity, 1)

    concentration = _extract_concentration(name)
    presentation = _extract_presentation(name)
    # Olimpica no expone principio activo como spec; extraer de nombre
    ingredient = name.split()[0] if name else ""

    price_per_unit = price // quantity

    # Clasificar por marca: si el brand contiene palabras genericas -> generic
    brand = (p.get("brand") or "").strip()
    is_brand_name = bool(brand) and brand.upper() not in ("", "GENERICO", "MK", "GENFAR", "LAPROF", "PROCAPS", "COASPHARMA")
    product_type = _classify(not is_brand_name, name)

    url = p.get("link", "") or f"https://www.olimpica.com/{p.get('linkText', '')}/p"

    return ScrapedProduct(
        pharmacy_id="olimpica",
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


class OlimpicaScraper(BaseScraper):
    PHARMACY_ID = "olimpica"

    def __init__(self):
        self._client = httpx.Client(follow_redirects=True, headers=BASE_HEADERS, timeout=20)

    async def search(self, query: str) -> list[ScrapedProduct]:
        results: list[ScrapedProduct] = []
        try:
            for offset in range(0, 100, 50):
                r = self._client.get(
                    SEARCH_URL,
                    params={"ft": query, "_from": offset, "_to": offset + 49},
                )
                if r.status_code not in (200, 206):
                    break
                products = r.json()
                if not isinstance(products, list) or not products:
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
            print(f"[olimpica] Error en API: {e}")

        # Filtrar: el query debe aparecer en nombre o ingrediente activo (normalizado sin acentos)
        q = normalize(query)
        results = [r for r in results if q in normalize(r.product_name) or q in normalize(r.active_ingredient)]

        print(f"[olimpica] '{query}' -> {len(results)} productos (VTEX API)")
        return results
