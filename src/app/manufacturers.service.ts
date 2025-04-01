import { Injectable } from '@angular/core';
import { Manufacturer } from './models.model';

@Injectable({
  providedIn: 'root'
})
export class ManufacturersService {

public manufacturers: Manufacturer[] = [

{name: "Intamin Amusement Rides"},
{name: "Rocky Mountain Construction"},
{name: "Bolliger & Mabillard"},
{name: "Giovanola"},
{name: "S&S Sansei"},
{name: "D.H. Morgan Manufacturing"},
{name: "Premier Rides"},
{name: "Arrow Dynamics"},
{name: "In House"},
{name: "Togo"},
{name: "Vekoma"},
{name: "Stand Company"},
{name: "Maurer Rides"},
{name: "The Gravity Group"},
{name: "Gerstlauer Amusement Rides"},
{name: "Schwarzkopf"},
{name: "Martin & Vleminckx"},
{name: "Custom Coasters International"},
{name: "Zamperla"},
{name: "Philadelphia Toboggan Coasters"},
{name: "Dinn Corporation"},
{name: "Zierer"},
{name: "Great Coasters International"},
{name: "Hensel Phelps Construction Co."},
{name: "Mack Rides"},
{name: "Outdoor Amusement Enterprise"},
{name: "Michael Black and Associates"},
{name: "Taft Broadcasting Company"},
{name: "Charlie Mach"},
{name: "International Coasters"},
{name: "Hopkins Rides"},
{name: "National Amusement Devices"},
{name: "Harry C. Baker"},
{name: "Sansei Yusoki Co."},
{name: "Arthur Looff"},
{name: "William Cobb"},
{name: "Rauerhorst Corporation"},
{name: "Chance Rides"},
{name: "Preston & Barbien"},
{name: "Miller & Baker Inc."},
{name: "Skyline Attractions"},
{name: "S&MC"},
{name: "ART Engineering"},
{name: "E&F Miler Industries"},
{name: "John A. Miller"},
{name: "S.D.C."},
{name: "Reverchon"},
{name: "Wiegand"},
{name: "Pinfari"},
{name: "L&T Systems"},
{name: "SBF Visa Group"},
{name: "Frontier Construction Company"},
{name: "Hopkins"},
{name: "TM Harton Company"},
{name: "Nationl Amusement Devices"},
{name: "Harry C. Baker Company"},
{name: "Arthur Leoff"},
{name: "Interpark"},
{name: "Bradley and Kaye"},
{name: "Cavazza Diego"},
{name: "Wisdom Rides"},
{name: "Lucrezia Di Cartoceto"},
{name: "Preston & Barbieri"},
{name: "Dynamic Attractions"},
{name: "W.F. Mangels Company"},
{name: "Ascot Design"},
{name: "Allan Herschell Company"},
{name: "National Amusement Device Company"},
{name: "Ralph Stricker"},
{name: "D.P.V. Rides"},
{name: "Fajume"},
{name: "Molina & Son's"},
{name: "SpectraF/X Inc."},
{name: "Unknown"},
{name: "B. A. Schiff & Associates"},
{name: "Sartori Rides"},
{name: "Williams Amusement Device Company"},
{name: "Beijing Shibaolai Amusement Equipment"},
{name: "Childress Coaster"},
{name: "Golden Horse"},
{name: "Schiff"},
{name: "Aquatic Development Group"},
{name: "Brandauer"},
{name: "Gosetto"},
{name: "Extreme Engineering"},
{name: "King"}
]
  constructor() { }

getManufacturer(manName: string) {
  	return {
  		...this.manufacturers.find(man => {
  			return man.name === manName;
  		})
 	 };
  }
}
