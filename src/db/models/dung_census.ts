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
import Herd from './herd';
import Plot from './plot';
import Photo from './photo';

export interface IDungCensus {
  id: string;
  herdId: string;
  plotId: string;
  photoId: string | null;
  ratings: number[] | string;
  notes: string;
}

@Table({
  tableName: 'dung_census',
})
class DungCensus extends Model<IDungCensus> implements IDungCensus {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column({ type: DataTypes.UUID })
    id: string;

  @ForeignKey(() => Herd)
  @AllowNull(false)
  @Column(DataTypes.UUID)
    herdId: string;

  @ForeignKey(() => Plot)
  @AllowNull(false)
  @Column(DataTypes.UUID)
    plotId: string;

  @ForeignKey(() => Photo)
  @AllowNull(true)
  @Column(DataTypes.STRING)
    photoId: string;

  @AllowNull(false)
  @Column(DataTypes.NUMBER)
    ratings: number[];
  
  @AllowNull(false)
  @Column(DataTypes.NUMBER)
    notes: string;
}

export default DungCensus;