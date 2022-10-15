import { SetMetadata } from '@nestjs/common';

export const Role = (role: number) => SetMetadata('role', role);
