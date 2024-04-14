import { Column, Table, DataType, HasMany } from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';

export interface SearchCoursesFeedbackCreationArgs {
  title: string;
  price: string;
  language: string;
  userFeedback: boolean;
  foundedCourses: string;
}

@Table({ tableName: 'SearchCoursesFeedbacks' })
export class SearchCoursesFeedback extends AbstractModel<
  SearchCoursesFeedback,
  SearchCoursesFeedbackCreationArgs
> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  price: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  language: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  userFeedback: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  foundedCourses: string;
}
