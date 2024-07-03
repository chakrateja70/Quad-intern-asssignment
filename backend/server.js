import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import axios from 'axios';

import Crypto from './models/crypto.js';
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/cryptoDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

    const fetchData = async (criterion) => {
        try {
            const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
            const data = response.data;
    
            const sortedData = Object.values(data)
                .sort((a, b) => {
                    if (criterion === 'name' || criterion === 'base_unit') {
                        return a[criterion].localeCompare(b[criterion]);
                    } else {
                        return b[criterion] - a[criterion];
                    }
                })
                .slice(0, 10);
    
            return sortedData;
        } catch (error) {
            console.error(error);
        }
    };
    
    const updateDatabase = async (criterion) => {
        const top10 = await fetchData(criterion);
        await Crypto.deleteMany({});
        top10.forEach(async (crypto) => {
            const newCrypto = new Crypto({
                name: crypto.name,
                last: crypto.last,
                buy: crypto.buy,
                sell: crypto.sell,
                volume: crypto.volume,
                base_unit: crypto.base_unit,
            });
            await newCrypto.save();
        });
    };
    
    app.get('/api/crypto', async (req, res) => {
        try {
            const criterion = req.query.criterion || 'volume';
            await updateDatabase(criterion);
            const cryptos = await Crypto.find({});
            res.json(cryptos);
        } catch (error) {
            res.status(500).send(error);
        }
    });
app.listen(5500, '0.0.0.0', () => {
    console.log('server is running at http://localhost:3000');
    updateDatabase('volume');
})