import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/', 'TasksController.create')
  Route.get('/:id', 'TasksController.show')
  Route.post('/:id/edit', 'TasksController.edit')
})
  .prefix('tasks')
  .middleware('auth:web')
