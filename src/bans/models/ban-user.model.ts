import { Column, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { User } from 'src/users/models/user.model';

export interface BanUserCreationArgs {
  userId: string;
  adminId: string;
  reason?: string;
}

@Table({ tableName: 'BanUsers' })
export class BanUser extends AbstractModel<BanUser, BanUserCreationArgs> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  adminId: string;

  @Column({
    type: DataType.STRING,
  })
  reason: string;
}
