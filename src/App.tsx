import { useTester } from "./store/testStore"


function App() {
  const { count, increment, decrement, reset } = useTester();
  console.log("Count:", count);
  return (
    <div className="app-container" style={{ textAlign: "center", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "2rem", color: "#333" }}>Counter: {count}</h1>
      <div style={{ marginTop: "20px" }}>
      <button 
        onClick={increment} 
        style={{ margin: "5px", padding: "10px 20px", fontSize: "1rem", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
      >
        Increment
      </button>
      <button 
        onClick={decrement} 
        style={{ margin: "5px", padding: "10px 20px", fontSize: "1rem", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
      >
        Decrement
      </button>
      <button 
        onClick={reset} 
        style={{ margin: "5px", padding: "10px 20px", fontSize: "1rem", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
      >
        Reset
      </button>
      </div>
    </div>
  )
}

export default App

