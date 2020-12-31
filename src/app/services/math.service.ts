import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathService {

  constructor() {}

  mean(values: number[]): number {
    return values.reduce( (prev:number, current:number) => prev + current, 0) / values.length;
  }

  var(mean: number, values: number[]): number {
    // let sum = 0;
    // for (const value of values) {
    //   sum += Math.pow(value - mean, 2);
    // }
    // return sum/(values.length-1);

    return values.reduce( (prev:number, current:number) => {return prev + Math.pow(current - mean, 2) }, 0) / (values.length-1);
  }

  standardNormalTable(mean: number, variance: number, value: number): number {
    return (value - mean)/Math.sqrt(variance);
  }

}
