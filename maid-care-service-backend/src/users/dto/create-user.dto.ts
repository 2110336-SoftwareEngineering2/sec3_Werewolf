export class CreateUserDto {
  readonly email: string;
  password: string;
  readonly firstname: string;
  readonly lastname: string;
  readonly phone: string;
  readonly role: string;
}