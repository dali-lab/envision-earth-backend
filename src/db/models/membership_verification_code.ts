import {
  AllowNull,
  Column,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import Membership from './membership';

export interface IMemberVerificationCode {
  id: string;
  /**
   * Foreign key pointing to the user who created the code
  */
  membershipId: string;
  /**
   * The verification code generated for sharing
  */
  code: string;

  /**
   * The expiration date of the verification code
  */
  expiration: Date;
}

@Table({
  tableName: 'membership_verification_codes',
})
class MemberVerificationCode extends Model<IMemberVerificationCode> implements IMemberVerificationCode {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column({ type: DataTypes.UUID })
    id: string;

  @Unique
  @ForeignKey(() => Membership)
  @AllowNull(false)
  @Column({ type: DataTypes.UUID })
    membershipId: string;

  @AllowNull(false)
  @Column(DataTypes.STRING)
    code: string;

  @AllowNull(false)
  @Column(DataTypes.DATE)
    expiration: Date;
}

export default MemberVerificationCode;
