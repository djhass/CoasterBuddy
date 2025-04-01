export class Coaster {
	height?:number;
	id:number = -1;
	inversionsNumber?:number;
	length?:number;
	mainImage?:SubPathObject;
	manufacturer?:SubNameObject;
	materialType?:SubNameObject;
	name:string = "";
	park?:SubNameObject;
	rank?:number;
	score?:string;
	seatingType?:SubNameObject;
	speed?:number;
	status?:SubNameObject;
	totalRatings?:number;
	validDuels?:number;
	selected?:boolean;

	public constructor(object?: Object) {
		for (var property in object) {
			(this as {[key: string]: any})[property] = (object as {[key: string]: any})[property]
		}
	}
};

export class Credit {
	height?:number;
	id:number = -1;
	inversionsNumber?:number;
	length?:number;
	mainImage?:SubPathObject;
	manufacturer:SubNameObject = {name: ""};
	materialType:SubNameObject = {name: ""};
	name:string = "";
	park:SubNameObject = {name: ""};
	rank?:number;
	score?:string;
	seatingType:SubNameObject = {name: ""};
	speed?:number;
	status?:SubNameObject;
	totalRatings?:number;
	validDuels?:number;
	time?:string;
	tally?:number;

	public constructor(object?: Object) {
		for (var property in object) {
			(this as {[key: string]: any})[property] = (object as {[key: string]: any})[property]
			if (property == 'status' && (object as {[key: string]: any})[property].name == 'status.operating') {
				this.time = new Date().toDateString()
				this.tally = 1;
			}
		}
	}
}

export interface SubNameObject {
	name: String;
}

export interface SubPathObject {
	path: String;
}

export class Park {	
	id: number = -1;
	name: string = "";
	country?: SubNameObject;
	latitude?: number;
	longitude?: number;
	logo?: string;
	map?: string;
	website?: string;

	public constructor(object?: Object) {
		for (var property in object) {
			(this as {[key: string]: any})[property] = (object as {[key: string]: any})[property]
		}
	}
}
export interface Manufacturer {
	name: string;
}
export interface ridden {
	name: string;
}
export interface settings {
	units: String;
	appearance: String;
}

export class Range {
	public lower: number;
	public upper: number;
  
	public constructor(lower: number, upper: number) {
	  this.lower = lower;
	  this.upper = upper;
	}
}
export class StrRange {
	public lower: string;
	public upper: string;
  
	public constructor(lower: string, upper: string) {
	  this.lower = lower;
	  this.upper = upper;
	}
}
  
export class MaterialsOptions {
	wood: boolean = true;
	steel: boolean = true;
	hybrid: boolean = true;
  }
  
export class StatusesOptions {
	defunct: boolean = true;
	standing: boolean = true;
	operating: boolean = true;
  }

export class Filter {
	appliedFilters: boolean = false;
	speedRange?: Range;
	heightRange?: Range;
	lengthRange?: Range;
	popularityRange?: Range;
	inversionRange?: Range;
	tallyRange?: Range;
	dateRange?: StrRange;
	keepEmptyTallys?: boolean;
	keepEmptyDates?: boolean;
	materialsOptions?: MaterialsOptions;
	statusesOptions?: StatusesOptions;
	parks?: Array<String>;
	manufacturers?: Array<String>;
	models?: Array<String>;
  }