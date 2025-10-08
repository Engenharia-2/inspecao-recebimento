import { Model, DataTypes, CreationOptional, Optional } from 'sequelize';
import sequelize from '../config/database';


import Image from './image';

// Interface para os atributos do modelo
interface RelatorioAttributes {
  id: number;
  op?: string;
  openDate?: string;
  serialNumber?: string;
  model?: string;
  orderType?: string;
  invoice?: string;
  entryTechnician?: string;
  returnItems?: object; // JSON

  cleanCheck_equipmentCleaning?: boolean;
  cleanCheck_screws?: boolean;
  cleanCheck_hotGlue?: boolean;
  cleanCheck_measurementCables?: boolean;
  defect_part?: string;
  defect_cause?: string;
  defect_solution?: string;
  defect_observations?: string;
  assistanceTechnician?: string;
  workingCheck_powerOn?: boolean;
  workingCheck_buttonsLeds?: boolean;
  workingCheck_predefinedTests?: boolean;
  workingCheck_screen?: boolean;
  workingCheck_caseMembranes?: boolean;

  finalCheck_case?: boolean;
  finalCheck_membrane?: boolean;
  finalCheck_buttons?: boolean;
  finalCheck_screen?: boolean;
  finalCheck_test?: boolean;
  finalCheck_saveReports?: boolean;
  finalCheck_calibrationPrint?: boolean;
  finalCheck_backup?: boolean;
  qualityTechnician?: string;
  qualityObservations?: string;

  customFields?: object; // JSON

  name?: string;
  startTime?: Date;
  endTime?: Date | null;
  
  createdAt?: Date;
  updatedAt?: Date;

  // Propriedade para incluir imagens
  images?: Image[];
}

// Atributos de criação (o 'id' é opcional)
interface RelatorioCreationAttributes extends Optional<RelatorioAttributes, 'id'> {}

class Relatorio extends Model<RelatorioAttributes, RelatorioCreationAttributes> implements RelatorioAttributes {
  declare id: number;
  declare op?: string;
  declare openDate?: string;
  declare serialNumber?: string;
  declare model?: string;
  declare orderType?: string;
  declare invoice?: string;
  declare entryTechnician?: string;
  declare returnItems?: object;

  declare cleanCheck_equipmentCleaning?: boolean;
  declare cleanCheck_screws?: boolean;
  declare cleanCheck_hotGlue?: boolean;
  declare cleanCheck_measurementCables?: boolean;
  declare defect_part?: string;
  declare defect_cause?: string;
  declare defect_solution?: string;
  declare defect_observations?: string;
  declare assistanceTechnician?: string;
  declare workingCheck_powerOn?: boolean;
  declare workingCheck_buttonsLeds?: boolean;
  declare workingCheck_predefinedTests?: boolean;
  declare workingCheck_screen?: boolean;
  declare workingCheck_caseMembranes?: boolean;

  declare finalCheck_case?: boolean;
  declare finalCheck_membrane?: boolean;
  declare finalCheck_buttons?: boolean;
  declare finalCheck_screen?: boolean;
  declare finalCheck_test?: boolean;
  declare finalCheck_saveReports?: boolean;
  declare finalCheck_calibrationPrint?: boolean;
  declare finalCheck_backup?: boolean;
  declare qualityTechnician?: string;
  declare qualityObservations?: string;

  declare customFields?: object;

  declare name?: string;
  declare startTime?: Date;
  declare endTime?: Date | null;

  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;

  declare images?: Image[];
}

Relatorio.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  op: { type: DataTypes.STRING },
  openDate: { type: DataTypes.STRING },
  serialNumber: { type: DataTypes.STRING },
  model: { type: DataTypes.STRING },
  orderType: { type: DataTypes.STRING },
  invoice: { type: DataTypes.STRING },
  entryTechnician: { type: DataTypes.STRING },
  returnItems: { type: DataTypes.JSON },

  cleanCheck_equipmentCleaning: { type: DataTypes.BOOLEAN },
  cleanCheck_screws: { type: DataTypes.BOOLEAN },
  cleanCheck_hotGlue: { type: DataTypes.BOOLEAN },
  cleanCheck_measurementCables: { type: DataTypes.BOOLEAN },
  defect_part: { type: DataTypes.STRING },
  defect_cause: { type: DataTypes.STRING },
  defect_solution: { type: DataTypes.STRING },
  defect_observations: { type: DataTypes.TEXT },
  assistanceTechnician: { type: DataTypes.STRING },
  workingCheck_powerOn: { type: DataTypes.BOOLEAN },
  workingCheck_buttonsLeds: { type: DataTypes.BOOLEAN },
  workingCheck_predefinedTests: { type: DataTypes.BOOLEAN },
  workingCheck_screen: { type: DataTypes.BOOLEAN },
  workingCheck_caseMembranes: { type: DataTypes.BOOLEAN },

  finalCheck_case: { type: DataTypes.BOOLEAN },
  finalCheck_membrane: { type: DataTypes.BOOLEAN },
  finalCheck_buttons: { type: DataTypes.BOOLEAN },
  finalCheck_screen: { type: DataTypes.BOOLEAN },
  finalCheck_test: { type: DataTypes.BOOLEAN },
  finalCheck_saveReports: { type: DataTypes.BOOLEAN },
  finalCheck_calibrationPrint: { type: DataTypes.BOOLEAN },
  finalCheck_backup: { type: DataTypes.BOOLEAN },
  qualityTechnician: { type: DataTypes.STRING },
  qualityObservations: { type: DataTypes.TEXT },

  customFields: { type: DataTypes.JSON },

  name: { type: DataTypes.STRING },
  startTime: { type: DataTypes.DATE },
  endTime: { type: DataTypes.DATE, allowNull: true },
}, {
  sequelize,
  tableName: 'relatorios'
});

// Define a associação
Relatorio.hasMany(Image, { foreignKey: 'reportId', as: 'images' });
Image.belongsTo(Relatorio, { foreignKey: 'reportId' });

export default Relatorio;