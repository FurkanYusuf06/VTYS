import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Project from 'App/Models/Project'
import User from 'App/Models/User'

export default class ProjectsController {
  public async index({ view, auth }: HttpContextContract) {
    const user = await User.findOrFail(auth.user?.id)
    const projects = await user.related('projects').query().withCount('tasks').withCount('users')

    const data = projects.map((x) => {
      return {
        id: x.id,
        name: x.name,
        startDate: x.startDate.toString(),
        endDate: x.endDate.toString(),
        taskCount: x.$extras.tasks_count,
        userCount: x.$extras.users_count,
      }
    })

    return view.render('projects/index', {
      data,
    })
  }
// CREATE
  public async create({ request, response, auth }: HttpContextContract) {
    const validationSchema = schema.create({
      name: schema.string(),
      startDate: schema.date(),
      endDate: schema.date(),
    })

    const validatedData = await request.validate({
      schema: validationSchema,
    })

    const project = await Project.create({
      name: validatedData.name,
      startDate: validatedData.startDate,
      endDate: validatedData.endDate,
      userId: auth.user?.id as number,
    })

    await project.related('users').attach([auth.user?.id as number])

    return response.redirect(`/projects/${project.id}`)
  }

  public async createPage({ view }: HttpContextContract) {
    return view.render('projects/new')
  }

  public async store({}: HttpContextContract) {}
  
 // SHOW
  public async show({ request, view, auth }: HttpContextContract) {
    const id = request.param('id')
    const project = await Project.find(id)

    if (!project) {
      return view.render('errors/not-found')
    }

    const user = await User.findOrFail(auth.user?.id)

    const isUserInProject = await user.related('projects').query().where('project_id', id).first()

    if (!isUserInProject) {
      return view.render('errors/unauthorized')
    }

    const tasks = (await project.related('tasks').query()).map((x) => x.serialize())

    const users = (await project.related('users').query()).map((x) => x.serialize())

    return view.render('projects/detail', {
      data: project.toJSON(),
      tasks,
      users,
    })
  }

  // ADD USER
  public async addUser({ request, response, auth, view }: HttpContextContract) {
    const id = request.param('id')
    const project = await Project.find(id)

    if (!project) {
      return view.render('errors/not-found')
    }

    const projectUsers = await project
      .related('users')
      .query()
      .where('user_id', auth.user?.id as number)
      .first()

    if (!projectUsers) {
      return view.render('errors/unauthorized')
    }

    const validationSchema = schema.create({
      email: schema.string(),
    })

    const validatedData = await request.validate({
      schema: validationSchema,
    })

    let user = await User.findBy('email', validatedData.email)
    // 
    if (!user) {
      user = await User.create({
        email: validatedData.email,
        password: 'password',
        name: validatedData.email,
      })
    }

    await project.related('users').attach([user.id])

    return response.redirect().back()
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
