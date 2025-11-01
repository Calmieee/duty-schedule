import { Clock } from 'lucide-react';
import { DaySchedule, Employee, Pair } from '@/types';

interface ScheduleTableProps {
	scheduleData: DaySchedule[];
	employees: Employee[];
	pairs: Pair[];
	currentMonth: Date;
	isEditMode: boolean;
	onAssignEmployee: (days: number[], shift: string, role: string, name: string) => void;
	onAssignPair: (days: number[], shift: string, pairId: string) => void;
}

export default function ScheduleTable({
	                                      scheduleData,
	                                      employees,
	                                      currentMonth
                                      }: ScheduleTableProps) {
	const shifts = ['День', 'Ночь'];
	const roles = ['Дежурный', 'Млад. Дежурный'];

	const getEmployeeColor = (name: string) => {
		const employee = employees.find(e => e.name === name);
		return employee?.color || '#6b7280';
	};

	return (
		<div className="overflow-x-auto">
			<div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-4">
				<table className="w-full">
					<thead>
					<tr className="border-b border-slate-600">
						<th className="p-3 text-left sticky left-0 bg-slate-800">Дата</th>
						<th className="p-3 text-left">Смена</th>
						<th className="p-3 text-left">Роль</th>
						<th className="p-3 text-left">Сотрудник</th>
					</tr>
					</thead>
					<tbody>
					{scheduleData.map((day, dayIndex) => (
						<>
							{shifts.map((shift, shiftIndex) => (
								roles.map((role, roleIndex) => (
									<tr
										key={`${dayIndex}-${shiftIndex}-${roleIndex}`}
										className={`border-b border-slate-700 hover:bg-slate-700/50 transition-colors ${
											day.isWeekend ? 'bg-slate-800/70' : ''
										}`}
									>
										{shiftIndex === 0 && roleIndex === 0 && (
											<td
												rowSpan={4}
												className="p-3 font-semibold sticky left-0 bg-slate-800 border-r border-slate-600"
											>
												<div className={day.isWeekend ? 'text-red-400' : ''}>
													{day.date}.{String(currentMonth.getMonth() + 1).padStart(2, '0')}
													<div className="text-xs text-slate-400">{day.dayOfWeek}</div>
												</div>
											</td>
										)}
										{roleIndex === 0 && (
											<td rowSpan={2} className="p-3">
												<Clock className="w-5 h-5 inline mr-2 text-blue-400" />
												{shift}
											</td>
										)}
										<td className="p-3 text-slate-300">{role}</td>
										<td className="p-3">
											{day.shifts[shift][role] && (
												<div
													className="px-3 py-1 rounded-lg inline-block font-medium"
													style={{ backgroundColor: getEmployeeColor(day.shifts[shift][role]) }}
												>
													{day.shifts[shift][role]}
												</div>
											)}
										</td>
									</tr>
								))
							))}
						</>
					))}
					</tbody>
				</table>
			</div>
		</div>
	);
}