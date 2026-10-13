import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { LoginPayload } from '@quiz-app/shared-types';

export class LoginDto implements LoginPayload {
  @IsEmail({}, { message: 'Niepoprawny format adresu email' })
  @IsNotEmpty({ message: 'Adres email jest wymagany' })
  email: string;

  @IsString({ message: 'Haslo musi byc tekstem' })
  @IsNotEmpty({ message: 'Haslo jest wymagane' })
  password: string;
}