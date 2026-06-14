"""
Scraper para Cruz Verde (cruzverde.com.co).
Estrategia: sesion de invitado via /customer-service/login + REST API directa.
No requiere Playwright.
"""

import re
import httpx
from .base import BaseScraper, ScrapedProduct
from .farmatodo import _classify, _extract_concentration, _extract_presentation

LOGIN_URL   = "https://api.cruzverde.com.co/customer-service/login"
SEARCH_URL  = "https://api.cruzverde.com.co/product-service/products/search"
PRODUCT_URL = "https://www.cruzverde.com.co/medicamentos"

BASE_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
    "Origin": "https://www.cruzverde.com.co",
    "Referer": "https://www.cruzverde.com.co/",
    "Accept": "application/json, text/plain, */*",
}


def _get_session() -> httpx.Client:
    client = httpx.Client(follow_redirects=True, headers=BASE_HEADERS)
    client.post(LOGIN_URL, json={}, timeout=10)
    return client


def _parse_prices(prices: dict) -> tuple[int, int | None, int | None]:
    """Devuelve (price, ref_price, discount_pct)."""
    list_price = prices.get("price-list-col") or 0
    sale_price = prices.get("price-sale-col")

    if sale_price and sale_price < list_price:
        price = int(sale_price)
        ref_price = int(list_price)
        discount = round((1 - price / ref_price) * 100)
    else:
        price = int(list_price)
        ref_price = None
        discount = None

    return price, ref_price, discount


def _parse_availability(hit: dict) -> str:
    # La API de busqueda devuelve stock=0 siempre (sin zona);
    # homeDelivery / storePickup son los indicadores reales de disponibilidad.
    if hit.get("homeDelivery") or hit.get("storePickup"):
        return "available"
    return "unavailable"


def _extract_ingredient(name: str, brand: str) -> str:
    # Para medicamentos, el principio activo suele estar en el nombre
    # como primera palabra antes del numero/concentracion
    m = re.match(r"^([A-Za-zaprocapsuÀ-ɏ]+(?:\s+[A-Za-zÀ-ɏ]+)?)", name)
    if m:
        ingredient = m.group(1).strip()
        # Si el nombre de marca esta al inicio, no es el ingrediente
        if brand and ingredient.lower() == brand.lower():
            return ""
        return ingredient
    return name.split()[0] if name else ""


class CruzVerdeScraper(BaseScraper):
    PHARMACY_ID = "cruz-verde"

    def __init__(self):
        self._client: httpx.Client | None = None

    def _get_client(self) -> httpx.Client:
        if self._client is None:
            self._client = _get_session()
        return self._client

    async def search(self, query: str) -> list[ScrapedProduct]:
        results: list[ScrapedProduct] = []

        try:
            client = self._get_client()
            resp = client.get(
                SEARCH_URL,
                params={"limit": 60, "offset": 0, "sort": "", "q": query},
                timeout=15,
            )
            if resp.status_code != 200:
                # Sesion expirada: reintentar con sesion nueva
                self._client = _get_session()
                resp = self._client.get(
                    SEARCH_URL,
                    params={"limit": 60, "offset": 0, "sort": "", "q": query},
                    timeout=15,
                )
            data = resp.json()
        except Exception as e:
            print(f"[cruz-verde] Error en API: {e}")
            return []

        hits = data.get("hits", [])
        for hit in hits:
            try:
                product = _map_hit(hit)
                if product:
                    results.append(product)
            except Exception:
                continue

        print(f"[cruz-verde] '{query}' -> {len(results)} productos (API REST)")
        return results


def _map_hit(hit: dict) -> ScrapedProduct | None:
    name = hit.get("productName", "").strip()
    if not name:
        return None

    prices = hit.get("prices", {}) or {}
    if not prices:
        return None

    price, ref_price, discount = _parse_prices(prices)
    if price <= 0 or price > 5_000_000:
        return None

    brand = (hit.get("brand") or "").strip()
    ingredient = _extract_ingredient(name, brand)
    concentration = _extract_concentration(name)
    presentation = _extract_presentation(name)

    availability = _parse_availability(hit)

    product_id = hit.get("productId", "")
    slug = hit.get("pageURL", "")
    if slug and product_id:
        page_url = f"https://www.cruzverde.com.co/{slug}/{product_id}.html"
    elif slug:
        page_url = f"https://www.cruzverde.com.co/{slug}.html"
    else:
        page_url = f"https://www.cruzverde.com.co/buscar?q={name.replace(' ', '+')}"

    quantity = 1

    price_per_unit = price // max(quantity, 1)

    return ScrapedProduct(
        pharmacy_id="cruz-verde",
        product_name=name,
        type=_classify(False, name),
        active_ingredient=ingredient,
        concentration=concentration,
        presentation=presentation,
        quantity=quantity,
        price=price,
        price_per_unit=price_per_unit,
        reference_price=ref_price,
        discount_pct=discount,
        availability=availability,
        url=page_url,
    )
