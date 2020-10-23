'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('nome', 80)
      table.string('email', 254).notNullable().unique()
      table.string('localizacao', 60)
      table.string('avatar', 254)
      table.string('username', 60).notNullable().unique()
      table.string('bio')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
