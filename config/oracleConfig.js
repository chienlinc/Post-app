const oracledb = require('oracledb')

const dbConfig = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_URI
}

getOracleDBConnection = async () => {
  try {
    const connection = await oracledb.getConnection(dbConfig)
    console.log(`Connected to OracleDB ${dbConfig.connectString}`)
    return connection
  } catch (error) {
    console.error("Error connecting to OracleDB:", error)
    throw error
  }
}

module.exports = { getOracleDBConnection }