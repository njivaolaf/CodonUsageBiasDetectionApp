/* tslint:disable */
import {
  Dnacategory
} from '../index';

declare var Object: any;
export interface DnaInterface {
  "name"?: string;
  "sequence": string;
  "id"?: number;
  "dnacategoryId"?: number;
  dnacategory?: Dnacategory;
}

export class Dna implements DnaInterface {
  "name": string;
  "sequence": string;
  "id": number;
  "dnacategoryId": number;
  dnacategory: Dnacategory;
  constructor(data?: DnaInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Dna`.
   */
  public static getModelName() {
    return "Dna";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Dna for dynamic purposes.
  **/
  public static factory(data: DnaInterface): Dna{
    return new Dna(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'Dna',
      plural: 'Dnas',
      path: 'Dnas',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "sequence": {
          name: 'sequence',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "dnacategoryId": {
          name: 'dnacategoryId',
          type: 'number'
        },
      },
      relations: {
        dnacategory: {
          name: 'dnacategory',
          type: 'Dnacategory',
          model: 'Dnacategory'
        },
      }
    }
  }
}
