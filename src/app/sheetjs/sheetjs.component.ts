import { Component, OnInit } from '@angular/core';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-save';

type AOA = Array<Array<any>>;

function s2ab(s: string): ArrayBuffer {
  const buf: ArrayBuffer = new ArrayBuffer(s.length);
  const view: Uint8Array = new Uint8Array(buf);
  for (let i = 0; i !== s.length; ++i){
    view[i] = s.charCodeAt(i) & 0xFF;
  }
  return buf;
}

@Component({
  selector: 'app-sheetjs',
  templateUrl: './sheetjs.component.html',
  styleUrls: ['./sheetjs.component.css']
})
export class SheetjsComponent implements OnInit {

  data: AOA = [ [], [] ];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'binary' };
	fileName: string = 'SheetJS.xlsx';
	totalSheets: number = 0;
	totalSheetsArray: number[] = [];
	sheetNumber: number = 0;
	targetFile : Blob;	

	onFileChange(evt: any) {
		/* wire up file reader */
		const target: DataTransfer = <DataTransfer>(evt.target);
		if (target.files.length !== 1) throw new Error('Cannot use multiple files');
		const reader: FileReader = new FileReader();
		reader.onload = (e: any) => {
			/* read workbook */
			const bstr: string = e.target.result;
			const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

			this.totalSheets = wb.SheetNames.length;
			for(let i=1; i<=this.totalSheets;i++){
				this.totalSheetsArray.push(i);
			}			
		};
		this.targetFile = target.files[0];
		reader.readAsBinaryString(this.targetFile);
	}

	changeSheet(sheetNumber){
		this.getSheetData(sheetNumber);
		this.sheetNumber = sheetNumber;
	}

	getSheetData(sheetNumber){
		const reader: FileReader = new FileReader();
		reader.onload = (e: any) => {
			/* read workbook */
			const bstr: string = e.target.result;
			const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
			
			/* grab first sheet */
			const wsname: string = wb.SheetNames[sheetNumber];
			const ws: XLSX.WorkSheet = wb.Sheets[wsname];
			/* save data */
			this.data = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));
		};
		reader.readAsBinaryString(this.targetFile);
	}

  constructor() { }

  ngOnInit() {
  }

}
