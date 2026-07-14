import { Controller, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AddFieldUseCase } from '../../core/use-cases/fields/add-field.usecase';
import { UpdateFieldUseCase } from '../../core/use-cases/fields/update-field.usecase';
import { DeleteFieldUseCase } from '../../core/use-cases/fields/delete-field.usecase';
import { AddFieldRequestDto } from '../dtos/field/add-field.request.dto';
import { UpdateFieldRequestDto } from '../dtos/field/update-field.request.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions } from '../decorators/require-permissions.decorator';
import { PERMISSIONS } from '../../shared/constants/permissions.constant';
import { SuccessResponse } from '../../shared/responses/success-response';

@ApiTags('Fields')
@ApiBearerAuth()
@Controller('forms/:formId/fields')
export class FieldController {
  constructor(
    private readonly addFieldUseCase: AddFieldUseCase,
    private readonly updateFieldUseCase: UpdateFieldUseCase,
    private readonly deleteFieldUseCase: DeleteFieldUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PERMISSIONS.CREATE_FIELD)
  @ApiOperation({ summary: 'Thêm field mới vào form' })
  @ApiBody({ type: AddFieldRequestDto })
  @ApiResponse({ status: 201, description: 'Thêm field thành công' })
  @ApiResponse({ status: 404, description: 'Form không tồn tại' })
  @ApiResponse({ status: 400, description: 'Lỗi cấu hình field' })
  async addField(
    @Param('formId') formId: string,
    @Body() addFieldDto: AddFieldRequestDto,
  ) {
    const command = {
      formId,
      label: addFieldDto.label,
      type: addFieldDto.type,
      order: addFieldDto.order,
      isRequired: addFieldDto.isRequired,
      options: addFieldDto.options,
    };
    const field = await this.addFieldUseCase.execute(command);
    return SuccessResponse.create(field, 'Thêm field thành công', 201);
  }

  @Put(':fieldId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PERMISSIONS.UPDATE_FIELD)
  @ApiOperation({ summary: 'Cập nhật field' })
  @ApiBody({ type: UpdateFieldRequestDto })
  @ApiResponse({ status: 200, description: 'Cập nhật field thành công' })
  @ApiResponse({ status: 404, description: 'Field hoặc Form không tồn tại' })
  @ApiResponse({ status: 400, description: 'Lỗi cấu hình field' })
  async updateField(
    @Param('formId') formId: string,
    @Param('fieldId') fieldId: string,
    @Body() updateFieldDto: UpdateFieldRequestDto,
  ) {
    const command = {
      label: updateFieldDto.label,
      type: updateFieldDto.type,
      order: updateFieldDto.order,
      isRequired: updateFieldDto.isRequired,
      options: updateFieldDto.options,
    };
    const field = await this.updateFieldUseCase.execute(formId, fieldId, command);
    return SuccessResponse.create(field, 'Cập nhật field thành công');
  }

  @Delete(':fieldId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PERMISSIONS.DELETE_FIELD)
  @ApiOperation({ summary: 'Xóa field' })
  @ApiResponse({ status: 200, description: 'Xóa field thành công' })
  @ApiResponse({ status: 404, description: 'Field hoặc Form không tồn tại' })
  async deleteField(
    @Param('formId') formId: string,
    @Param('fieldId') fieldId: string,
  ) {
    await this.deleteFieldUseCase.execute(formId, fieldId);
    return SuccessResponse.create(null, 'Xóa field thành công');
  }
}
