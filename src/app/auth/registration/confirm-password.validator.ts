import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
export class ConfirmPasswordValidator {
  static MatchPassword: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('cPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}
