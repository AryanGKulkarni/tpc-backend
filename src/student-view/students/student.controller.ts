import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { StudentService } from "./student.service";
import { CreateFile, DeleteFiles, GetFile, GetValue } from "src/decorators/controller";
import { GetStudentResumesDto, StudentViewDto } from "./dtos/get.dto";
import { User } from "src/decorators/User";
import { IUser } from "src/auth/User";
import { pipeTransform, pipeTransformArray } from "src/utils/utils";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { RESUME_FOLDER } from "src/constants";
import { FileService } from "src/services/FileService";
import path from "path";
import { DeleteFilesDto } from "src/utils/utils.dto";
import { Response } from "express";
import { CreateStudentResumeDto } from "./dtos/post.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("student-view")
@UseGuards(AuthGuard("jwt"))
@ApiTags("Student-View/Student")
@ApiBearerAuth("jwt")
export class StudentController {
  folderName = RESUME_FOLDER;

  constructor(
    private studentService: StudentService,
    private fileService: FileService
  ) {}

  @Get()
  @ApiResponse({ type: StudentViewDto })
  async getStudent(@User() user: IUser) {
    const ans = await this.studentService.getStudent(user.studentId);

    return pipeTransform(ans, StudentViewDto);
  }

  @Get("resume")
  @ApiResponse({ type: GetStudentResumesDto, isArray: true })
  async getStudentResumes(@User() user: IUser) {
    const ans = await this.studentService.getResumes({ studentId: user.studentId });

    return pipeTransformArray(ans, GetStudentResumesDto);
  }

  @CreateFile(CreateStudentResumeDto, "resume")
  @UseInterceptors(TransactionInterceptor)
  async createResume(@UploadedFile() file, @User() user: IUser, @TransactionParam() t: Transaction) {
    const filepath = uuidv4() + ".pdf";
    const ans = await this.studentService.addResume(user.studentId, filepath, t);
    await this.fileService.uploadFile(path.join(this.folderName, filepath), file);

    return ans;
  }

  @DeleteFiles()
  @UseInterceptors(TransactionInterceptor)
  async deleteResumes(@Query() query: DeleteFilesDto, @User() user: IUser, @TransactionParam() t: Transaction) {
    const ans = await this.studentService.deleteResumes(user.studentId, query.filename, t);
    const filenames = typeof query.filename === "string" ? [query.filename] : query.filename;
    const pr = filenames.map((filename) => this.fileService.deleteFile(path.join(this.folderName, filename)));
    await Promise.all(pr);

    return ans;
  }

  @GetFile(["application/pdf"], "resume")
  async getResume(@Param("filename") filename: string, @User() user: IUser, @Res({ passthrough: true }) res: Response) {
    const ans = await this.studentService.getResumes({ studentId: user.studentId, filepath: filename });
    if (ans.length === 0) throw new NotFoundException(`Resume with filename ${filename} not found`);
    const file = this.fileService.getFile(path.join(this.folderName, filename));
    res.setHeader("Content-Type", "application/pdf");

    return new StreamableFile(file);
  }

  @Patch("/registrations/:seasonId")
  @ApiParam({ name: "seasonId", type: "string" })
  @ApiResponse({ type: String, isArray: true })
  async registerSeason(@Param("seasonId", new ParseUUIDPipe()) seasonId: string, @User() user: IUser) {
    const ans = await this.studentService.registerSeason(user.studentId, seasonId);

    return ans;
  }
}
