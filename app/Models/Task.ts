import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  ManyToMany,
  belongsTo,
  column,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Project from './Project'
import User from './User'

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public projectId: number

  @belongsTo(() => Project)
  public project: BelongsTo<typeof Project>

  @column()
  public title: string

  @column()
  public description: string

  @column.dateTime({
    serializeAs: 'startDate',
  })
  public startDate: DateTime

  @column.dateTime({
    serializeAs: 'endDate',
  })
  public endDate: DateTime

  @column({
    serializeAs: 'manDayValue',
  })
  public manDayValue: number

  // 0: not started, 1: in progress, 2: completed
  @column()
  public status: number

  @manyToMany(() => User, {
    pivotTable: 'task_users',
  })
  public users: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  public updatedAt: DateTime
}
