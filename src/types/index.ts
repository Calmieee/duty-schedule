export interface Employee {
	id: string;
	name: string;
	color: string;
}

export interface Pair {
	id: string;
	senior: string;
	junior: string;
	color: string;
}

export interface DaySchedule {
	date: number;
	dayOfWeek: string;
	isWeekend: boolean;
	shifts: {
		[shift: string]: {
			[role: string]: string;
		};
	};
}