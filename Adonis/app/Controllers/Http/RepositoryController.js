'use strict'

const User = use('App/Models/User')
const Repository = use('App/Models/Repository')
const Database = use('Database')
const { validateAll } = use('Validator')


class RepositoryController {
    async index({ response })
    {
        try
        {
            var repositories = await Database.raw(
                'SELECT repositories.*, COUNT(repositories_stars.repository_id) as stars '+
                'FROM repositories '+
                'LEFT JOIN repositories_stars ON repositories_stars.repository_id = repositories.id '+
                'GROUP BY repositories.id')

            return repositories
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
            const username = params.id
            const users = await User.findBy('username', username)

            if(!users)
            {
                return response.status(200).send({ message: 'O usuarios não está cadastrado.' })
            }

            var repositories = await Database.raw(
                'SELECT repositories.*, COUNT(repositories_stars.repository_id) as stars '+
                'FROM repositories '+
                'LEFT JOIN repositories_stars ON repositories_stars.repository_id = repositories.id '+
                'WHERE repositories.user_username = ? GROUP BY repositories.id', [username])

            return repositories
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
            const data = request.only(["user_username", "titulo", "descricao"])
            const users = await User.findBy('username', data.user_username)

            if(!users)
            {
                return response.status(200).send({ message: 'Usuarios não cadastrados não podem ter repositórios.' })
            }

            const dataValidationSchema = {
                user_username: 'required',
                titulo: 'required',
                descricao: 'required'
            }

            const validation = await validateAll(data, dataValidationSchema)
            
            if(validation.fails())
            {
                return response.status(401).send({ message: validation.messages()})
            }

            const repositories = await Repository.create(data)           

            return repositories
        }
        catch (err)
        {
            return response.status(500).send({ error: `Erro: ${err.message}` })
        }
    }

    async update({ params, request, response })
    {
        try
        {
            const data = request.only(["user_username", "titulo", "descricao"])
            const repositories = await Repository.findBy('id', params.id)

            if(!repositories)
            {
                return response.status(200).send({ message: 'Repositorio não cadastrado' })
            }
    
            Object.keys(data).forEach(k => {
                if(data[k])
                {
                    repositories[k] = data[k];
                }
            })

            await repositories.save()

            return repositories
            
        }
        catch (err)
        {
            return response.status(500).send({ error: `Erro: ${err.message}` })
        }
    }

    async destroy({ params, response })
    {
        try
        {
            const repositories = await Repository.findBy('id', params.id)

            if(!repositories)
            {
                return response.status(200).send({ message: 'Repositório não cadastrado.' })
            }

            const repositories_stars = await Database.raw('SELECT id FROM repositories WHERE user_username = ?', [params.id])
            await RepositoriesStar.query().whereIn('id', repositories_stars).delete()

            await repositories.delete()
            return response.status(200).send({ message: 'Repositório apagado.' })
            
        }
        catch (err)
        {
            return response.status(500).send({ error: `Erro: ${err.message}` })
        }
    }
}

module.exports = RepositoryController
