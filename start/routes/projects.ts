import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'ProjectsController.index')
  Route.get('/new', 'ProjectsController.createPage')
  Route.get('/:id', 'ProjectsController.show')
  Route.post('/new', 'ProjectsController.create')
  Route.post('/:id/user', 'ProjectsController.addUser')
})
  .prefix('projects')
  .middleware('auth:web')
