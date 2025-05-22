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
