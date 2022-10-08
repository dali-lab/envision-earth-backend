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

export interface ICowCensus {
  id: string;
  herdId: string;
  photoId: string | null;
  bcs: number,
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

  @AllowNull(true)
  @Column(DataTypes.STRING)
    photoId: string;

  @AllowNull(false)
  @Column(DataTypes.NUMBER)
    bcs: number;
  
  @AllowNull(false)
  @Column(DataTypes.NUMBER)
    notes: string;

  @AllowNull(false)
  @Column(DataTypes.NUMBER)
    tag: string;
}

export default CowCensus;