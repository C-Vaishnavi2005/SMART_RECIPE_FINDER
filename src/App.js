import { useState, useEffect } from "react";
import { GiCookingPot } from "react-icons/gi";

function App() {
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [mode, setMode] = useState("name");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setSelectedRecipe(null);

    let url =
      mode === "name"
        ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`
        : `https://www.themealdb.com/api/json/v1/1/filter.php?i=${search}`;

    const res = await fetch(url);
    const data = await res.json();

    setRecipes(data.meals || []);
    setLoading(false);
  };

  const fetchRecipeDetails = async (id) => {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const data = await res.json();
    setSelectedRecipe(data.meals[0]);
  };

  // ESC close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSelectedRecipe(null);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div>
      <div className="header">
        <div className="logo">
          <GiCookingPot className="icon" />
          <span>
            <span className="highlight">Cook</span>Mate
          </span>
        </div>
      </div>

      {/* SEARCH */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />

        <div className="button-row">
          <button
            onClick={() => setMode("name")}
            className={`btn blue ${mode === "name" ? "active" : ""}`}
          >
            Name
          </button>

          <button
            onClick={() => setMode("ingredient")}
            className={`btn green ${mode === "ingredient" ? "active" : ""}`}
          >
            Ingredient
          </button>
        </div>

        <button onClick={handleSearch} className="btn primary search-btn">
          Search
        </button>
      </div>

      {/* LOADING */}
      {loading && <div className="loader">🍜 Cooking...</div>}

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          padding: "20px",
        }}
      >
        {recipes.map((meal) => (
          <div
            key={meal.idMeal}
            className="card"
            onClick={() => fetchRecipeDetails(meal.idMeal)}
          >
            <img src={meal.strMealThumb} alt={meal.strMeal} />
            <div style={{ padding: "10px" }}>
              <h3>{meal.strMeal}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* POPUP */}
      {selectedRecipe && (
        <>
          <div
            className="overlay"
            onClick={() => setSelectedRecipe(null)}
          ></div>

          <div className="popup">
            <button onClick={() => setSelectedRecipe(null)}>Close</button>

            <h2>{selectedRecipe.strMeal}</h2>

            {/* 🔥 FIXED HERE */}
            <img
              src={selectedRecipe.strMealThumb}
              alt={selectedRecipe.strMeal}
              width="100%"
            />

            <h3>Ingredients</h3>
            <ul>
              {[...Array(20)].map((_, i) => {
                const ing = selectedRecipe[`strIngredient${i + 1}`];
                const meas = selectedRecipe[`strMeasure${i + 1}`];
                if (!ing) return null;
                return (
                  <li key={i}>
                    {ing} - {meas}
                  </li>
                );
              })}
            </ul>

            <h3>Instructions</h3>
            <p>{selectedRecipe.strInstructions}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default App;