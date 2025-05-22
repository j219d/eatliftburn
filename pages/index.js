import { useState, useEffect } from 'react';

export default function Home() {
  const BMR = 1740;

  const [weight, setWeight] = useState(() => parseInt(localStorage.getItem('weight')) || 157);
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [steps, setSteps] = useState(0);
  const [manualBurn, setManualBurn] = useState(0);
  const [exerciseLog, setExerciseLog] = useState([]);
  const [deficit, setDeficit] = useState(BMR);
  const [weightLog, setWeightLog] = useState(() => JSON.parse(localStorage.getItem('weightLog')) || []);

  useEffect(() => {
    const stepBurn = steps * 0.04;
    setDeficit(Math.round(BMR + stepBurn + manualBurn - calories));
  }, [calories, steps, manualBurn]);

  useEffect(() => {
    localStorage.setItem('weight', weight);
  }, [weight]);

  useEffect(() => {
    localStorage.setItem('weightLog', JSON.stringify(weightLog));
  }, [weightLog]);

  const resetDaily = () => {
    setCalories(0);
    setProtein(0);
    setSteps(0);
    setManualBurn(0);
    setExerciseLog([]);
    setDeficit(BMR);
  };

  const handleWeightChange = (e) => {
    setWeight(parseInt(e.target.value));
  };

  const handleWeightLog = (e) => {
    e.preventDefault();
    const newWeight = parseFloat(e.target.weight.value);
    const today = new Date().toISOString().split('T')[0];
    setWeightLog(prev => [...prev, { date: today, weight: newWeight }]);
    e.target.reset();
  };

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

  const handleManualBurn = (e) => {
    e.preventDefault();
    const addedBurn = parseInt(e.target.burn.value);
    setManualBurn(prev => prev + addedBurn);
    e.target.reset();
  };

  const handleExerciseLog = (e) => {
    e.preventDefault();
    const type = e.target.type.value;
    const amount = parseInt(e.target.amount.value);
    let burn = 0;
    if (type === 'pushups') burn = amount * 0.6;
    if (type === 'pullups') burn = amount * 1;
    if (type === 'bicep_curls') burn = amount * 0.5;
    if (type === 'bench_press') burn = amount * 0.7;
    if (type === 'tricep_pulls') burn = amount * 0.4;
    if (type === 'leg_press') burn = amount * 0.6;
    const newLog = [...exerciseLog, { type, amount, burn }];
    setExerciseLog(newLog);
    setManualBurn(prev => prev + burn);
    e.target.reset();
  };

  const handlePresetFood = (e) => {
    const value = e.target.value;
    const presets = {
      'chicken_50': { cal: 82, protein: 15 },
      'chicken_100': { cal: 165, protein: 31 },
      'chicken_150': { cal: 247, protein: 46 },
      'chicken_200': { cal: 330, protein: 62 },
      'apple': { cal: 95, protein: 0.5 },
      'promix': { cal: 150, protein: 15 },
      'quest': { cal: 190, protein: 20 },
      'egg': { cal: 70, protein: 6 },
      'egg_white': { cal: 17, protein: 3.5 },
      'tomato': { cal: 22, protein: 1 },
      'green_onion': { cal: 5, protein: 0.2 },
      'butter': { cal: 100, protein: 0 },
      'olive_oil_tsp': { cal: 40, protein: 0 },
      'olive_oil_tbsp': { cal: 120, protein: 0 },
      'protein_icecream': { cal: 400, protein: 52 },
    };
    const item = presets[value];
    if (item) {
      setCalories(prev => prev + item.cal);
      setProtein(prev => prev + item.protein);
    }
    e.target.value = '';
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#121212', color: '#fff' }}>
      <h1>EATLIFTBURN</h1>

      <label>Body Weight (lbs): </label>
      <input type="number" value={weight} onChange={handleWeightChange} />

      <p>Calories consumed: {calories}</p>
      <p>Protein: {protein}g</p>
      <p>Steps: {steps}</p>
      <p>Manual Burn: {manualBurn} cal</p>
      <p>Estimated Deficit: {deficit}</p>

      <button onClick={resetDaily}>Reset for New Day</button>

      <h2>Log Preset Food</h2>
      <select onChange={handlePresetFood} defaultValue="">
        <option value="" disabled>Select food...</option>
        <option value="chicken_50">Chicken Breast (50g)</option>
        <option value="chicken_100">Chicken Breast (100g)</option>
        <option value="chicken_150">Chicken Breast (150g)</option>
        <option value="chicken_200">Chicken Breast (200g)</option>
        <option value="apple">Medium Apple</option>
        <option value="promix">Promix Protein Bar</option>
        <option value="quest">Quest Protein Bar</option>
        <option value="egg">Egg</option>
        <option value="egg_white">Egg White</option>
        <option value="tomato">Tomato</option>
        <option value="green_onion">Green Onion</option>
        <option value="butter">Butter</option>
        <option value="olive_oil_tsp">Olive Oil (1 tsp)</option>
        <option value="olive_oil_tbsp">Olive Oil (1 tbsp)</option>
        <option value="protein_icecream">Protein Ice Cream</option>
      </select>

      <h2>Log Custom Food</h2>
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

      <h2>Log Manual Burn</h2>
      <form onSubmit={handleManualBurn}>
        <input name="burn" type="number" placeholder="Calories burned" required />
        <button type="submit">Add</button>
      </form>

      <h2>Log Workout</h2>
      <form onSubmit={handleExerciseLog}>
        <select name="type" required>
          <option value="pushups">Push-ups</option>
          <option value="pullups">Pull-ups</option>
          <option value="bicep_curls">Bicep Curls</option>
          <option value="bench_press">Bench Press</option>
          <option value="tricep_pulls">Tricep Pulls</option>
          <option value="leg_press">Leg Press</option>
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

      <h2>Log Weight</h2>
      <form onSubmit={handleWeightLog}>
        <input name="weight" type="number" step="0.1" placeholder="Weight (lbs)" required />
        <button type="submit">Add</button>
      </form>

      <h3>Weight History</h3>
      <ul>
        {weightLog.map((entry, index) => (
          <li key={index}>{entry.date}: {entry.weight} lbs</li>
        ))}
      </ul>
    </div>
  );
}
