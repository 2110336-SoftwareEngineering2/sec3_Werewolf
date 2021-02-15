export class ProfileDto {
  constructor(object: any) {
    this.firstname = object.firstname;
    this.lastname = object.lastname;
    this.phone = object.phone;
  };
  readonly firstname: string;
  readonly lastname: string;
  readonly phone: string;
}