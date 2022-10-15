export class CreateUserDto {
  readonly name?: string;
  readonly email: string;
  password: string;
  token?: string;
}