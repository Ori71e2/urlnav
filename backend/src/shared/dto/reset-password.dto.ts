export class ResetPasswordDto {
  email?: string;
  password: string;
  token?: string;
  oldPassword?: string;
  newPassword?: string;
}