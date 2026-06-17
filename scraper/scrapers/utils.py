"""Utilidades compartidas entre scrapers basados en intercepcion de red."""

import unicodedata
from .base import ScrapedProduct


def normalize(text: str) -> str:
    """Elimina acentos y pasa a minusculas para comparaciones."""
    return unicodedata.normalize("NFD", text.lower()).encode("ascii", "ignore").decode("ascii")


def normalize_concentration(value: str) -> str:
    """Estandariza concentraciones: '300 MG' -> '300mg', '500,5 Mcg' -> '500.5mcg'."""
    import re
    value = value.strip()
    m = re.search(r'(\d+(?:[.,]\d+)?)\s*(mg|g|ml|mcg|ui|%|ug)', value, re.IGNORECASE)
    if not m:
        return value
    num  = m.group(1).replace(',', '.')
    unit = m.group(2).lower()
    return f"{num}{unit}"


def _classify(name: str) -> str:
    name_lower = name.lower()
    generic_hints = ["genfar", " mk", "laproff", "procaps", "chalver", "best",
                     "bussie", "coaspharma", "tecnoquimicas", "laboquimia",
                     "afidro", "audifarma"]
    for hint in generic_hints:
        if hint in name_lower:
            return "generic"
    return "brand"


def _parse_availability(stock: int | str | None) -> str:
    if stock is None:
        return "unavailable"
    try:
        n = int(stock)
    except (ValueError, TypeError):
        return "available"
    if n == 0:
        return "unavailable"
    if n < 5:
        return "limited"
    return "available"


def _looks_like_product(obj: dict) -> bool:
    keys = {k.lower() for k in obj.keys()}
    return bool(
        {"price", "name"} & keys or
        {"precio", "nombre"} & keys or
        {"productname", "listprice"} & keys
    )


def _find_item_lists(obj, depth=0) -> list[dict]:
    if depth > 5:
        return []
    if isinstance(obj, list):
        if obj and isinstance(obj[0], dict) and _looks_like_product(obj[0]):
            return obj
        items = []
        for element in obj:
            items.extend(_find_item_lists(element, depth + 1))
        return items
    if isinstance(obj, dict):
        items = []
        for val in obj.values():
            items.extend(_find_item_lists(val, depth + 1))
        return items
    return []


def _map_item(item: dict, pharmacy_id: str, source_url: str) -> ScrapedProduct | None:
    flat = {k.lower(): v for k, v in item.items()}

    name = (
        flat.get("name") or flat.get("productname") or
        flat.get("nombre") or flat.get("title") or ""
    )
    if not name:
        return None

    raw_price = (
        flat.get("price") or flat.get("listprice") or
        flat.get("salesprice") or flat.get("precio") or 0
    )
    try:
        price = int(float(str(raw_price).replace(",", "").replace("$", "").strip()))
    except (ValueError, TypeError):
        return None
    if price <= 0:
        return None

    raw_ref = flat.get("listprice") or flat.get("originalprice") or flat.get("precioanterior")
    ref_price = None
    discount = None
    if raw_ref:
        try:
            ref_price = int(float(str(raw_ref).replace(",", "").replace("$", "").strip()))
            if ref_price > price:
                discount = round((1 - price / ref_price) * 100)
            else:
                ref_price = None
        except (ValueError, TypeError):
            ref_price = None

    ingredient = (
        flat.get("activeingredient") or flat.get("principioactivo") or
        flat.get("genericname") or ""
    )
    concentration = normalize_concentration(
        flat.get("concentration") or flat.get("concentracion") or ""
    )
    presentation = flat.get("presentation") or flat.get("presentacion") or flat.get("form") or ""
    quantity_raw = flat.get("quantity") or flat.get("cantidad") or flat.get("units") or 1
    try:
        quantity = int(quantity_raw)
    except (ValueError, TypeError):
        quantity = 1

    price_per_unit = price // max(quantity, 1)

    stock = flat.get("stock") or flat.get("availability") or flat.get("inventorycount")
    availability = _parse_availability(stock)

    url = flat.get("url") or flat.get("link") or flat.get("pdpurl") or source_url

    return ScrapedProduct(
        pharmacy_id=pharmacy_id,
        product_name=str(name).strip(),
        type=_classify(str(name)),
        active_ingredient=str(ingredient).strip(),
        concentration=str(concentration).strip(),
        presentation=str(presentation).strip(),
        quantity=quantity,
        price=price,
        price_per_unit=price_per_unit,
        reference_price=ref_price,
        discount_pct=discount,
        availability=availability,
        url=url if isinstance(url, str) else "",
    )


def _extract_products(body: dict | list, pharmacy_id: str, source_url: str) -> list[ScrapedProduct]:
    products: list[ScrapedProduct] = []
    candidates = _find_item_lists(body)
    for item in candidates:
        try:
            product = _map_item(item, pharmacy_id, source_url)
            if product:
                products.append(product)
        except Exception:
            continue
    return products
