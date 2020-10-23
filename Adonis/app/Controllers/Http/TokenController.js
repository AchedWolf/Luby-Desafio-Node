'use strict'

const Token = use('App/Models/Token')

class TokenController {
    async index ({ response})
    {
        try
        {
            const tokens = await Token.all()

            return tokens
        }
        catch (err)
        {
            return response.status(500).send({ error: `Erro: ${err.message}` })
        }
    }
}

module.exports = TokenController
