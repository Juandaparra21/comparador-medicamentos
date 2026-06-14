from abc import ABC, abstractmethod
from dataclasses import dataclass, field


@dataclass
class ScrapedProduct:
    pharmacy_id: str
    product_name: str
    type: str                    # 'brand' | 'generic'
    active_ingredient: str
    price: int                   # COP entero
    concentration: str = ""
    presentation: str = ""
    quantity: int = 1
    price_per_unit: int = 0
    reference_price: int | None = None
    discount_pct: int | None = None
    availability: str = "available"   # 'available' | 'limited' | 'unavailable'
    url: str = ""


class BaseScraper(ABC):
    PHARMACY_ID: str = ""

    @abstractmethod
    async def search(self, query: str) -> list[ScrapedProduct]:
        """Busca un medicamento y retorna lista de productos."""
        ...
