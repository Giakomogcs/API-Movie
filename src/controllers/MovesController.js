const knex = require("../database/knex");

class MovesController{
  async create(request,response){
    const {title, description, tags, links} = request.body;
    const user_id = request.user.id;

    const [move_id] = await knex("moves").insert({
      title,
      description,
      user_id
    });

    const tagsInsert = tags.map(name => {
      return{
        move_id,
        name,
        user_id
      }
    });

    await knex("tags").insert(tagsInsert)

    return response.json();
  }

  async show(request,response){
    const{id} = request.params

    const moves = await knex("moves").where({id}).first()
    const tags = await knex("tags").where({move_id: id}).orderBy("name")

    return response.json({
      ...moves,
      tags
    })
  }

  async delete(request,response){
    const {id} = request.params

    await knex("moves").where({id}).delete()

    return response.json("Nota deletada!")
  }

  async index(request,response){
    const {title, tags} = request.query;

    const user_id = request.user.id;
    let moves

    if(tags){
      const filterTags = tags.split(',').map(tag => tag.trim())
      moves = await knex("tags")
      .select([
        "moves.id",
        "moves.title",
        "moves.user_id",
        "tags.name"
      ])
      .where("moves.user_id", user_id)
      .whereLike("moves.title", `%${title}%`)
      .whereIn("name", filterTags)
      .innerJoin("moves","moves.id","tags.moves_id")
      .orderBy("moves.title")
    }
    else{      
      moves = await knex("moves")
      .where({user_id})
      .whereLike("title", `%${title}%`)
      .orderBy("title")
    }

    const userTags = await knex("tags").where({user_id})
    const moveWithTags = moves.map(move => {

      const moveTags = userTags.filter(tag => tag.move_id === move.id)
      return{
        ...move, 
        tags: moveTags
      }
    })

    return response.json({moveWithTags})
  }
}

module.exports = MovesController;