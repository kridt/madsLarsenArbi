import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const startOdds = {
  home: 1.8,
  draw: 3.6,
  away: 4.5,
};

function App() {
  const [sites, setSites] = useState([
    { name: "unibet", odds: { ...startOdds }, money: 2000 },
    { name: "bet365", odds: { ...startOdds }, money: 1000 },
    { name: "leovegas", odds: { ...startOdds }, money: 1000 },
    { name: "bwin", odds: { ...startOdds }, money: 1000 },
    { name: "comeon", odds: { ...startOdds }, money: 2000 },
    { name: "nordicbet", odds: { ...startOdds }, money: 500 },
    { name: "betsson", odds: { ...startOdds }, money: 500 },
    { name: "888sport", odds: { ...startOdds }, money: 500 },
    { name: "bet25", odds: { ...startOdds }, money: 500 },
    { name: "expekt", odds: { ...startOdds }, money: 600 },
    { name: "cashpoint", odds: { ...startOdds }, money: 500 },
    { name: "spreadex", odds: { ...startOdds }, money: 1000 },
    { name: "tipwin", odds: { ...startOdds }, money: 4160 },
  ]);

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (index, field, value) => {
    const updatedSites = [...sites];
    const parsedValue = parseFloat(value.replace(",", ".")) || 0;
    updatedSites[index].odds[field] = parsedValue;
    setSites(updatedSites);
  };

  const handleRemove = (index) => {
    const updatedSites = sites.filter((_, i) => i !== index);
    setSites(updatedSites);
  };

  function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formattedData = sites.map((site) => ({
      homeWin: site.odds.home * site.money,
      draw: site.odds.draw * site.money,
      awayWin: site.odds.away * site.money,
      money: site.money,
    }));

    axios
      .get("https://makebetserver.onrender.com/api/bet", {
        params: {
          data: JSON.stringify(formattedData),
        },
      })
      .then((response) => {
        setResults(response.data.message);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }

  return (
    <div className="App">
      <div className="container">
        <h1>Best Betting Sites</h1>
        <form onSubmit={onSubmit} className="form">
          {sites.map((site, index) => (
            <div key={index} className="site-row">
              <div className="site-header">
                <label className="site-name">{site.name}</label>
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => handleRemove(index)}
                >
                  X
                </button>
              </div>
              <div className="odds-container">
                <div className="odds-labels">
                  <label>1</label>
                  <label>X</label>
                  <label>2</label>
                </div>
                <div className="odds-inputs">
                  <input
                    type="text"
                    name={`home-${site.name}`}
                    defaultValue={site.odds.home.toString().replace(".", ",")}
                    onChange={(e) =>
                      handleChange(index, "home", e.target.value)
                    }
                    placeholder="1,0"
                  />
                  <input
                    type="text"
                    name={`draw-${site.name}`}
                    defaultValue={site.odds.draw.toString().replace(".", ",")}
                    onChange={(e) =>
                      handleChange(index, "draw", e.target.value)
                    }
                    placeholder="1,0"
                  />
                  <input
                    type="text"
                    name={`away-${site.name}`}
                    defaultValue={site.odds.away.toString().replace(".", ",")}
                    onChange={(e) =>
                      handleChange(index, "away", e.target.value)
                    }
                    placeholder="1,0"
                  />
                </div>
              </div>
            </div>
          ))}
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
      {loading && <div className="loading-spinner"></div>}
      {results && (
        <div className="results">
          <h2>Results</h2>
          <div className="results-section">
            <h3>Best Combination</h3>
            <table className="results-table">
              <thead>
                <tr>
                  <th>Site</th>
                  <th>Bet Type</th>
                  <th>Potential Win</th>
                </tr>
              </thead>
              <tbody>
                {results.best_combination.map((bet, index) => {
                  const betType =
                    bet === "1"
                      ? "Home Win"
                      : bet === "X"
                      ? "Draw"
                      : "Away Win";
                  const potentialWin =
                    bet === "1"
                      ? sites[index].odds.home * sites[index].money
                      : bet === "X"
                      ? sites[index].odds.draw * sites[index].money
                      : sites[index].odds.away * sites[index].money;

                  return (
                    <tr key={index}>
                      <td>{sites[index].name}</td>
                      <td>{betType}</td>
                      <td>{potentialWin.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="results-section">
            <h3>Minimum Return</h3>
            <p>{results.min_return}</p>
          </div>
          <div className="results-section">
            <h3>Returns Per Outcome</h3>
            <ul>
              <li>Home Win: {results.returns_per_outcome[0]}</li>
              <li>Draw: {results.returns_per_outcome[1]}</li>
              <li>Away Win: {results.returns_per_outcome[2]}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
