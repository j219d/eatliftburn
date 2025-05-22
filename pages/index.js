import { useState } from 'react';

export default function Home() {
  const [weight, setWeight] = useState(157); // default weight in lbs
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [steps, setSteps] = useState(0);
  const [manualBurn, setManualBurn] = useState(0);
  const [exerciseLog, setExerciseLog] = useState([]);
  const [deficit, setDeficit] = useState(0);

  const BMR = 1740;

  const calcDeficit = (newCalories, newSteps, manualBurn) => {
    const stepCalories = newSteps * (0.0005 * weight);
    return Math.round(BMR + stepCalories + manualBurn - newCalories);
  };

  const handleWeightChange = (e) => {
    setWeight(parseInt(e.target.value));
  };

  const handleFoodLog = (e) => {
    e.preventDefault();
    const foodCals = parseInt(e.target.calories.value);
    const foodProtein = parseInt(e.target.protein.value);
    const updatedCalories = calories + foodCals;
    setCalories(updatedCalories);
    setProtein(prev => prev + foodProtein);
    setDeficit(calcDeficit(updatedCalories, steps, manualBurn));
    e.target.reset();
  };

  const handleStepLog = (e) => {
    e.preventDefault();
    const addedSteps = parseInt(e.target.steps.value);
    const updatedSteps = steps + addedSteps;
    setSteps(updatedSteps);
    setDeficit(calcDeficit(calories, updatedSteps, manualBurn));
    e.target.reset();
  };

  const handleManualBurn = (e) => {
    e.preventDefault();
    const addedBurn = parseInt(e.target.burn.value);
    const updatedManualBurn = manualBurn + addedBurn;
    setManualBurn(updatedManualBurn);
    setDeficit(calcDeficit(calories, steps, updatedManualBurn));
    e.target.reset();
  };

  const handleExerciseLog = (e) => {
    e.preventDefault();
    const type = e.target.type.value;
    const amount = parseInt(e.target.amount.value);

    let burn = 0;
    if (type === 'pushups') burn = amount * 0.29;
    if (type === 'pullups') burn = amount * 1;
    if (type === 'bicep_curls') burn = amount * 0.5;
    if (type === 'bench_press') burn = amount * 0.7;
    if (type === 'tricep_pulls') burn = amount * 0.4;
    if (type === 'leg_press') burn = amount * 0.6;

    const newLog = [...exerciseLog, { type, amount, burn }];
    setExerciseLog(newLog);
    const updatedManualBurn = manualBurn + burn;
    setManualBurn(updatedManualBurn);
    setDeficit(calcDeficit(calories, steps, updatedManualBurn));
    e.target.reset();
  };
  
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#121212', color: '#fff' }}>
      <h1>EATLIFTBURN</h1>

      <label>Body Weight (lbs): </label>
      <input type="number" value={weight} onChange={handleWeightChange} style={{ marginBottom: '20px' }} />

      <p>Calories consumed: {calories}</p>
      <p>Protein: {protein}g</p>
      <p>Steps: {steps}</p>
      <p>Manual Burn: {manualBurn} cal</p>
      <p>Estimated Deficit: {deficit}</p>

      <hr />

      <h2>Log Food</h2>
      <form onSubmit={handleFoodLog}>
        <input name="calories" type="number" placeholder="Calories" required />
        <input name="protein" type="number" placeholder="Protein (g)" required />
        <button type="submit">Add</button>
      </form>

      <h2>Log Steps (flat pace walk)</h2>
      <form onSubmit={handleStepLog}>
        <input name="steps" type="number" placeholder="Steps" required />
        <button type="submit">Add</button>
      </form>

      <h2>Log Manual Burn (e.g. treadmill calories)</h2>
      <form onSubmit={handleManualBurn}>
        <input name="burn" type="number" placeholder="Calories burned" required />
        <button type="submit">Add</button>
      </form>

      <h2>Log Workout</h2>
      <form onSubmit={handleExerciseLog}>
        <select name="type" required>
          <option value="pushups">Push-ups</option>
          <option value="pullups">Pull-ups</option>
          <option value="bicep_curls">Bicep Curls (reps)</option>
          <option value="bench_press">Bench Press (reps)</option>
          <option value="tricep_pulls">Tricep Pulls (reps)</option>
          <option value="leg_press">Leg Press (reps)</option>
        </select>
        <input name="amount" type="number" placeholder="Amount" required />
        <button type="submit">Add</button>
      </form>

      <h3>Workout Log:</h3>
      <ul>
        {exerciseLog.map((ex, i) => (
          <li key={i}>{ex.amount} × {ex.type.replace('_', ' ')} — {ex.burn.toFixed(1)} cal</li>
        ))}
      </ul>
    </div>
  );
}

