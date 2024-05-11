/* eslint-disable no-console */
import { Model, Column, Table, ForeignKey, Unique, BelongsTo, AfterBulkCreate } from "sequelize-typescript";
import sequelize from "sequelize";
import { StudentModel } from "./StudentModel";
import { SalaryModel } from "./SalaryModel";
import { OfferStatusEnum } from "src/enums";
import { MailerService } from "src/mailer/mailer.service";
import { SendEmailDto } from "../../mailer/mail.interface";

@Table({
  tableName: "OnCampusOffer",
})
export class OnCampusOfferModel extends Model<OnCampusOfferModel> {
  @Column({
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Unique("StudentJobSalaryUnique")
  @ForeignKey(() => StudentModel)
  @Column({
    type: sequelize.UUID,
    allowNull: false,
  })
  studentId: string;

  @BelongsTo(() => StudentModel, {
    foreignKey: "studentId",
    onDelete: "CASCADE",
  })
  student: StudentModel;

  @Unique("StudentJobSalaryUnique")
  @ForeignKey(() => SalaryModel)
  @Column({
    type: sequelize.UUID,
    allowNull: false,
  })
  salaryId: string;

  // Delete OnCampusOffer onDelete of Salary
  @BelongsTo(() => SalaryModel, {
    foreignKey: "salaryId",
    onDelete: "CASCADE",
  })
  salary: SalaryModel;

  @Column({
    type: sequelize.ENUM(...Object.values(OfferStatusEnum)),
    allowNull: false,
  })
  status: OfferStatusEnum;

  @Column({
    type: sequelize.STRING,
  })
  metadata?: string;

  @AfterBulkCreate
  static async sendEmailHook(instance: OnCampusOfferModel) {
    console.log("New entry created");
    const mailerService = new MailerService();

    const dto: SendEmailDto = {
      from: { name: "TPC Portal", address: "aryangkulkarni@gmail.com" },
      recepients: [{ address: "me210003016@iiti.ac.in" }],
      subject: "Test email",
      html: "<p>Hi Aryan, this is a test email</p>",
    };

    // Send email
    await mailerService.sendEmail(dto);
  }
}
