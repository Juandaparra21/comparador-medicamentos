export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>💊 Comparador de Medicamentos Colombia</h1>

      <p>Busca el medicamento y encuentra el mejor precio</p>

      <input
        type="text"
        placeholder="Ej: acetaminofén"
        style={{
          padding: "10px",
          width: "300px",
          marginTop: "20px",
        }}
      />

      <button
        style={{
          padding: "10px",
          marginLeft: "10px",
          cursor: "pointer",
        }}
      >
        Buscar
      </button>

      <div style={{ marginTop: "40px" }}>
        <h2>Resultados</h2>
        <p>Aquí aparecerán los precios...</p>
      </div>
    </main>
  );
}