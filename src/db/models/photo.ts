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
  fullUrl: string;
}

@Table({
  tableName: 'photos',
})
class Photo extends Model<IPhoto> implements IPhoto {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column({ type: DataTypes.UUID })
    id: string;

  @AllowNull(false)
  @Column(DataTypes.STRING)
    fullUrl: string;
}

export default Photo;
