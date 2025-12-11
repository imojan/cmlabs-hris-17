// Test component untuk debug HMR issue
import { useState } from "react";

export default function TestHMR() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("Edit this text");

  return (
    <div style={{ padding: "20px", border: "2px solid blue" }}>
      <h2>✅ HMR Test Component - UPDATED</h2>
      <p style={{ color: "green", fontWeight: "bold" }}>If you see this text in blue border, HMR is WORKING!</p>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      
      <div style={{ marginTop: "20px" }}>
        <p>Text: {text}</p>
        <textarea 
          value={text} 
          onChange={(e) => setText(e.target.value)}
          style={{ width: "100%", height: "100px" }}
        />
      </div>
    </div>
  );
}
