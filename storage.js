import mysql from 'mysql2';
import config from 'config';

const getConnection = () => {
  let con = mysql.createConnection({
    host: config.get('db_host'),
    user: config.get('db_user'),
    password: config.get('db_password'),
    database: config.get('db_database')
  });
  con.connect();

  return con;
};

export const addMessage = (roomName, userName, message) => {
  let con = getConnection();
  con.query(
    'INSERT INTO messages (room_name, user_name, message) VALUES (?, ?, ?)',
    [roomName, userName, message]
  );
  con.end();
};

export const getMessageList = (roomName, callback) => {
  let con = getConnection();

  const selectQuery = `
    SELECT
      *
    FROM
      (SELECT
        room_name AS roomName,
        user_name AS userName,
        message AS message,
        DATE_FORMAT(create_at, '%Y-%m-%d %T') AS createAt
      FROM
        messages
      WHERE
        room_name = ?
      ORDER BY
        create_at DESC
      LIMIT
        ?) AS t
    ORDER BY
      t.createAt`;

  con.query(selectQuery, [
    roomName,
    config.get('init_message_size')
  ], callback);

  con.end();
};
