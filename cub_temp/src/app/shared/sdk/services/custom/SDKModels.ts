/* tslint:disable */
import { Injectable } from '@angular/core';
import { Dna } from '../../models/Dna';
import { Dnacategory } from '../../models/Dnacategory';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    Dna: Dna,
    Dnacategory: Dnacategory,
    
  };

  public get(modelName: string): any {
    return this.models[modelName];
  }

  public getAll(): Models {
    return this.models;
  }

  public getModelNames(): string[] {
    return Object.keys(this.models);
  }
}
