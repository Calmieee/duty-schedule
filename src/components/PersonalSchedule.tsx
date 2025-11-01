import { DaySchedule, Employee } from '@/types';

interface PersonalScheduleProps {
	scheduleData: DaySchedule[];
	selectedEmployee: string | null;
	currentMonth: Date;
	employees: Employee[];
}

export default function PersonalSchedule({
	                                         scheduleData,
	                                         selectedEmployee,
	                                         currentMonth,
	                                         employees
                                         }: PersonalScheduleProps) {
	const getEmployeeColor = (name: string) => {
		const employee = employees.find(e => e.name === name);
		return employee?.color || '#6b7280';
	};

	const getEmployeeShifts = () => {
		if (!selectedEmployee) return [];

		const shifts: any[] = [];
		scheduleData.forEach(day => {
			['День', 'Ночь'].forEach(shift => {
				['Дежурный', 'Млад. Дежурный'].forEach(role => {
					if (day.shifts[shift][role] === selectedEmployee) {
						shifts.push({
							date: day.date,
							dayOfWeek: day.dayOfWeek,
							isWeekend: day.isWeekend,
							shift,
							role
						});
					}
				});
			});
		});
		return shifts;
	};

	const getEmployeeStats = () => {
		const shifts = getEmployeeShifts();
		const dayShifts = shifts.filter(s => s.shift === 'День').length;
		const nightShifts = shifts.filter(s => s.shift === 'Ночь').length;
		const weekendShifts = shifts.filter(s => s.isWeekend).length;

		return {
			total: shifts.length,
			dayShifts,
			nightShifts,
			weekendShifts
		};
	};

	if (!selectedEmployee) {
		return (
			<div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
				<div className="text-center text-slate-400 py-8">
					Выберите сотрудника из списка выше
				</div>
			</div>
		);
	}

	const stats = getEmployeeStats();
	const shifts = getEmployeeShifts();

	return (
		<div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
			<h3 className="text-2xl font-semibold mb-4" style={{ color: getEmployeeColor(selectedEmployee) }}>
				Расписание: {selectedEmployee}
			</h3>

			{/* Статистика */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
				<div className="bg-slate-700/50 rounded-lg p-4 text-center">
					<div className="text-3xl font-bold text-blue-400">{stats.total}</div>
					<div className="text-sm text-slate-400">Всего смен</div>
				</div>
				<div className="bg-slate-700/50 rounded-lg p-4 text-center">
					<div className="text-3xl font-bold text-yellow-400">{stats.dayShifts}</div>
					<div className="text-sm text-slate-400">Дневных</div>
				</div>
				<div className="bg-slate-700/50 rounded-lg p-4 text-center">
					<div className="text-3xl font-bold text-indigo-400">{stats.nightShifts}</div>
					<div className="text-sm text-slate-400">Ночных</div>
				</div>
				<div className="bg-slate-700/50 rounded-lg p-4 text-center">
					<div className="text-3xl font-bold text-red-400">{stats.weekendShifts}</div>
					<div className="text-sm text-slate-400">В выходные</div>
				</div>
			</div>

			{/* Календарь смен */}
			<div className="grid grid-cols-7 gap-2 mb-6">
				{['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
					<div key={day} className="text-center font-semibold text-slate-400 p-2">
						{day}
					</div>
				))}

				{(() => {
					const year = currentMonth.getFullYear();
					const month = currentMonth.getMonth();
					const firstDay = new Date(year, month, 1).getDay();
					const daysInMonth = new Date(year, month + 1, 0).getDate();
					const startOffset = firstDay === 0 ? 6 : firstDay - 1;

					const cells = [];

					for (let i = 0; i < startOffset; i++) {
						cells.push(<div key={`empty-${i}`} className="p-2"></div>);
					}

					for (let day = 1; day <= daysInMonth; day++) {
						const date = new Date(year, month, day);
						const dayOfWeek = date.getDay();
						const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

						const dayShifts = shifts.filter(s => s.date === day);

						cells.push(
							<div
								key={day}
								className={`p-2 rounded-lg border ${
									isWeekend ? 'border-red-500/30 bg-red-900/20' : 'border-slate-600'
								} ${dayShifts.length > 0 ? 'bg-slate-700' : 'bg-slate-800/50'}`}
							>
								<div className={`text-center font-semibold mb-1 ${isWeekend ? 'text-red-400' : ''}`}>
									{day}
								</div>
								{dayShifts.map((shift, idx) => (
									<div
										key={idx}
										className="text-xs p-1 rounded mb-1"
										style={{ backgroundColor: getEmployeeColor(selectedEmployee) }}
									>
										<div className="font-medium">{shift.shift}</div>
									</div>
								))}
							</div>
						);
					}

					return cells;
				})()}
			</div>

			{/* Список смен */}
			<div>
				<h4 className="text-lg font-semibold mb-3">Список смен</h4>
				<div className="space-y-2 max-h-96 overflow-y-auto">
					{shifts.map((shift, idx) => (
						<div
							key={idx}
							className={`p-3 rounded-lg ${shift.isWeekend ? 'bg-red-900/20 border border-red-500/30' : 'bg-slate-700/50'}`}
						>
							<div className="flex items-center justify-between">
								<div>
                  <span className={`font-semibold ${shift.isWeekend ? 'text-red-400' : ''}`}>
                    {shift.date}.{String(currentMonth.getMonth() + 1).padStart(2, '0')} ({shift.dayOfWeek})
                  </span>
								</div>
								<div className="flex gap-2">
                  <span className="px-3 py-1 rounded-lg bg-blue-500 text-sm">
                    {shift.shift}
                  </span>
									<span className="px-3 py-1 rounded-lg bg-purple-500 text-sm">
                    {shift.role}
                  </span>
								</div>
							</div>
						</div>
					))}
					{shifts.length === 0 && (
						<div className="text-center text-slate-400 py-8">
							У {selectedEmployee} нет смен в этом месяце
						</div>
					)}
				</div>
			</div>
		</div>
	);
}