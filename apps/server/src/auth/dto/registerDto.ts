import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { RegisterPayload } from '@quiz-app/shared-types';

export class RegisterDto implements RegisterPayload {
  @IsEmail({}, { message: 'Niepoprawny format adresu email' })
  @IsNotEmpty({ message: 'Adres email jest wymagany' })
  email: string;

  @IsString({ message: 'Nazwa uzytkownika musi byc tekstem' })
  @IsNotEmpty({ message: 'Nazwa uzytkownika jest wymagana' })
  @MinLength(3, { message: 'Nazwa uzytkownika musi miec co najmniej 3 znaki' })
  username: string;

  @IsString({ message: 'Haslo musi byc tekstem' })
  @IsNotEmpty({ message: 'Haslo jest wymagane' })
  @MinLength(8, { message: 'Haslo musi miec co najmniej 8 znakow' })
  password: string;
}