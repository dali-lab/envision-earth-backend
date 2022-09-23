import { DataTypes } from 'sequelize';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  ForeignKey,
  Default,
  AllowNull,
} from 'sequelize-typescript';
import Team from './team';

export interface IHerd {
  id: string;
  teamId: string;
  species: string;
  count: number,
  breedingDate: Date,
  calvingDate: Date,
}

@Table({
  tableName: 'herds',
})
class Herd extends Model<IHerd> implements IHerd {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column({ type: DataTypes.UUID })
    id: string;

  @ForeignKey(() => Team)
  @AllowNull(false)
  @Column(DataTypes.UUID)
    teamId: string;

  @AllowNull(false)
  @Column(DataTypes.STRING)
    species: string;

  @AllowNull(false)
  @Column(DataTypes.NUMBER)
    count: number;
  
  @AllowNull(false)
  @Column(DataTypes.DATE)
    breedingDate: Date;

  @AllowNull(false)
  @Column(DataTypes.DATE)
    calvingDate: Date;
}

export default Herd;
