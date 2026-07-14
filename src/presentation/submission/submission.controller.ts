import { Controller, Post, Get, Body, Param, UseGuards, Req, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SubmitFormUseCase } from '../../core/use-cases/submissions/submit-form.usecase';
import { GetActiveFormsUseCase } from '../../core/use-cases/submissions/get-active-forms.usecase';
import { GetSubmissionsUseCase } from '../../core/use-cases/submissions/get-submissions.usecase';
import { SubmitFormRequestDto } from '../dtos/submission/submit-form.request.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions } from '../decorators/require-permissions.decorator';
import { PERMISSIONS } from '../../shared/constants/permissions.constant';
import { SuccessResponse } from '../../shared/responses/success-response';
import { PaginatedResponse } from '../../shared/responses/paginated-response';

@ApiTags('Submissions')
@ApiBearerAuth()
@Controller()
export class SubmissionController {
  constructor(
    private readonly submitFormUseCase: SubmitFormUseCase,
    private readonly getActiveFormsUseCase: GetActiveFormsUseCase,
    private readonly getSubmissionsUseCase: GetSubmissionsUseCase,
  ) {}

  @Get('forms/active')
  @UseGuards(JwtAuthGuard) // Mọi user đăng nhập (kể cả SW_EMPLOYEE) đều gọi được
  @ApiOperation({ summary: 'Lấy danh sách các form đang mở (active)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lấy danh sách form đang mở thành công' })
  async getActiveForms(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const result = await this.getActiveFormsUseCase.execute(page, limit);
    return PaginatedResponse.create(result.data, result.total, page, limit, 'Lấy danh sách form đang mở thành công');
  }

  @Post('forms/:id/submit')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PERMISSIONS.SUBMIT_FORM)
  @ApiOperation({ summary: 'Nộp (Submit) form' })
  @ApiBody({ type: SubmitFormRequestDto })
  @ApiResponse({ status: 201, description: 'Nộp form thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ (Validation Engine chặn)' })
  @ApiResponse({ status: 404, description: 'Form không tồn tại hoặc chưa kích hoạt' })
  async submitForm(
    @Param('id') formId: string,
    @Body() submitFormDto: SubmitFormRequestDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    
    // Ép mọi value thành chuỗi để lưu xuống DB theo thiết kế chuẩn
    const mappedAnswers = submitFormDto.answers.map(a => ({
      fieldId: a.fieldId,
      value: String(a.value),
    }));

    const command = {
      formId,
      answers: mappedAnswers,
    };

    const submission = await this.submitFormUseCase.execute(userId, command);
    return SuccessResponse.create(submission, 'Nộp form thành công', 201);
  }

  @Get('submissions')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Xem lịch sử nộp bài' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lấy lịch sử nộp bài thành công' })
  async getSubmissions(
    @Req() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const userId = req.user.sub;
    const result = await this.getSubmissionsUseCase.execute(userId, page, limit);
    return PaginatedResponse.create(result.data, result.total, page, limit, 'Lấy lịch sử nộp bài thành công');
  }
}
