/* tslint:disable */
import { Injectable } from '@angular/core';
import { Account } from '../../models/Account';
import { Email } from '../../models/Email';
import { Container } from '../../models/Container';
import { Media } from '../../models/Media';
import { Dna } from '../../models/Dna';
import { Sequencepart } from '../../models/Sequencepart';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    Account: Account,
    Email: Email,
    Container: Container,
    Media: Media,
    Dna: Dna,
    Sequencepart: Sequencepart,
    
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
