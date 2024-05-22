import { Pipe, PipeTransform } from "@angular/core";
import * as moment from 'moment';

@Pipe({
    name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {
    transform(value: string | undefined): string {
        return moment(value).format('Y/MM/DD');
    }
}
