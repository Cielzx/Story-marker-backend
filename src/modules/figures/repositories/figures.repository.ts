import { FigureEntity } from '../entities/figures.entities';
import { FigureDto } from '../dto/figures.dto';
import { UpdateFigureDto } from '../dto/update-figure.dto';

export abstract class FigureRepository {
  abstract create(data: FigureDto): Promise<FigureEntity>;

  abstract findAll(): Promise<FigureEntity[]>;

  abstract findOne(id: string): Promise<FigureEntity>;

  abstract update(data: UpdateFigureDto, id: string): Promise<FigureEntity>;

  abstract delete(id: string): Promise<void>;
}
