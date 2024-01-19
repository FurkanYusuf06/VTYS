import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Task from 'App/Models/Task'

export default class TasksController {
  public async index({ response, auth }: HttpContextContract) {
    if (!auth.user) {
      return response.unauthorized()
    }

    const tasks = await auth.user.related('tasks').query().withCount('users').preload('project')

    const data = tasks.map((x) => {
      return {
        id: x.id,
        title: x.title,
        startDate: x.startDate.toString(),
        endDate: x.endDate.toString(),
        description: x.description,
        manDayValue: x.manDayValue,
        status: x.status,
        projectId: x.projectId,
        project: x.project,
        userCount: x.$extras.users_count,
      }
    })

    return data
  }
  // CREATE
  public async create({ request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      title: schema.string(),
      startDate: schema.date(),
      endDate: schema.date(),
      description: schema.string(),
      manDayValue: schema.number(),
      projectId: schema.number(),
      users: schema.array().members(schema.number()),
    })

    const validatedData = await request.validate({
      schema: validationSchema,
    })

    const task = await Task.create({
      title: validatedData.title,
      startDate: validatedData.startDate,
      endDate: validatedData.endDate,
      description: validatedData.description,
      manDayValue: validatedData.manDayValue,
      status: 0,
      projectId: validatedData.projectId,
    })

    await task.related('users').attach(validatedData.users)

    return response.redirect().back()
  }

  public async store({}: HttpContextContract) {}
  // SHOW
  public async show({ request, response, view }: HttpContextContract) {
    const taskId = request.param('id')

    const task = await Task.find(taskId)

    if (!task) {
      return response.notFound()
    }

    const project = await task.related('project').query().firstOrFail()
    const users = await task.related('users').query()
    const allUsers = await project.related('users').query()

    return view.render('tasks/detail', {
      data: task.serialize(),
      users: users.map((x) => x.serialize()),
      project: project.serialize(),
      allUsers: allUsers
        .filter((x) => users.findIndex((a) => a.id === x.id) === -1)
        .map((x) => x.serialize()),
    })
  }
  // EDIT
  public async edit({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const validationSchema = schema.create({
      title: schema.string(),
      startDate: schema.date(),
      endDate: schema.date(),
      description: schema.string(),
      manDayValue: schema.number(),
      users: schema.array().members(schema.number()),
      status: schema.number(),
    })

    const validatedData = await request.validate({
      schema: validationSchema,
    })

    const task = await Task.findOrFail(id)

    await task
      .merge({
        title: validatedData.title,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        description: validatedData.description,
        manDayValue: validatedData.manDayValue,
        status: validatedData.status,
      })
      .save()

    await task.related('users').detach()
    if (validatedData.users.length > 0) {
      await task.related('users').sync(validatedData.users)
    }

    return response.redirect().back()
  }

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
