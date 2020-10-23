'use strict'

const User = use('App/Models/User')
const Repository = use('App/Models/Repository')
const RepositoriesStar = use('App/Models/RepositoriesStar')

class RepositoriesStarController {
    async index({ response })
    {
        try
        {
            const repositories_stars = await RepositoriesStar.all()

            return repositories_stars
        }
        catch (err)
        {
            return response.status(500).send({ error: `Erro: ${err.message}` })
        }
    }
    
    async show({ params, response })
    {
        try
        {
            const id = params.id
            const repositories = await Repository.findBy('id', id)

            if(!repositories)
            {
                return response.status(200).send({ message: 'Repositório não cadastrado.' })
            }

            const repositories_stars = await RepositoriesStar.query().where('repository_id', id).getCount()
            
            return repositories_stars
            
        }
        catch (err)
        {
            return response.status(500).send({ error: `Erro: ${err.message}` })
        }
    }

    async store({ request, response })
    {
        try
        {
            const data = request.only(["user_username", "repository_id"])
            const users = await User.findBy('username', data.user_username)
            const repositories = await Repository.findBy('id', data.repository_id)

            if(!users)
            {
                return response.status(200).send({ message: 'Usuario não cadastrado.' })
            }
            if(!repositories)
            {
                return response.status(200).send({ message: 'Repositorio não cadastrado.' })
            }

            var repositories_stars = await RepositoriesStar.query().where({
                user_username: data.user_username,
                repository_id: data.repository_id
            }).fetch()

            if(repositories_stars.rows.length === 0)
            {
                repositories_stars = await RepositoriesStar.create(data)    
            }
            else
            {
                return response.status(200).send({ message: `O usuario ${data.user_username} já favoritou o repositorio ${repositories.titulo}`})
            }            

            return repositories_stars
        }
        catch (err)
        {
            return response.status(500).send({ error: `Erro: ${err.message}` })
        }
    }

    async destroy({ request, response })
    {
        try
        {
            const data = request.only(["user_username", "repository_id"])
            const users = await User.findBy('username', data.user_username)
            const repositories = await Repository.findBy('id', data.repository_id)

            if(!users)
            {
                return response.status(200).send({ message: 'Usuario não cadastrado.' })
            }
            if(!repositories)
            {
                return response.status(200).send({ message: 'Repositorio não cadastrado.' })
            }

            var repositories_stars = await RepositoriesStar.query().where({
                user_username: data.user_username,
                repository_id: data.repository_id
            }).fetch()

            if(!(repositories_stars.rows.length === 0))
            {
                await RepositoriesStar.query().where({
                    user_username: data.user_username,
                    repository_id: data.repository_id
                }).delete() 
            }
            else
            {
                return response.status(200).send({ message: `O usuario ${data.user_username} não favoritou o repositório ${repositories.titulo}`})
            }
            
            return response.status(200).send({ message: `O usuario ${data.user_username} desfavoritou o repositório ${repositories.titulo}`})
            
        }
        catch (err)
        {
            return response.status(500).send({ error: `Erro: ${err.message}` })
        }
    }

}

module.exports = RepositoriesStarController
