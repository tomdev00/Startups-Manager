import fastify from 'fastify';
import * as mysql from 'mysql';
import connection from "./connection"
import favourites from "./favourites"
import server from "../index"

async function addUser(data1: string, data2: string, data3: string) {
  try {
    const sql = `INSERT INTO user (username, password, role) Values ("${data1}", "${data2}", "${data3}")`;
    return await connection.query(sql);
    console.log('User was created successfully');
  }
  catch (err) {
    console.log('Error retrieving ingredients data:', err);
  }
}

async function getUser(username: string, password: string) {
  const params = [];
  params.push(username);
  params.push(password);
  const sql = `SELECT * FROM user WHERE username = ? and password = ?`;
  return await connection.query(sql, params);
}

async function getUserFromTable(argument1: string, argument2: string) {
  try {
    const sql = `SELECT * FROM user WHERE username = ${argument1} and password = ${argument2}`;
    return await connection.query(sql);
    console.log('User found successfully');
  }
  catch (err) {
    console.log('Error retrieving ingredients data:', err);
  }
}

async function verifyAuth(request: any, reply: any) {

  const token = (request.headers as any)['x-access-token'];
  const decoded: any = await server.jwt.verify(token);

  console.log(decoded);

  return decoded;

}

async function creationToken(request: any, reply: any) {

  const { username, password } = (request.headers as any);
  const searchUser: any = await connection.getDataById("user", `"${username}"`, "username");
  const user: any = await getUser(username, password);

  if (!searchUser) {
    return reply.status(401).send({ error: 'Nao existe utilizador' });
  }

  if (!user) {
    return reply.status(401).send({ message: 'Username ou Password incorreta' });
  }

  const token = server.jwt.sign({ id: user[0].id, username: user[0].username, role: user[0].role })

  reply.send({ token });

}

const funcs = {
  addUser, getUserFromTable, getUser, creationToken, verifyAuth
}

export default funcs;