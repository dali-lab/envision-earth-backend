import { DataTypes } from 'sequelize';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  AllowNull,
  BelongsToMany,
} from 'sequelize-typescript';
import UserModel, { IUser } from 'db/models/user';
import Membership from 'db/models/membership';

export enum TeamScopes {
  User = 'USER',
  Contributor = 'CONTRIBUTOR',
  Owner = 'OWNER',
}

export interface ITeam {
  id: string;
  name: string;
}

@Table({
  tableName: 'teams',
})
class Team extends Model<ITeam> implements ITeam {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column({ type: DataTypes.UUID })
    id: string;

  @AllowNull(false)
  @Column(DataTypes.STRING)
    name: string;

  @BelongsToMany(() => UserModel, () => Membership)
    members: IUser[];
}

export default Team;
