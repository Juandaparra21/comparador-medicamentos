import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

_client: Client | None = None


def get_client() -> Client:
    global _client
    if _client is None:
        url = os.environ["SUPABASE_URL"]
        key = os.environ["SUPABASE_SERVICE_KEY"]
        _client = create_client(url, key)
    return _client


def upsert_product(data: dict) -> int:
    """
    Inserta o actualiza un producto. Retorna el id del producto.
    data debe tener: pharmacy_id, product_name, concentration (clave unica).
    """
    client = get_client()
    res = (
        client.table("products")
        .upsert(data, on_conflict="pharmacy_id,product_name,concentration")
        .execute()
    )
    return res.data[0]["id"]


def insert_price_history(product_id: int, price: int) -> None:
    client = get_client()
    client.table("price_history").insert({
        "product_id": product_id,
        "price": price,
    }).execute()
