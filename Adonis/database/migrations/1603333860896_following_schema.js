'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FollowingSchema extends Schema {
  up () {
    this.create('followings', (table) => {
      table.increments()
      table.integer('user_username').unsigned().references('username')
        .inTable('users').onUpdate('CASCADE').onDelete('CASCADE')
      table.integer('following_username').unsigned().references('username')
        .inTable('users').onUpdate('CASCADE').onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('followings')
  }
}

module.exports = FollowingSchema
