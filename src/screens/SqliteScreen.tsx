import { open } from '@op-engineering/op-sqlite';
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { db } from '../db';



export default function SqliteScreen() {
    const [path, setPath] = useState("")

    //2
    useEffect(() => {
        loadData();
    }, [])

    async function loadData() {
        console.log('---')
        // const db = open({
        //     name: 'myDB',
        //     location: '../databases',
        // });
        await db.execute(`
            CREATE TABLE IF NOT EXISTS testXYZ (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name Text NOT NULL
);`);

        // await db.execute(`INSERT INTO testXYZ (name) VALUES ('Alice');`);
        // await db.execute(`INSERT INTO testXYZ (name) VALUES ('Test');`);
        // await db.execute(`INSERT INTO testXYZ (name) VALUES ('sdfsdf');`);

        const data = await db.execute("select * from testXYZ");
        console.log(data)
        setPath(db.getDbPath());
    }
    return (
        <View>
            <Text>Sqlite - {path}</Text>
        </View>
    )
}
