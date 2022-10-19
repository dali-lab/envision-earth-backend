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

export interface ICowCensus {
  id: string;
  herdId: string;
  plotId: string;
  photoId: string | null;
  bcs: number[] | string;
  notes: string;
  tag: string;
}

@Table({
  tableName: 'cow_census',
})
class CowCensus extends Model<ICowCensus> implements ICowCensus {
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
    bcs: number[];
  
  @AllowNull(false)
  @Column(DataTypes.NUMBER)
    notes: string;

  @AllowNull(false)
  @Column(DataTypes.NUMBER)
    tag: string;
}

export default CowCensus;