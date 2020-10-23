'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// ----------- Teste NodeJs -----------
// User
Route.resource('/user', 'UserController').apiOnly()
// Follower
Route.resource('/follower', 'FollowerController').apiOnly()
Route.get('/follower/list/:id', 'FollowerController.show_list')
// Following
Route.resource('/following', 'FollowingController').apiOnly()
Route.get('/following/list/:id', 'FollowingController.show_list')
// Repository
Route.resource('/repository', 'RepositoryController').apiOnly()
// Repositories Star
Route.resource('/repositoriesstar', 'RepositoriesStarController').apiOnly()
Route.get('/repositoriesstar/list/:id', 'RepositoriesStarController.show_list')
// Tokens
Route.get('/test', 'TokenController.index')

// ----------- Teste Logico (tem view) -----------
Route.get('/logico', 'LogicoController.index')

