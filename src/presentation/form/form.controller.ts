import { Controller, Post, Body, UseGuards, Req, Get, Query, ParseIntPipe, DefaultValuePipe, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiBody } from '@nestjs/swagger';
import { CreateFormUseCase } from '../../core/use-cases/forms/create-form.usecase';
import { GetFormsUseCase } from '../../core/use-cases/forms/get-forms.usecase';
import { GetFormByIdUseCase } from '../../core/use-cases/forms/get-form-by-id.usecase';
import { UpdateFormUseCase } from '../../core/use-cases/forms/update-form.usecase';
import { DeleteFormUseCase } from '../../core/use-cases/forms/delete-form.usecase';
import { FormStatus } from '../../shared/enums/form-status.enum';
import { CreateFormRequestDto } from '../dtos/form/create-form.request.dto';
import { UpdateFormRequestDto } from '../dtos/form/update-form.request.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions } from '../decorators/require-permissions.decorator';
import { PERMISSIONS } from '../../shared/constants/permissions.constant';
import { SuccessResponse } from '../../shared/responses/success-response';
import { PaginatedResponse } from '../../shared/responses/paginated-response';

@ApiTags('Forms')
@ApiBearerAuth()
@Controller('forms')
export class FormController {
  constructor(
    private readonly createFormUseCase: CreateFormUseCase,
    private readonly getFormsUseCase: GetFormsUseCase,
    private readonly getFormByIdUseCase: GetFormByIdUseCase,
    private readonly updateFormUseCase: UpdateFormUseCase,
    private readonly deleteFormUseCase: DeleteFormUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PERMISSIONS.CREATE_FORM)
  @ApiOperation({ summary: 'Tạo form mới' })
  @ApiBody({ type: CreateFormRequestDto })
  @ApiResponse({ status: 201, description: 'Tạo form thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  async create(
    @Body() createFormDto: CreateFormRequestDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    const command = {
      title: createFormDto.title,
      description: createFormDto.description,
      order: createFormDto.order,
    };
    const form = await this.createFormUseCase.execute(command, userId);
    return SuccessResponse.create(form);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy danh sách forms' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: FormStatus })
  @ApiResponse({ status: 200, description: 'Lấy danh sách form thành công' })
  async getForms(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('status') status?: FormStatus,
  ) {
    const result = await this.getFormsUseCase.execute({ page, limit, status });
    return PaginatedResponse.create(result.data, result.total, page, limit, 'Lấy danh sách form thành công');
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy chi tiết form theo ID' })
  @ApiResponse({ status: 200, description: 'Lấy chi tiết form thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy form' })
  async getFormById(@Param('id') id: string) {
    const form = await this.getFormByIdUseCase.execute(id);
    return SuccessResponse.create(form, 'Lấy chi tiết form thành công');
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PERMISSIONS.UPDATE_FORM)
  @ApiOperation({ summary: 'Cập nhật form' })
  @ApiBody({ type: UpdateFormRequestDto })
  @ApiResponse({ status: 200, description: 'Cập nhật form thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy form' })
  async updateForm(
    @Param('id') id: string,
    @Body() updateFormDto: UpdateFormRequestDto,
  ) {
    const command = {
      title: updateFormDto.title,
      description: updateFormDto.description,
      order: updateFormDto.order,
      status: updateFormDto.status,
    };
    const form = await this.updateFormUseCase.execute(id, command);
    return SuccessResponse.create(form, 'Cập nhật form thành công');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PERMISSIONS.DELETE_FORM)
  @ApiOperation({ summary: 'Xóa form' })
  @ApiResponse({ status: 200, description: 'Xóa form thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy form' })
  async deleteForm(@Param('id') id: string) {
    await this.deleteFormUseCase.execute(id);
    return SuccessResponse.create(null, 'Xóa form thành công');
  }
}
