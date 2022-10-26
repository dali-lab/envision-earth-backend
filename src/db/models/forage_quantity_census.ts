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

export interface IForageQuantityCensus {
  id: string;
  plotId: string;
  photoId: string | null;
  sda: number;
  notes: string;
}

@Table({
  tableName: 'forage_quantity_census',
})
class ForageQuantityCensus extends Model<IForageQuantityCensus> implements IForageQuantityCensus {
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
    sda: number;
  
  @AllowNull(false)
  @Column(DataTypes.NUMBER)
    notes: string;
}

export default ForageQuantityCensus;