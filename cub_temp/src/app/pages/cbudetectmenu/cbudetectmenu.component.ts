import { Component, OnInit } from '@angular/core';
 import { DnaApi } from '../../shared/sdk/index';
import { Dna } from '../../shared/sdk/models/index';


// import { JSONSearchParams } from '../../shared/sdk/services/core/search.params';
import { InternalStorage } from '../../shared/sdk/storage/storage.swaps';
// import { SDKModels } from '../../shared/sdk/services/custom/SDKModels';
// import { LoopBackAuth } from '../../shared/sdk/services/core/auth.service';
// import { Dna } from '../../shared/sdk/models/index';
 import { LoopBackConfig } from '../../shared/sdk';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'cbudetectmenu',
  styleUrls: ['./cbudetectmenu.scss'],
  templateUrl: './cbudetectmenu.html',
  providers: [DnaApi],
})
export class CbuDetectComp implements OnInit {
  ngOnInit(): void {
    //this.dna = new Dna();
  }
  constructor(
    protected dnaApi: DnaApi,
  //  protected dna: Dna,
  ) {

        LoopBackConfig.setBaseURL(environment.apiUrl);
        LoopBackConfig.setApiVersion(environment.apiVersion);
        this.testdna_set('nametest', 'seqtest');
      
      
  }
  private testdna_set(name: string, seq: string ): void {
    // this.dna.name = name;
    // this.dna.sequence = seq;
    // this.dnaApi.create(this.dna).subscribe(
    //   (_dna: Dna) => {
    //     console.log('dna has been successfully created!');
    //   }, 
    // );this.dnaApi.create(this.dna).subscribe(
    //   (_dna: Dna) => {
    //     console.log('dna has been successfully created!');
    //   }, 
    // );
  }
}
