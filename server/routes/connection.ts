import fastify from 'fastify';
import * as mysql from 'mysql';
import users from "./user"
import db from "../sql/db"
import server from "../index"

const connection = {
  host: db.host,
  database: db.database,
  user: db.user,
  password: db.password
};

async function query(sql: string | mysql.QueryOptions, values: (number | string | undefined)[] = []) {
  var con = mysql.createConnection(connection)
  con.connect();
  let promise = new Promise((resolve, reject) => {
    con.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });

  });
  con.end();
  return promise;
}

async function getData(table: string, param = null, value = null, param2 = null, value2 = null) {
  try {
    let sql = `SELECT * FROM ${table}`;
    return await query(sql);
  } catch (err) {
    console.log('Error retrieving data: ' + err);
  }
}

async function getDataById(table: string, id: string | number, value: string = "id") {
  try {
    let sql = `SELECT * FROM ${table} WHERE ${value} = ${id}`;
    return await query(sql);
  } catch (err) {
    console.log('Error retrieving data: ' + err);
  }
}

async function addData(table: string, argument: string, data: string) {
  try {
    const sql = `INSERT INTO ${table} (${argument}) Values ("${data}")`;
    return await query(sql);
    console.log('Data added successfully');
  }
  catch (err) {
    console.log('Error retrieving ingredients data:', err);
  }
}

async function editDataById(table: string, column: string, data: string, id = null) {
  try {
    const sql = `UPDATE ${table} SET ${column} = "${data}" WHERE id = ${id}`;
    return await query(sql);
    console.log('Data updated successfully');
  } catch (err) {
    console.log('Error updating data: ' + err);
  }
}

async function deleteDataById(table: string, id = null) {
  try {
    const sql = `Delete From ${table} WHERE id = ${id}`;
    return await query(sql);
    console.log('Data Deleted successfully');
  } catch (err) {
    console.log('Error updating data: ' + err);
  }
}

function tokenVerifier(request : any, reply : any, done: any) {
  const token = (request.headers as any)['x-access-token'];

  if (!token) {
    return reply.status(401).send({ message: 'Token não fornecido' });
  }

    let decoded: any;
    try {
      decoded = server.jwt.verify(token);
    } catch (error) {
      return reply.status(401).send({ message: 'Invalid Token' });
    }

    if (decoded.username == undefined) return reply.status(401).send({ message: 'Invalid Token' });
    if(decoded !== undefined) {
      done();
    } else {
        return reply.status(403).send({ message: 'Invalid Token' });
    }
};

function adminVerifier(request : any, reply : any, done: any) {
    const token = (request.headers as any)['x-access-token'];

    if (!token) {
      return reply.status(401).send({ message: 'Token não fornecido' });
    }

    try {

      const decoded: any = server.jwt.verify(token);

      if (decoded.username == undefined) return reply.status(401).send({ message: 'Invalid Token' });
      if(decoded.role == "admin") {
        done();
      } else {
          return reply.status(403).send({ message: 'Access Denied' });
      }
    } catch (error) {
      console.error(error);
      return reply.status(401).send({ message: 'Invalid Token' });
    }
  };

  function accessVerifier (request : any, reply : any, done: any) {
    const token = (request.headers as any)['x-access-token'];

    if (!token) {
      return reply.status(401).send({ message: 'Token não fornecido' });
    }

    try {
      const decoded: any = server.jwt.verify(token);

      if (decoded.username == undefined) return reply.status(401).send({ message: 'Invalid Token' });
      if (decoded.id == (request.params as any).id) {
        done();
      } else {
          return reply.status(403).send({ message: 'Access Denied' });
      }
    } catch (error) {
      console.error(error);
      return reply.status(401).send({ message: 'Invalid Token' });
    }
  };

const funcs = {
  getData,
  editDataById,
  deleteDataById,
  query,
  addData,
  getDataById,
  adminVerifier,
  tokenVerifier,
  accessVerifier
}
export default funcs;
