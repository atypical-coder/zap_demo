import { SQLite } from "expo-sqlite";

import Configs from "../Configs.js";

const db = SQLite.openDatabase('zapdemo.db');

export default class CountryService {

    static checkDbData = () => new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='countries';",
                null,
                (_, { rows: { length } }) => {
                    if (length === 0) {
                        this.createDbTable()
                            .then(() => resolve(length))
                            .catch((error) => reject(error))
                    } else {
                        resolve(length)
                    }
                },
                (tx, error) => reject(error)
            );
        });
    });

    static createDbTable = () => new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS countries (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` TEXT NOT NULL, `capital` TEXT NOT NULL, `region` TEXT NOT NULL, `subregion` TEXT NOT NULL, `population` INTEGER NOT NULL, `area` INTEGER, `currencies` TEXT NOT NULL, `lat` REAL, `lng` REAL);",
                null,
                () => resolve(),
                (tx, error) => reject(error),
            );
        });
    });

    static downloadCountries = () => new Promise((resolve, reject) => {
        this.getAPI("https://restcountries-v1.p.rapidapi.com/all")
            .then(response => response.json())
            .then(countries => {
                db.transaction(tx => {
                    countries.map(item => {
                        tx.executeSql(
                            "INSERT INTO countries (`name`, `capital`, `region`, `subregion`, `population`, `area`, `currencies`, `lat`, `lng`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                            [item.name, item.capital, item.region, item.subregion, item.population, item.area, JSON.stringify(item.currencies), item.latlng[0], item.latlng[1]], null, (tx, error) => reject(error));
                    })
                });
                resolve();
            })
    });

    static getCountries = () => new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                "SELECT * FROM countries;",
                null,
                (_, { rows: { _array } }) => resolve(_array),
                (tx, error) => reject(error)
            );
        });
    });


    static getAPI = (url) => fetch(url, {
        method: "GET",
        mode: "no-cors",
        cache: "default",
        headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": "restcountries-v1.p.rapidapi.com",
            "X-RapidAPI-Key": Configs.apiKey
        },
        redirect: "follow",
        referrer: "no-referrer"
    })

}