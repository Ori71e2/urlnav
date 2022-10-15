import {
  PipeTransform,
  // Pipe,
  ArgumentMetadata,
} from '@nestjs/common';
import { CResponse } from '../dto/response.dto';
import { RES } from '../constrant';

// @Pipe()
export class CParseIntPipe implements PipeTransform<string> {
  async transform(value: string, metadata: ArgumentMetadata) {
    if (value !== undefined) {
      const val = parseInt(value, 10);
      if (isNaN(val)) {
        throw new CResponse(RES.CERROR_PARAM_TYPE);
      }
      return val;
    }
  }
}
