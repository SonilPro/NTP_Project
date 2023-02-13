import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'timeSince'})
export class TimeSincePipe implements PipeTransform {
  transform(value: string): string {
    const currDate = new Date();
    const date = new Date(value);
    let result = Math.floor((currDate.getTime() - date.getTime()) / (1000*60))
    return (result === 0) ? 'Just now' : result + 'minutes ago';
  }
}
