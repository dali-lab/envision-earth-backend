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
import Photo from './photo';

export interface IPlot {
  id: string;
  teamId: string;
  photoId: string | null;
  latitude: number;
  longitude: number;
  length: number;
  width: number;
  name: string;
}

@Table({
  tableName: 'plots',
})
class Plot extends Model<IPlot> implements IPlot {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column({ type: DataTypes.UUID })
    id: string;

  @ForeignKey(() => Team)
  @AllowNull(false)
  @Column(DataTypes.UUID)
    teamId: string;

  @ForeignKey(() => Photo)
  @AllowNull(false)
  @Column(DataTypes.UUID)
    photoId: string;

  @Column(DataTypes.FLOAT)
    latitude: number;

  @Column(DataTypes.FLOAT)
    longitude: number;

  @Column(DataTypes.FLOAT)
    length: number;

  @Column(DataTypes.FLOAT)
    width: number;
  
  @Column(DataTypes.STRING)
    name: string;
}

export default Plot;
