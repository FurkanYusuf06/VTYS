import './routes/auth'
import './routes/projects'
import './routes/tasks'

import Route from '@ioc:Adonis/Core/Route'

Route.get('*', async ({ view }) => {
  return view.render('errors/not-found')
}).middleware('auth')
