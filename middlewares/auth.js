const { verifyToken } = require("../helpers/jwt");

const auth = (req, res, next) => {
  //obtener el token del header
  const token = req.headers.authorization
  //Verificar que exista el token
  if(!token) return res.status(401).send({msg: 'No hay token. No tienes autorización.'})
  //Verificar que el token sea válido
  const data = verifyToken(token);
  if (data.err) return res.status(401).send({ msg: 'Token no válido. ' + data.err })
  //Añadir usuario al request
  req.user = data.user
  next()
}

module.exports = auth