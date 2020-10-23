'use strict'

const User = use('App/Models/User')
const Following = use('App/Models/Following')

class FollowingController {
    async index({ response })
    {
        try
        {
            const followings = await Following.all()

            return followings
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

            const followings = await Following.query().where('user_username', username).getCount()
            
            return followings
            
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

            const followings = await Following.query().where('user_username', username).fetch()
            
            return followings
            
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
            const data = request.only(["user_username", "following_username"])
            const users1 = await User.findBy('username', data.user_username)
            const users2 = await User.findBy('username', data.following_username)

            if(!users1 || !users2)
            {
                return response.status(200).send({ message: 'Um dos usuarios não está cadastrado.' })
            }

            var followings = await Following.query().where({
                user_username: data.user_username,
                following_username: data.following_username
            }).fetch()

            if(followings.rows.length === 0)
            {
                followings = await Following.create(data)    
            }
            else
            {
                return response.status(200).send({ message: `O usuario ${data.user_username} já está seguindo o usuario ${data.following_username}`})
            }            

            return followings
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
            const data = request.only(["user_username", "following_username"])
            const users1 = await User.findBy('username', data.user_username)
            const users2 = await User.findBy('username', data.following_username)

            if(!users1 || !users2)
            {
                return response.status(200).send({ message: 'Um dos usuarios não está cadastrado.' })
            }

            var followings = await Following.query().where({
                user_username: data.user_username,
                following_username: data.following_username
            }).fetch()

            if(!(followings.rows.length === 0))
            {
                await Following.query().where({
                    user_username: data.user_username,
                    following_username: data.following_username
                }).delete() 
            }
            else
            {
                return response.status(200).send({ message: `O usuario ${data.user_username} não está seguindo o usuario ${data.following_username}`})
            }
            
            return response.status(200).send({ message: `O usuario ${data.user_username} não está mais seguindo o usuario ${data.following_username}` })
            
        }
        catch (err)
        {
            return response.status(500).send({ error: `Erro: ${err.message}` })
        }
    }

}

module.exports = FollowingController
