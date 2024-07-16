import { PartialType } from '@nestjs/mapped-types';
import { FigureDto } from './figures.dto';

export class UpdateFigureDto extends PartialType(FigureDto) {}
