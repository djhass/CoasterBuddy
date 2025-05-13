export interface UnitObj {
  imperial?: number;
  metric?: number;
}

interface External {
  name: string;
  id: number;
}

interface Record {
  type: string; //ex: fastest
  specifier: string; //ex: ride, non-inverting-loop, wooden coaster, 
  span: string; //ex: world, america, europe
  took_from?: External //who had the record previously
  got_taken?: External //who took the record from this ride
}

interface RideStatus {
  standing: boolean;
  operable: boolean;
  open?: boolean;
  testing?: boolean;
  calculated_wait?: number;
  posted_wait?: number;
  operation_speed?: number;
  trains_on_track?: number;
  average_wait?: number;
}

interface RideVersion {
  version_description?: string;
  name?: string;
  alternateNames?: Array<string>;
  previous_version?: RideVersion;
  short_name?: string;
  first_date?: string;
  last_date?: string;
  duration?: number;
  max_speed?: UnitObj;
  max_height?: UnitObj;
  capacity?: number;
  records?: Array<Record>;
  drop_height?: UnitObj;
  length?: UnitObj;
  inversions?: number;
  trains?: number;
  cars?: number;
  tags?: Array<string>;
  seats_per_car?: number;
  propulsion?: string;
  material?: string;
  image?: string;
}

export class Coaster {
	name: string;
  alternateNames?: Array<string>;
  short_name?: string;
  image?: string;
  opened?: string;
  closed?: string;
  previous_version?: RideVersion;
  future_version?: RideVersion;
  prefersMetric?: boolean;
  dueling?: Array<RideVersion>;
  clones?: Array<RideVersion>;
  minRiderHeight?: UnitObj;
  maxRiderHeight?: UnitObj;
  minOccupiedRiderHeight?: UnitObj;
  description?: string;
  park?: Park;
  make?: Make;
  models?: Array<string>;
  status?: RideStatus;
  duration?: number; //
  length?: UnitObj;
  max_speed?: UnitObj;
  max_acceleration?: UnitObj; //
  max_height?: UnitObj;
  drop_height?: UnitObj;
  website?: string;
  popularity?: number;
  latitude?: number;
  longitude?: number;
  capacity?: number; //
  tags?: Array<string>;
  records?: Array<Record>;
  photo?: string;
  inversions?: number;
  trains?: number;
  cars?: number;
  seats_per_car?: number;
  propulsion?: string;
  material?: string;
  pov?: string;
  bucket_list?: boolean;
  max_force?: number;
  id: string

	public constructor(object?: Object) {
		for (var property in object) {
			(this as {[key: string]: any})[property] = (object as {[key: string]: any})[property]
		}
	}
}

export class Credit extends Coaster{
	time?: string;
	tally?: number;
}

export interface SubPathObject {
	path: String;
}


export class Parent {
	id: number = -1;
	name: string = "";
	short_name?: string = "";
	logo?: string;
	website?: string;
	additionalText?: string;
}

export class Park {	
	id?: string;
	name: string = "";
	short_name?: string;
	country?: External;
	parent?: Parent;
	latitude?: number;
	longitude?: number;
	logo?: string;
	map?: string;
	website?: string;
	additionalText?: string;
	ancestors?: Park[];
	descendants?: Park[];

	public constructor(object?: Object) {
		for (var property in object) {
			(this as {[key: string]: any})[property] = (object as {[key: string]: any})[property]
		}
	}
}

/*

    name: "string",
    website: "string",
    logo: "string",
    short_name: "string",
    additionalText: "string",
    coasters: "object",
    country: "string",
    rides: "object",
    ancestors: "object",
    descendants: "object",
    id: "string"


*/
export class Make {
	name: string;
	short_name?: string;
	logo?: string;
	website?: string;
	additionalText?: string;
	country?: string;
  rides?: Array<Coaster>;
  ancestors?: Array<Make>;
  descendants?: Array<Make>;
	id?: string;

  public constructor(object?: Object) {
		for (var property in object) {
			(this as {[key: string]: any})[property] = (object as {[key: string]: any})[property]
		}
	}
}
export interface ridden {
	name: string;
}
export class settings {
	metric: boolean;
  defaultUnits: boolean;
	appearance: string;
  mapsService: string;

  public constructor() {
    this.metric = false;
    this.defaultUnits = true;
    this.appearance = "system";
    this.mapsService = "google";
  }
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
  
class StatusesOptions {
	defunct: boolean = true;
	standing: boolean = true;
	operable: boolean = true;
  }

export class Filter {
	appliedFilters: boolean = false;
	speedRange?: Range;
	heightRange?: Range;
	lengthRange?: Range;
	popularityRange?: Range;
	inversionRange?: Range;
	tallyRange?: Range;
  durationRange?: Range;
  accelerationRange?: Range;
  capacityRange?: Range;
	dateRange?: StrRange;
	keepEmptyTallys?: boolean;
	keepEmptyDates?: boolean;
	statusesOptions?: StatusesOptions;
  tags?: Array<string>;
	parks?: Array<string>;
	makes?: Array<string>;
	materialsOptions: {
    wood: boolean,
    steel: boolean,
    hybrid: boolean
  };
	models?: Array<String>;
  }