import { DataTypes } from 'sequelize';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  AllowNull,
  BelongsToMany,
  Unique,
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
  acreSize: number;
  address: string;
  yrsRanch: number;
  yrsHolMang: number;
  code: string;
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

  @AllowNull(false)
  @Column(DataTypes.NUMBER)
    acreSize: number;

  @AllowNull(false)
  @Column(DataTypes.STRING)
    address: string;

  @AllowNull(false)
  @Column(DataTypes.NUMBER)
    yrsRanch: number;

  @AllowNull(false)
  @Column(DataTypes.NUMBER)
    yrsHolMang: number;

  @Unique
  @AllowNull(false)
  @Column(DataTypes.STRING)
    code: string;

  @BelongsToMany(() => UserModel, () => Membership)
    members: IUser[];
}

export default Team;
