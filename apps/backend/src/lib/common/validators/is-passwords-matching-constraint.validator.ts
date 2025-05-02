import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { RegisterDto } from '../../../auth/dto/register.dto'


@ValidatorConstraint({ name: 'IsPasswordsMatching', async: false })
export class IsPasswordsMatchingConstraint implements ValidatorConstraintInterface {
  validate(passwordRepeat: string, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
    if (!validationArguments) {
      return false
    }
    const { object } = validationArguments as { object: RegisterDto }
    return object.password === passwordRepeat
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Passwords must match'
  }
}