import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/login', 'UsersController.loginPage')
  Route.post('/login', 'UsersController.login')
  Route.get('/register', 'UsersController.registerPage')
  Route.post('/register', 'UsersController.register')
}).prefix('auth')
