import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/Router';
@Component({
    selector: 'cbu-detect',
    templateUrl: './cbudetect.component.html',
})

export class CbudetectComp implements OnInit {
    dna_seq_area: string;
    codontbl: Codon_Table;
    ngOnInit() {
        this.codontbl = new Codon_Table();
    }



    submit_dna_form() {
        console.log("Submitting data to server...");
    }
}

class Codon_Table implements OnInit{
    ngOnInit() {
        Codon_Table.total_amino_num = 21;
    }
    acid_name_Arr = ["Ala", "Cys", "Asp", "Glu", "Phe", "Gly", "His", "Ile",
        "Lys", "Leu", "Met", "Asn", "Pro", "Gln", "Arg", "Ser", "Thr", "Val", "Trp", "Tyr", "End"]; //count= 21

    static total_amino_num:number; //setting amino _num
    amino_Acids: Amino_acid[]; //acid objects
    //class CodonTable
    constructor() //constructor
    {
        console.log("Creating Codon_Table");

        for (var count = 0; count < Codon_Table.total_amino_num; count++) {
            this.amino_Acids[count] = new Amino_acid(this.acid_name_Arr[count]);
        }


    }
}

class Amino_acid {
    name: string;
    num: number;
    Codons_list:string[];   //dynamic instead of using fixed-size array
    //class CodonTable
    constructor(acid_name:string){
        this.name = acid_name;
        this.num = 0;
    }
}
class Sequences
    {
        private raw_data:string; //data from the textbox or database
        private sequences_Arr:string[]; //the sequences--maybe several bases

        // constructor() //default constructor
        // {
        //     this.raw_data = "";
        // }
        constructor(raw:string) //constructor
        {
            this.raw_data = raw;
        }

        private split_sequence_raw_into_seq_Arr()
        {

            return true; //if split is SUCCESS
        }
    }