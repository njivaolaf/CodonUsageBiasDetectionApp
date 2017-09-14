/* tslint:disable */
import {
  Sequencepart
} from '../index';

declare var Object: any;
export interface DnaInterface {
  "sequencename": string;
  "apisource"?: string;
  "id"?: number;
  sequenceparts?: Sequencepart[];
}

export class Dna implements DnaInterface {
  "sequencename": string;
  "apisource": string;
  "id": number;
  sequenceparts: Sequencepart[];
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
        "sequencename": {
          name: 'sequencename',
          type: 'string'
        },
        "apisource": {
          name: 'apisource',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
        sequenceparts: {
          name: 'sequenceparts',
          type: 'Sequencepart[]',
          model: 'Sequencepart'
        },
      }
    }
  }
}
