import { DataTypes } from 'sequelize';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  AllowNull,
  // ForeignKey,
} from 'sequelize-typescript';

export interface IPhoto {
  id: string;
  censusId: string;
  herdId: string;
  fullUrl: string;
  thumbUrl: string;
}

@Table({
  tableName: 'photos',
})
class Photo extends Model<IPhoto> implements IPhoto {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column({ type: DataTypes.UUID })
    id: string;

  // Census and Herd tables not created yet, foreign keys not possible
  // @ForeignKey(() => CowCensus)
  @Column(DataTypes.STRING)
    censusId: string;

  // @ForeignKey(() => Herd)
  @Column(DataTypes.STRING)
    herdId: string;

  @AllowNull(false)
  @Column(DataTypes.STRING)
    fullUrl: string;

  @AllowNull(false)
  @Column(DataTypes.STRING)
    thumbUrl: string;
}

export default Photo;
