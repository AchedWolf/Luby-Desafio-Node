'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RepositoriesSchema extends Schema {
  up () {
    this.create('repositories', (table) => {
      table.increments()
      table.integer('user_username').unsigned().references('username')
        .inTable('users').onUpdate('CASCADE').onDelete('CASCADE')
      table.string('titulo').notNullable()
      table.string('descricao').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('repositories')
  }
}

module.exports = RepositoriesSchema
