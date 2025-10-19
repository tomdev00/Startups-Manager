import fastify from 'fastify';
import * as mysql from 'mysql';
import connection from "./connection"

async function getUsersFav(param = null, value = null, param2 = null, value2 = null) {
    try {
      let sql = `SELECT * FROM favourites, user where ${param} = favourites.id_user and ${param} = id`;
      const values:any = [];

      if (param !== null && value !== null) {
          sql += ` WHERE ${param} = ?`;
          values.push(value);
      }

      if (param2 !== null && value2 !== null) {
          if (values.length === 0) {
              sql += ` WHERE ${param2} = ?`;
          } else {
              sql += ` AND ${param2} = ?`;
          }
          values.push(value2);
      }

      const result = await connection.query(sql, values);
      return result;
  } catch (err) {
      console.log('Error retrieving data: ' + err);
  }
}

async function addFavourites(data1 : number, data2 : number) {
try {
    const sql = `INSERT INTO favourites (id_user, id_startup) Values (${data1}, ${data2})`;
    return await connection.query(sql);
    console.log('Favourite added successfully');
}
catch (err) {
    console.log('Error retrieving ingredients data:', err);
}
}

async function deletesFavFromUser(id = null, id2 = null) {
try {
  const sql = `Delete From favourites WHERE id_startup = ${id} and id_user = ${id2}`;
  return await connection.query(sql);
  console.log('Data Deleted successfully');
} catch (err) {
  console.log('Error updating data: ' + err);
}
}

const funcs = {
    getUsersFav, addFavourites, deletesFavFromUser
}

export default funcs;