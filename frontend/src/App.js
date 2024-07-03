import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Loader from './Loader/Loader';
import ThemeContext from './ThemeContext';

import './App.css';

function App() {
    const [cryptos, setCryptos] = useState([]);
    const [criterion, setCriterion] = useState('volume');
    const [loading, setLoading] = useState(false);

    const { darkMode, toggleTheme } = useContext(ThemeContext);

    const fetchCryptos = async (criterion) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5500/api/crypto?criterion=${criterion}`);
            setCryptos(response.data);
        } catch (error) {
            console.error('Error fetching data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCryptos(criterion);
    }, [criterion]);

    return (
        <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
            <h1>Crypto Dashboard</h1>
            <div className='header'>
                <div>
                    <label htmlFor="sort-criterion">Sort by: </label>
                    <select
                        id="sort-criterion"
                        value={criterion}
                        onChange={(e) => setCriterion(e.target.value)}
                    >
                        <option value="name">Name</option>
                        <option value="last">Last</option>
                        <option value="buy">Buy</option>
                        <option value="sell">Sell</option>
                        <option value="volume">Volume</option>
                        <option value="base_unit">Base Unit</option>
                    </select>
                </div>
                <button onClick={toggleTheme} className='theme-btn'>
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>
            {loading ? (
                <Loader />
            ) : (
                <table id="crypto-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Last</th>
                            <th>Buy</th>
                            <th>Sell</th>
                            <th>Volume</th>
                            <th>Base Unit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cryptos.map((crypto) => (
                            <tr key={crypto._id}>
                                <td>{crypto.name}</td>
                                <td>{crypto.last}</td>
                                <td>{crypto.buy}</td>
                                <td>{crypto.sell}</td>
                                <td>{crypto.volume}</td>
                                <td>{crypto.base_unit}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default App;
