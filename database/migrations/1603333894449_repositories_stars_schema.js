'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RepositoriesStarsSchema extends Schema {
  up () {
    this.create('repositories_stars', (table) => {
      table.increments()
      table.integer('user_username').unsigned().references('username')
        .inTable('users').onUpdate('CASCADE').onDelete('CASCADE')
      table.integer('repository_id').unsigned().references('id')
        .inTable('repositories').onUpdate('CASCADE').onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('repositories_stars')
  }
}

module.exports = RepositoriesStarsSchema
