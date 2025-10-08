
import { Model, DataTypes, CreationOptional, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ImageAttributes {
  id: number;
  reportId: number;
  path: string;
  stage: 'entry' | 'assistance' | 'quality';
}

// Atributos de criação (o 'id' é opcional)
interface ImageCreationAttributes extends Optional<ImageAttributes, 'id'> {}

class Image extends Model<ImageAttributes, ImageCreationAttributes> implements ImageAttributes {
  declare id: number;
  declare reportId: number;
  declare path: string;
  declare stage: 'entry' | 'assistance' | 'quality';
}

Image.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  reportId: { type: DataTypes.INTEGER, allowNull: false },
  path: { type: DataTypes.STRING, allowNull: false },
  stage: { type: DataTypes.STRING, allowNull: false },
}, {
  sequelize,
  tableName: 'images',
  timestamps: true,
});

export default Image;
