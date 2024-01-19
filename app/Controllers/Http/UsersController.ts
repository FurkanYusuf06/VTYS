import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UsersController {
  // REGISTER
  public async register({ request, response, auth }: HttpContextContract) {
    const validationSchema = schema.create({
      name: schema.string(),
      email: schema.string([rules.email(), rules.unique({ table: 'users', column: 'email' })]),
      password: schema.string([rules.minLength(8)]),
    })

    const validatedData = await request.validate({
      schema: validationSchema,
    })

    await User.create(validatedData)

    await auth.use('web').attempt(validatedData.email, validatedData.password)

    return response.redirect('/projects')
  }
  // LOGIN
  public async login({ request, response, auth }: HttpContextContract) {
    const validationSchema = schema.create({
      email: schema.string(),
      password: schema.string(),
    })

    const validatedData = await request.validate({
      schema: validationSchema,
    })

    await auth.use('web').attempt(validatedData.email, validatedData.password)

    return response.redirect('/projects')
  }

  public async logout({ response, auth }: HttpContextContract) {
    await auth.use('web').logout()

    return response.redirect('/auth/login')
  }

  public loginPage({ view }: HttpContextContract) {
    return view.render('auth/login')
  }

  public registerPage({ view }: HttpContextContract) {
    return view.render('auth/register')
  }
}
