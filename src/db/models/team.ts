import { DataTypes } from 'sequelize';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  AllowNull,
} from 'sequelize-typescript';

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
}

export default Team;
