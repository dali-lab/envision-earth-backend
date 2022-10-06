import { DataTypes } from 'sequelize';
import {
  Table,
  Column,
  Model,
  ForeignKey,
  PrimaryKey,
  Default,
  AllowNull,
  Unique,
} from 'sequelize-typescript';
import { TeamScopes } from './team';
import Team from './team';
import User from './user';

export interface IMembership {
  id: string;
  teamId: string;
  userId: string;
  role: TeamScopes;
}

@Table({
  tableName: 'memberships',
})
class Membership extends Model<IMembership> implements IMembership {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
    id: string;

  @Unique
  @ForeignKey(() => Team)
  @AllowNull(false)
  @Column(DataTypes.UUID)
    teamId: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataTypes.UUID)
    userId: string;

  @AllowNull(false)
  @Column(DataTypes.ENUM({ values: ['UNVERIFIED', 'USER', 'ADMIN'] }))
    role: TeamScopes;
}

export default Membership;
