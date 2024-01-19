import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  HasMany,
  ManyToMany,
  belongsTo,
  column,
  hasMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'

import User from './User'
import Task from './Task'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({
    serializeAs: 'startDate',
  })
  public startDate: DateTime

  @column.dateTime({
    serializeAs: 'endDate',
  })
  public endDate: DateTime

  @column({
    serializeAs: 'userId',
  })
  public userId: number

  @belongsTo(() => User)
  public owner: BelongsTo<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'project_users',
  })
  public users: ManyToMany<typeof User>

  @hasMany(() => Task)
  public tasks: HasMany<typeof Task>

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  public updatedAt: DateTime
}
