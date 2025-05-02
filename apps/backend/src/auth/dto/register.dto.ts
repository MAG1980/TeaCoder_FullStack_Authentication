import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from 'class-validator'
import { IsPasswordsMatchingConstraint } from '../../lib/common/validators/is-passwords-matching-constraint.validator'



export class RegisterDto {
  @IsString({ message: 'DisplayName must be a string' })
  @IsNotEmpty({ message: 'DisplayName must not be empty' })
  displayName!: string

  @IsNotEmpty({ message: 'Email must not be empty' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Must be a valid email' })
  email!: string

  @IsNotEmpty({ message: 'Password must not be empty' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string

  @IsNotEmpty({ message: 'Password repeat must not be empty' })
  @IsString({ message: 'Password repeat must be a string' })
  @MinLength(6, { message: 'Password repeat must be at least 6 characters' })
  @Validate(IsPasswordsMatchingConstraint, { message: 'Passwords must match' })
  passwordRepeat!: string
}