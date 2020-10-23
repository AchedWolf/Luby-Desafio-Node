'use strict'

const User = use('App/Models/User')
const Token = use('App/Models/Token')
const Follower = use('App/Models/Follower')
const Following = use('App/Models/Following')
const Repository = use('App/Models/Repository')
const RepositoriesStar = use('App/Models/RepositoriesStar')
const Database = use('Database')
const { validateAll } = use('Validator')

class UserController {
    async index({ response })
    {
        try
        {
            const users = await User.all()

            return users
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
            var users = await User.findBy('username', username)

            if(!users)
            {
                return response.status(200).send({ message: 'Usuario não cadastrado' })
            }

            const users_id = await Database.raw('SELECT id FROM users WHERE username = ?', username)
            const tokens = new Token()
            tokens.user_id = users_id[0].id
            await tokens.save()
            
            users = await Database.raw(
                'SELECT users.*, COUNT(DISTINCT followers.id) as follower, COUNT(DISTINCT followings.id) as following, COUNT(DISTINCT repositories.id) as repositor '+
                'FROM users '+
                'LEFT JOIN followers ON followers.user_username = users.username  '+
                'LEFT JOIN followings ON followings.user_username = users.username  '+
                'LEFT JOIN repositories ON repositories.user_username = users.username  '+
                'WHERE users.username = ? GROUP BY users.username', [username])

            return users
            
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
            const dataValidationSchema = {
                nome: 'required',
                email: 'required|unique:users', 
                localizacao: 'required', 
                avatar: 'required', 
                username: 'required|unique:users',
                bio: 'required'
            }

            const validation = await validateAll(request.all(), dataValidationSchema)
            
            if(validation.fails())
            {
                return response.status(401).send({ message: validation.messages()})
            }

            const data = request.only(["nome", "email", "localizacao", "avatar", "username", "bio"])
            const users = await User.create(data)

            return users
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
            const data = request.only(["nome", "email", "localizacao", "avatar", "bio"])
            const users = await User.findBy('username', params.id)

            if(!users)
            {
                return response.status(200).send({ message: 'Usuario não cadastrado' })
            }
    
            Object.keys(data).forEach(k => {
                if(data[k])
                {
                    users[k] = data[k];
                }
            })

            await users.save()

            return users
            
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
            const users = await User.findBy('username', params.id)

            if(!users)
            {
                return response.status(200).send({ message: 'Usuario não cadastrado' })
            }
            
            await Follower.query().where(function() {
                    this.where('user_username', params.id)
                    .orWhere('follower_username', params.id)
                }).delete()
            
            await Following.query().where(function() {
                    this.where('user_username', params.id)
                    .orWhere('following_username', params.id)
                }).delete()

            const repositories = await Database.raw('SELECT id FROM repositories WHERE user_username = ?', [params.id])

            await Repository.query().where('user_username', params.id).delete()

            await RepositoriesStar.query().whereIn('id', repositories).delete()

            await users.delete()
            
            return response.status(200).send({ message: 'Usuario apagado' })
            
        }
        catch (err)
        {
            return response.status(500).send({ error: `Erro: ${err.message}` })
        }
    }
}

module.exports = UserController
