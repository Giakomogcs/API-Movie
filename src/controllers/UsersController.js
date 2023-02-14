const {hash, compare} = require("bcrypt")

const sqliteConnection = require("../database/sqlite")
const AppError = require("../utils/AppError")

class UsersController {
  async create(request,response){
    const {name, email, password} = request.body

    const database = await sqliteConnection()
    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

    if(checkUserExists){
      throw new AppError("this email is already in use")
    }

    if(!name){
      throw new AppError("name is required")
    }

    const hashedPassword = await hash(password, 8)

    await database.run(
      'INSERT INTO users (name, email, password) VALUES (?,?,?)', 
      [name, email, hashedPassword])

    return response.status(201).json({name, email, password})
  }

  async update(request, response){
    const {name, email, password, old_password} = request.body
    const {id} = request.params

    const database = await sqliteConnection()
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])

    if(!user){
      throw new AppError("User not found")
    }

    const userWithUpdateEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])

    if(userWithUpdateEmail && userWithUpdateEmail.id !== user.id){
      throw new AppError("this email is already in use")
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    if(password && !old_password){
      throw new AppError("old password is required")
    }

    if(password && old_password){
      const checkOldPassword = await compare(old_password, user.password)

      if(!checkOldPassword){
        throw new AppError("old password does not match")
      }

      user.password = await hash(password, 8)
    }

    await database.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, id]
    )

    return response.json("Update done successfully!")
  }
}
module.exports = UsersController