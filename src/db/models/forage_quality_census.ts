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
import Plot from './plot';
import Photo from './photo';

export interface IForageQualityCensus {
  id: string;
  plotId: string;
  photoId: string | null;
  rating: number;
  notes: string;
}

@Table({
  tableName: 'forage_quality_census',
})
class ForageQualityCensus extends Model<IForageQualityCensus> implements IForageQualityCensus {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column({ type: DataTypes.UUID })
    id: string;

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
    rating: number;
  
  @AllowNull(false)
  @Column(DataTypes.NUMBER)
    notes: string;
}

export default ForageQualityCensus;