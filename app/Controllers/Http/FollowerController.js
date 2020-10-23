'use strict'

const User = use('App/Models/User')
const Follower = use('App/Models/Follower')

class FollowerController {
    async index({ response })
    {
        try
        {
            const followers = await Follower.all()

            return followers
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
            
            const followers = await Follower.query().where('user_username', username).getCount()
            
            return followers
            
        }
        catch (err)
        {
            return response.status(500).send({ error: `Erro: ${err.message}` })
        }
    }

    async show_list({ params, response })
    {
        try
        {
            const username = params.id
            const users = await User.findBy('username', username)

            if(!users)
            {
                return response.status(200).send({ message: 'O usuarios não está cadastrado.' })
            }

            const followers = await Follower.query().where('user_username', username).fetch()
            
            return followers
            
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
            const data = request.only(["user_username", "follower_username"])
            const users1 = await User.findBy('username', data.user_username)
            const users2 = await User.findBy('username', data.follower_username)

            if(!users1 || !users2)
            {
                return response.status(200).send({ message: 'Um dos usuarios não está cadastrado.' })
            }

            var followers = await Follower.query().where({
                user_username: data.user_username,
                follower_username: data.follower_username
            }).fetch()

            if(followers.rows.length === 0)
            {
                followers = await Follower.create(data)   
            }
            else
            {
                return response.status(200).send({ message: `O usuario ${data.follower_username} já é seguidor do usuario ${data.user_username}`})
            }            

            return followers
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
            const data = request.only(["user_username", "follower_username"])
            const users1 = await User.findBy('username', data.user_username)
            const users2 = await User.findBy('username', data.follower_username)

            if(!users1 || !users2)
            {
                return response.status(200).send({ message: 'Um dos usuarios não está cadastrado.' })
            }

            const followers = await Follower.query().where({
                user_username: data.user_username,
                follower_username: data.follower_username
            }).fetch()

            if(!(followers.rows.length === 0))
            {
                await Follower.query().where({
                    user_username: data.user_username,
                    follower_username: data.follower_username
                }).delete()
            }
            else
            {
                return response.status(200).send({ message: `O usuario ${data.follower_username} não é seguidor do usuario ${data.user_username}`})
            }
            
            return response.status(200).send({ message: `O usuario ${data.follower_username} não é mais seguidor do usuario ${data.user_username}` })
            
        }
        catch (err)
        {
            return response.status(500).send({ error: `Erro: ${err.message}` })
        }
    }

}

module.exports = FollowerController
