import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstUpper'
})
export class FirstUpperPipe implements PipeTransform {

  transform(value: string): string{
    let trimer = value.trim();
    let first = trimer.substr(0, 1).toUpperCase();
    return first + trimer.substr(1); 
  }

}
