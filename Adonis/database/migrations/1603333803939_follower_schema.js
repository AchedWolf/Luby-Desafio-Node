'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FollowerSchema extends Schema {
  up () {
    this.create('followers', (table) => {
      table.increments()
      table.integer('user_username').unsigned().references('username')
        .inTable('users').onUpdate('CASCADE').onDelete('CASCADE')
      table.integer('follower_username').unsigned().references('username')
        .inTable('users').onUpdate('CASCADE').onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('followers')
  }
}

module.exports = FollowerSchema
