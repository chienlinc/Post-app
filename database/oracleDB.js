const oracledb = require('oracledb');
const { getOracleDBConnection } = require('../config/oracleConfig');

runQuery = async (sql, binds = [], options = {}) => {
    let connection
    try {
        connection = await getOracleDBConnection()
        const result = await connection.execute(sql, binds, options)
        await connection.commit()
        return result
    } catch (error){
        console.error("Error executing query:", error)
        throw error
    } finally {
        if (connection){
            try {
                await connection.close();
            } catch (error) {
                console.error("Error closing OracleDB connection:", error)
            }
        }
    }
}

insertUserToOracleDB = async () => {
    try {
        await runQuery(`
            BEGIN 
                EXECUTE IMMEDIATE 'DROP TABLE app_user'; 
            EXCEPTION 
                WHEN others THEN
                    IF sqlcode <> -942 THEN
                        RAISE; 
                    END IF; 
            END;
            `)

        await runQuery(`
            CREATE TABLE app_user (
                ID number generated always as identity,
                NAME varchar2(50),
                EMAIL varchar2(50),
                BIO varchar2(100),
                CREATION_TS timestamp with time zone default current_timestamp,
                primary key (ID)
            )
            `)

        const result = await runQuery(
            `INSERT INTO app_user (name, email, bio) VALUES (:name, :email, :bio)`,
            {
                name: "Jenny",
                email: "jenny@example.com",
                bio: "Software developer with a passion for continuous skill development."
            },
            { autoCommit: true }
        )
        console.log(result.rowsAffected, "Rows Inserted");
    } catch (error){
        console.error("Error inserting user data:", error)
    }
}

getUserDetail = async () => {
    try {
        const result = await runQuery(
            `SELECT name, email, bio FROM app_user WHERE id=1`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        )
        return result.rows[0]
    } catch (error) {
        console.error("Error retrieving user data:", error)
    }
}

module.exports = { insertUserToOracleDB, getUserDetail }