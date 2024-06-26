import {
  NestedBoolean,
  NestedDate,
  NestedEmail,
  NestedEnum,
  NestedNumber,
  NestedObject,
  NestedString,
  NestedUUID,
} from "src/decorators/dto";
import {
  CompanyCategoryEnum,
  DepartmentEnum,
  EventTypeEnum,
  JobCoordinatorRoleEnum,
  SeasonTypeEnum,
  TpcMemberRoleEnum,
  IndustryDomainEnum,
} from "src/enums";
import { SelectionProcedureDto } from "src/job/dtos/jaf.dto";

class CompanyDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  name: string;

  @NestedEnum(CompanyCategoryEnum, {})
  category: CompanyCategoryEnum;
}

class CompanyExDto extends CompanyDto {
  @NestedEnum(IndustryDomainEnum, { isArray: true })
  domains: IndustryDomainEnum[];
}

class SeasonDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  year: string;

  @NestedEnum(SeasonTypeEnum, {})
  type: SeasonTypeEnum;
}

class EventsDto {
  @NestedUUID({})
  id: string;

  @NestedNumber({})
  roundNumber: number;

  @NestedEnum(EventTypeEnum, {})
  type: EventTypeEnum;

  @NestedString({ optional: true })
  metadaata?: string;

  @NestedDate({})
  startDateTime: Date;

  @NestedDate({})
  endDateTime: Date;
}

class ResumeDto {
  @NestedUUID({})
  id: string;

  @NestedString({ optional: true })
  filepath?: string;

  @NestedBoolean({})
  verified: boolean;
}

class ApplicationsDto {
  @NestedUUID({})
  id: string;

  @NestedUUID({})
  eventId: string;

  @NestedObject({ type: ResumeDto })
  resume: ResumeDto;
}

class UserDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  name: string;

  @NestedString({})
  contact: string;

  @NestedEmail({})
  email: string;
}

class TpcMemberDto {
  @NestedUUID({})
  id: string;

  @NestedEnum(TpcMemberRoleEnum, {})
  role: TpcMemberRoleEnum;

  @NestedEnum(DepartmentEnum, {})
  department: DepartmentEnum;

  @NestedObject({ type: UserDto })
  user: UserDto;
}

class JobCoordinatorsDto {
  @NestedUUID({})
  id: string;

  @NestedEnum(JobCoordinatorRoleEnum, {})
  role: JobCoordinatorRoleEnum;

  @NestedObject({ type: TpcMemberDto })
  tpcMember: TpcMemberDto;
}

class JobDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  role: string;

  @NestedString({ optional: true })
  skills?: string;

  @NestedString({})
  location: string;

  @NestedObject({ type: CompanyDto })
  company: CompanyDto;

  @NestedObject({ type: SeasonDto })
  season: SeasonDto;
}

class JobExDto extends JobDto {
  @NestedString({ optional: true })
  others?: string;

  @NestedObject({ type: SelectionProcedureDto })
  selectionProcedure: SelectionProcedureDto;

  @NestedString({ optional: true })
  description?: string;

  @NestedString({ optional: true })
  attachment?: string;

  @NestedDate({ optional: true })
  joiningDate?: Date;

  @NestedDate({ optional: true })
  offerLetterReleaseDate?: Date;

  @NestedNumber({ optional: true })
  duration?: number;

  @NestedString({ optional: true })
  feedback?: string;

  @NestedObject({ type: CompanyExDto })
  company: CompanyExDto;

  @NestedObject({ type: EventsDto, isArray: true })
  events: EventsDto[];

  @NestedObject({ type: ApplicationsDto, isArray: true })
  applications: ApplicationsDto[];

  @NestedObject({ type: JobCoordinatorsDto, isArray: true })
  jobCoordinators: JobCoordinatorsDto[];
}

export class GetStudentSalariesDto {
  @NestedUUID({})
  id: string;

  @NestedNumber({})
  baseSalary: number;

  @NestedNumber({})
  totalCTC: number;

  @NestedNumber({})
  takeHomeSalary: number;

  @NestedNumber({})
  grossSalary: number;

  @NestedNumber({})
  otherCompensations: number;

  @NestedString({ optional: true })
  salaryPeriod?: string;

  @NestedObject({ type: JobDto })
  job: JobDto;
}

export class GetStudentSalaryDto extends GetStudentSalariesDto {
  @NestedString({ optional: true })
  others?: string;

  @NestedObject({ type: JobExDto })
  job: JobExDto;
}
