import { useState } from 'react';

export default function Home() {
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [steps, setSteps] = useState(0);

  const BMR = 1740;

  const handleFoodLog = (e) => {
    e.preventDefault();
    const foodCals = parseInt(e.target.calories.value);
    const foodProtein = parseInt(e.target.protein.value);
    setCalories(prev => prev + foodCals);
    setProtein(prev => prev + foodProtein);
    e.target.reset();
  };

  const handleStepLog = (e) => {
    e.preventDefault();
    const addedSteps = parseInt(e.target.steps.value);
    setSteps(prev => prev + addedSteps);
    e.target.reset();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#121212', color: '#fff' }}>
      <h1>EATLIFTBURN</h1>
      <p>Calories consumed: {calories}</p>
      <p>Protein: {protein}g</p>
      <p>Steps: {steps}</p>
      <p>Estimated Deficit: {Math.round(BMR + steps * 0.03 - calories)}</p>

      <h2>Log Food</h2>
      <form onSubmit={handleFoodLog}>
        <input name="calories" type="number" placeholder="Calories" required />
        <input name="protein" type="number" placeholder="Protein (g)" required />
        <button type="submit">Add</button>
      </form>

      <h2>Log Steps</h2>
      <form onSubmit={handleStepLog}>
        <input name="steps" type="number" placeholder="Steps" required />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
